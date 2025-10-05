'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapTracker.css';
import { supabase, UserRole } from '@/lib/supabase';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Import Leaflet Routing Machine
import 'leaflet-routing-machine';

// Extend Leaflet types for routing
declare module 'leaflet' {
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: LatLng[];
      routeWhileDragging?: boolean;
      addWaypoints?: boolean;
      createMarker?: () => any;
      lineOptions?: any;
      show?: boolean;
    }
    
    function control(options: RoutingControlOptions): any;
  }
}

// Declare global L.Routing for TypeScript
declare global {
  namespace L {
    namespace Routing {
      function control(options: any): any;
    }
  }
}


// Configuration de la carte Leaflet
const defaultCenter = [35.826, 10.637]; // Sousse, Tunisia

const zoom = 12;

// 🎨 Get status color based on capacity percentage
const getStatusColor = (capacityPercentage: number) => {
  if (capacityPercentage >= 80) return '#ff4444'; // Full
  if (capacityPercentage >= 40) return '#ff8800'; // Half
  return '#44ff44'; // Empty
};

// Get status text based on capacity percentage
const getStatusText = (capacityPercentage: number) => {
  if (capacityPercentage >= 80) return 'full';
  if (capacityPercentage >= 40) return 'half';
  return 'empty';
};

// Fonction utilitaire pour calculer la distance entre deux points (formule de Haversine)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en kilomètres
};

// Fonction pour trouver la poubelle la plus proche
const findNearestBin = (userLat: number, userLng: number, binsList: any[]) => {
  if (!binsList || binsList.length === 0) return null;

  let nearestBin = null;
  let minDistance = Infinity;

  binsList
    .filter(bin => bin.latitude && bin.longitude && !isNaN(bin.latitude) && !isNaN(bin.longitude))
    .forEach(bin => {
      const distance = calculateDistance(userLat, userLng, bin.latitude, bin.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestBin = { ...bin, distance };
      }
    });

  return nearestBin;
};

// 🧭 Find nearest empty bin for regular users
const findNearestEmptyBin = (userLat: number, userLng: number, binsList: any[]) => {
  if (!binsList || binsList.length === 0) return null;

  const emptyBins = binsList.filter(bin => 
    bin.capacity_percentage < 40 && 
    bin.latitude && bin.longitude && 
    !isNaN(bin.latitude) && !isNaN(bin.longitude)
  );
  if (emptyBins.length === 0) return null;

  let nearestEmptyBin = null;
  let minDistance = Infinity;

  emptyBins.forEach(bin => {
    const distance = calculateDistance(userLat, userLng, bin.latitude, bin.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearestEmptyBin = { ...bin, distance };
    }
  });

  return nearestEmptyBin;
};

// 🚛 Calculate optimal route for full bins (municipality workers)
const calculateFullBinsRoute = (startLat: number, startLng: number, binsList: any[]) => {
  const fullBins = binsList.filter(bin => 
    bin.capacity_percentage >= 80 && 
    bin.latitude && bin.longitude && 
    !isNaN(bin.latitude) && !isNaN(bin.longitude)
  );
  if (fullBins.length === 0) return null;

  // Simple nearest-neighbor algorithm (greedy approach)
  const route = [];
  const unvisited = [...fullBins];
  let currentLat = startLat;
  let currentLng = startLng;
  let totalDistance = 0;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let minDistance = Infinity;

    // Find nearest unvisited bin
    for (let index = 0; index < unvisited.length; index++) {
      const bin = unvisited[index];
      const distance = calculateDistance(currentLat, currentLng, bin.latitude, bin.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    }

    const nearestBin = unvisited[nearestIndex];
    route.push({
      ...nearestBin,
      distance: minDistance,
      order: route.length + 1
    });

    totalDistance += minDistance;
    currentLat = nearestBin.latitude;
    currentLng = nearestBin.longitude;
    unvisited.splice(nearestIndex, 1);
  }

  return {
    bins: route,
    totalDistance,
    binCount: route.length
  };
};

// 🏢 Municipal center coordinates (Sousse, Tunisia)
const MUNICIPAL_CENTER = {
  lat: 35.8260,
  lng: 10.6370,
  name: 'Centre Municipal de Sousse'
};

// Configuration des icônes Leaflet personnalisées
const createCustomIcon = (capacityPercentage: number, isNearest = false) => {
  const color = getStatusColor(capacityPercentage);

  const size = isNearest ? 30 : 20;
  const borderWidth = isNearest ? 4 : 3;
  const borderColor = isNearest ? '#ffd700' : 'white';
  const shadow = isNearest ? '0 4px 8px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.3)';

  return L.divIcon({
    className: isNearest ? 'custom-marker nearest-marker' : 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: ${borderWidth}px solid ${borderColor};
      box-shadow: ${shadow};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isNearest ? '14px' : '12px'};
      color: white;
      font-weight: bold;
      animation: ${isNearest ? 'pulse 2s infinite' : 'none'};
    ">${getStatusEmoji(capacityPercentage)}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Fonction pour obtenir l'emoji du statut
const getStatusEmoji = (capacityPercentage: number) => {
  if (capacityPercentage >= 80) return '🔴'; // Full
  if (capacityPercentage >= 40) return '🟠'; // Half
  return '🟢'; // Empty
};

// Component to handle map instance and user location updates
// This component must be a direct child of MapContainer to use useMap()
const MapController = ({ 
  userPosition, 
  setNearestBin, 
  bins, 
  showUserRoute, 
  showMunicipalRoute, 
  nearestEmptyBin, 
  fullBinsRoute 
}: {
  userPosition: { lat: number; lng: number } | null;
  setNearestBin: (bin: any) => void;
  bins: any[];
  showUserRoute: boolean;
  showMunicipalRoute: boolean;
  nearestEmptyBin: any;
  fullBinsRoute: any;
}) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  // Effect to handle user position changes and map flying
  useEffect(() => {
    if (userPosition) {
      // Fly to user position smoothly without resetting the map
      map.flyTo([userPosition.lat, userPosition.lng], 16, {
        animate: true,
        duration: 1.5
      });
    }
  }, [userPosition, map]); // Only depends on userPosition and map

  // Separate effect for nearest bin calculation - memoized to prevent unnecessary calls
  const calculateNearestBin = useCallback(() => {
    if (userPosition && bins.length > 0) {
      const nearest = findNearestBin(userPosition.lat, userPosition.lng, bins);
      setNearestBin(nearest);
    }
  }, [userPosition, bins, setNearestBin]);

  useEffect(() => {
    calculateNearestBin();
  }, [calculateNearestBin]);

  // Effect to handle routing with Leaflet Routing Machine
  useEffect(() => {
    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (showUserRoute && nearestEmptyBin) {
      try {
        // Determine starting point - user location if available, otherwise map center
        const startLat = userPosition ? userPosition.lat : defaultCenter[0];
        const startLng = userPosition ? userPosition.lng : defaultCenter[1];
        
        // Create routing control for user to nearest empty bin
        const routingControl = (L as any).Routing.control({
          waypoints: [
            L.latLng(startLat, startLng),
            L.latLng(nearestEmptyBin.latitude, nearestEmptyBin.longitude)
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null, // Disable default markers
          lineOptions: {
            styles: [{ color: '#0066ff', weight: 6, opacity: 0.9 }]
          },
          show: false // Hide the routing control panel
        }).addTo(map);

        routingControlRef.current = routingControl;

        // Fit map to route
        routingControl.on('routesfound', (e: any) => {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            const route = routes[0];
            map.fitBounds(route.coordinates, { padding: [20, 20] });
          }
        });

        // Handle routing errors
        routingControl.on('routingerror', (e: any) => {
          console.warn('Routing error:', e);
        });
      } catch (error) {
        console.error('Error creating routing control:', error);
      }

    } else if (showMunicipalRoute && fullBinsRoute && fullBinsRoute.bins.length > 0) {
      try {
        // Create routing control for municipal route
        const waypoints = [
          L.latLng(MUNICIPAL_CENTER.lat, MUNICIPAL_CENTER.lng),
          ...fullBinsRoute.bins.map((bin: any) => L.latLng(bin.latitude, bin.longitude)),
          L.latLng(MUNICIPAL_CENTER.lat, MUNICIPAL_CENTER.lng) // Return to depot
        ];

        const routingControl = (L as any).Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          addWaypoints: false,
          createMarker: () => null, // Disable default markers
          lineOptions: {
            styles: [{ color: '#e74c3c', weight: 6, opacity: 0.8 }]
          },
          show: false // Hide the routing control panel
        }).addTo(map);

        routingControlRef.current = routingControl;

        // Fit map to route
        routingControl.on('routesfound', (e: any) => {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            const route = routes[0];
            map.fitBounds(route.coordinates, { padding: [20, 20] });
          }
        });

        // Handle routing errors
        routingControl.on('routingerror', (e: any) => {
          console.warn('Routing error:', e);
        });
      } catch (error) {
        console.error('Error creating municipal routing control:', error);
      }
    }

    // Cleanup function
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [showUserRoute, showMunicipalRoute, nearestEmptyBin, fullBinsRoute, userPosition, map]);

  return null; // This component doesn't render anything
};

// Demo data - moved outside component to avoid dependency issues
const demoBins = [
  {
    id: '1',
    bin_code: '123456',
    location_name: 'Centre-ville Sousse',
    latitude: 35.8260,
    longitude: 10.6370,
    capacity_percentage: 85,
    status: 'active',
    bin_type: 'general',
    address: 'Avenue Habib Bourguiba, Sousse',
    last_collected: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    bin_code: '789012',
    location_name: 'Port El Kantaoui',
    latitude: 35.8256,
    longitude: 10.6411,
    capacity_percentage: 45,
    status: 'active',
    bin_type: 'recyclable',
    address: 'Port El Kantaoui, Sousse',
    last_collected: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    bin_code: '345678',
    location_name: 'Médina de Sousse',
    latitude: 35.8280,
    longitude: 10.6350,
    capacity_percentage: 15,
    status: 'active',
    bin_type: 'general',
    address: 'Médina, Sousse',
    last_collected: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    bin_code: '901234',
    location_name: 'Université de Sousse',
    latitude: 35.8230,
    longitude: 10.6420,
    capacity_percentage: 92,
    status: 'active',
    bin_type: 'organic',
    address: 'Université de Sousse, Sahloul',
    last_collected: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    bin_code: '567890',
    location_name: 'Zone touristique',
    latitude: 35.8300,
    longitude: 10.6450,
    capacity_percentage: 60,
    status: 'active',
    bin_type: 'plastic',
    address: 'Zone touristique, Sousse',
    last_collected: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
interface MapTrackerProps {
  userRole?: UserRole;
}

const MapTracker = ({ userRole = UserRole.MEMBER }: MapTrackerProps) => {
  // State for bins data - loaded once and kept stable
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for user location - separate from bins to prevent re-renders
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestBin, setNearestBin] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // 🧭 Routing states
  const [nearestEmptyBin, setNearestEmptyBin] = useState<any>(null);
  const [fullBinsRoute, setFullBinsRoute] = useState<any>(null);
  const [showUserRoute, setShowUserRoute] = useState(false);
  const [showMunicipalRoute, setShowMunicipalRoute] = useState(false);
  
  // Determine if user has admin privileges based on role
  const isAdminMode = userRole === UserRole.AGENT_MUNICIPAL || userRole === UserRole.CHEF_MUNICIPAL;

  // Function to get user's geolocation using navigator.geolocation
  // This function only updates userPosition state, keeping bins stable
  const getUserLocation = useCallback(() => {
    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    // Use navigator.geolocation.getCurrentPosition to get user's coordinates
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Extract latitude and longitude from position object
        const { latitude, longitude, accuracy } = position.coords;
        
        // Only update if accuracy is reasonable (less than 50 meters for better precision)
        if (accuracy > 50) {
          console.warn('Location accuracy is low:', accuracy, 'meters');
        }
        
        const location = { lat: latitude, lng: longitude };

        // Update only userPosition state - this won't affect bins
        setUserPosition(location);
        setIsLocating(false);

        console.log('User location updated:', location, 'Accuracy:', accuracy, 'meters');
      },
      (error) => {
        // Handle different geolocation errors with clear messages
        let errorMessage = 'Error getting location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied by user. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please check your GPS/network connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          default:
            errorMessage = 'Unknown location error occurred';
            break;
        }
        console.error('Geolocation error:', error);
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true, // Use GPS if available for better accuracy
        timeout: 20000, // 20 second timeout for better reliability
        maximumAge: 60000 // Cache location for 1 minute for better accuracy
      }
    );
  }, []); // Empty dependency array - function doesn't depend on bins

  // 🧭 Find nearest empty bin for regular users (optional - works with or without user location)
  const findNearestEmptyBinRoute = useCallback(() => {
    let searchLat, searchLng, searchName;
    
    if (userPosition) {
      // Use user's location if available
      searchLat = userPosition.lat;
      searchLng = userPosition.lng;
      searchName = 'your location';
    } else {
      // Use map center as fallback
      searchLat = defaultCenter[0];
      searchLng = defaultCenter[1];
      searchName = 'map center (Sousse)';
    }

    const emptyBin = findNearestEmptyBin(searchLat, searchLng, bins);
    if (emptyBin) {
      setNearestEmptyBin(emptyBin);
      setShowUserRoute(true);
      setShowMunicipalRoute(false); // Hide municipal route
      console.log(`Found nearest empty bin from ${searchName}:`, emptyBin);
    } else {
      alert('No empty bins found in the area. Try refreshing the data or check if there are any empty bins nearby.');
    }
  }, [userPosition, bins]);

  // 🎯 New function: Find nearest empty bin with precise geolocation
  const findNearestEmptyBinWithLocation = useCallback(() => {
    // First, get precise user location
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Only proceed if accuracy is reasonable (less than 50 meters)
        if (accuracy > 50) {
          console.warn('Location accuracy is low:', accuracy, 'meters');
        }
        
        const location = { lat: latitude, lng: longitude };
        setUserPosition(location);
        setIsLocating(false);

        // Now find the nearest empty bin
        const emptyBin = findNearestEmptyBin(location.lat, location.lng, bins);
        if (emptyBin) {
          setNearestEmptyBin(emptyBin);
          setShowUserRoute(true);
          setShowMunicipalRoute(false);
          console.log('Found nearest empty bin from your precise location:', emptyBin);
        } else {
          alert('Aucune poubelle vide trouvée dans la zone. Essayez de rafraîchir les données ou vérifiez s\'il y a des poubelles vides à proximité.');
        }
      },
      (error) => {
        let errorMessage = 'Erreur lors de la localisation';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission de localisation refusée. Veuillez activer les permissions de localisation.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informations de localisation indisponibles. Vérifiez votre connexion GPS/réseau.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Demande de localisation expirée. Veuillez réessayer.';
            break;
          default:
            errorMessage = 'Erreur de localisation inconnue';
            break;
        }
        console.error('Geolocation error:', error);
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000
      }
    );
  }, [bins]);

  // 🚛 Calculate and show route for full bins (admin mode)
  const calculateMunicipalRoute = useCallback(() => {
    const route = calculateFullBinsRoute(MUNICIPAL_CENTER.lat, MUNICIPAL_CENTER.lng, bins);
    if (route) {
      setFullBinsRoute(route);
      setShowMunicipalRoute(true);
      setShowUserRoute(false); // Hide user route
      console.log('Municipal route calculated:', route);
    } else {
      alert('No full bins found to create a route. All bins are empty or half-full.');
    }
  }, [bins]);

  // Clear routes when role changes
  useEffect(() => {
    setShowUserRoute(false);
    setShowMunicipalRoute(false);
    setNearestEmptyBin(null);
    setFullBinsRoute(null);
  }, [userRole]);

  // Clear all routes
  const clearRoutes = useCallback(() => {
    setShowUserRoute(false);
    setShowMunicipalRoute(false);
    setNearestEmptyBin(null);
    setFullBinsRoute(null);
  }, []);

  // Load bins data from Supabase - this runs only once on component mount
  // Bins data remains stable and doesn't cause re-renders when user location changes
  useEffect(() => {
    const fetchBins = async () => {
      try {
        // Try to load from Supabase bin_status_view
        const { data, error } = await supabase
          .from('bin_status_view')
          .select('*')
          .eq('status', 'active');

        if (error) {
          console.error('Error fetching bins from Supabase:', error);
          // Use demo data if Supabase fails
          setBins(demoBins);
        } else if (data && data.length > 0) {
          // Filter out bins with invalid coordinates
          const validBins = data.filter(bin => 
            bin.latitude && bin.longitude && 
            !isNaN(bin.latitude) && !isNaN(bin.longitude) &&
            bin.latitude >= -90 && bin.latitude <= 90 &&
            bin.longitude >= -180 && bin.longitude <= 180
          );
          console.log(`Loaded ${validBins.length} valid bins from database (${data.length - validBins.length} invalid filtered out)`);
          setBins(validBins.length > 0 ? validBins : demoBins);
        } else {
          // Use demo data if no bins found
          console.log('No bins found in database, using demo data');
          setBins(demoBins);
        }
      } catch (err) {
        console.error('Error connecting to Supabase:', err);
        // Use demo data as fallback
        setBins(demoBins);
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, []); // Empty dependency array - runs only once

  // Note: nearestBin calculation is now handled in MapController component
  // This prevents unnecessary re-renders when user position changes

  // Memoize bin markers to prevent them from disappearing on re-renders
  // This only depends on bins data, NOT on nearestBin to keep markers stable
  const binMarkers = useMemo(() => {
    console.log('Rendering bin markers, count:', bins.length);
    return bins
      .filter(bin => bin.latitude && bin.longitude && !isNaN(bin.latitude) && !isNaN(bin.longitude))
      .map((bin, index) => {
        return (
          <Marker
            key={bin.id || index}
            position={[bin.latitude, bin.longitude] as [number, number]}
            icon={createCustomIcon(bin.capacity_percentage || 0, false)} // Always use normal icon
          >
          <Popup>
            <div className="popup-content">
              <h3>
                {bin.location_name}
                {nearestBin && nearestBin.id === bin.id && <span className="nearest-badge"> 🏆 Closest</span>}
              </h3>
              <div className="popup-status">
                <span className="status-emoji">
                  {getStatusEmoji(bin.capacity_percentage)}
                </span>
                <span
                  className="status-text"
                  style={{ backgroundColor: getStatusColor(bin.capacity_percentage) }}
                >
                  {getStatusText(bin.capacity_percentage).toUpperCase()}
                </span>
              </div>
              <p>Capacity: {bin.capacity_percentage || 0}%</p>
              {bin.address && <p>📍 {bin.address}</p>}
              {bin.bin_type && <p>Type: {bin.bin_type}</p>}
              <p>Code: {bin.bin_code || 'N/A'}</p>
              {nearestBin && nearestBin.id === bin.id && (
                <p className="distance-info">Distance: {nearestBin.distance.toFixed(2)} km</p>
              )}
              <p className="last-update">
                Last collected: {bin.last_collected ? new Date(bin.last_collected).toLocaleString('en-US') : 'Never'}
              </p>
            </div>
          </Popup>
        </Marker>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bins]); // Only re-render when bins change, NOT when nearestBin changes

  // Separate component for nearest bin highlighting
  const nearestBinMarker = useMemo(() => {
    if (!nearestBin || !nearestBin.latitude || !nearestBin.longitude || 
        isNaN(nearestBin.latitude) || isNaN(nearestBin.longitude)) return null;
    
    return (
      <Marker
        key={`nearest-${nearestBin.id}`}
        position={[nearestBin.latitude, nearestBin.longitude] as [number, number]}
        icon={createCustomIcon(nearestBin.capacity_percentage || 0, true)} // Highlighted icon
      >
        <Popup>
          <div className="popup-content">
            <h3>
              {nearestBin.location_name}
              <span className="nearest-badge"> 🏆 Closest</span>
            </h3>
            <div className="popup-status">
              <span className="status-emoji">
                {getStatusEmoji(nearestBin.capacity_percentage)}
              </span>
              <span
                className="status-text"
                style={{ backgroundColor: getStatusColor(nearestBin.capacity_percentage) }}
              >
                {getStatusText(nearestBin.capacity_percentage).toUpperCase()}
              </span>
            </div>
            <p>Capacity: {nearestBin.capacity_percentage || 0}%</p>
            {nearestBin.address && <p>📍 {nearestBin.address}</p>}
            {nearestBin.bin_type && <p>Type: {nearestBin.bin_type}</p>}
            <p>Code: {nearestBin.bin_code || 'N/A'}</p>
            <p className="distance-info">Distance: {nearestBin.distance.toFixed(2)} km</p>
            <p className="last-update">
              Last collected: {nearestBin.last_collected ? new Date(nearestBin.last_collected).toLocaleString('en-US') : 'Never'}
            </p>
          </div>
        </Popup>
      </Marker>
    );
  }, [nearestBin]); // Only re-render when nearestBin changes

 

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      {/* Legend - shows bin status information */}
      <div className="legend">
        <h3>État des poubelles</h3>
        <div className="legend-item">
          <span className="legend-emoji">🔴</span>
          <span>Pleine (80-100%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-emoji">🟠</span>
          <span>À moitié (40-79%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-emoji">🟢</span>
          <span>Vide (0-39%)</span>
        </div>
        <div className="legend-stats">
          <p>Total: {bins.length} poubelles</p>
          <p>Pleines: {bins.filter(bin => (bin.capacity_percentage || 0) >= 80).length}</p>
          <p>À moitié: {bins.filter(bin => (bin.capacity_percentage || 0) >= 40 && (bin.capacity_percentage || 0) < 80).length}</p>
          <p>Vides: {bins.filter(bin => (bin.capacity_percentage || 0) < 40).length}</p>
        </div>
      </div>

      {/* Geolocation controls - separate from map to prevent re-renders */}
      <div className="location-controls">
        <button
          className="location-button"
          onClick={getUserLocation}
          disabled={isLocating}
        >
          {isLocating ? '📍 Locating...' : '📍 Add My Location'}
        </button>

        {locationError && (
          <div className="location-error">
            ⚠️ {locationError}
          </div>
        )}

        {userPosition && (
          <div className="location-info">
            <p>📍 Position: {userPosition.lat.toFixed(4)}, {userPosition.lng.toFixed(4)}</p>
          </div>
        )}
      </div>

      {/* 🧭 Routing controls */}
      <div className="routing-controls">
        {/* Role indicator */}
        <div className="role-indicator">
          <span className="role-badge">
            {userRole === UserRole.MEMBER && '👤 Member Mode'}
            {userRole === UserRole.AGENT_MUNICIPAL && '🚛 Agent Municipal'}
            {userRole === UserRole.CHEF_MUNICIPAL && '👑 Chef Municipal'}
          </span>
        </div>

        {/* User routing button */}
        {!isAdminMode && (
          <>
            <button
              className="routing-button user-route"
              onClick={findNearestEmptyBinWithLocation}
              disabled={isLocating}
            >
              {isLocating ? '📍 Locating...' : '📍 Afficher le chemin vers la poubelle vide la plus proche'}
            </button>
            <button
              className="routing-button user-route-secondary"
              onClick={findNearestEmptyBinRoute}
            >
              🧭 Find Nearest Empty Bin
              {userPosition ? ' (from your location)' : ' (from map center)'}
            </button>
          </>
        )}

        {/* Municipal routing button */}
        {isAdminMode && (
          <button
            className="routing-button municipal-route"
            onClick={calculateMunicipalRoute}
          >
            🚛 Show Optimal Route
          </button>
        )}

        {/* Clear routes button */}
        {(showUserRoute || showMunicipalRoute) && (
          <button
            className="routing-button clear-route"
            onClick={clearRoutes}
          >
            ❌ Clear Routes
          </button>
        )}
      </div>

      {/* Nearest bin card - shows closest bin information */}
      {nearestBin && !showUserRoute && !showMunicipalRoute && (
        <div className="nearest-bin-card">
          <h4>🗑️ Poubelle la plus proche</h4>
          <div className="nearest-bin-info">
            <p><strong>{nearestBin.location_name}</strong></p>
            <p>📍 {nearestBin.address}</p>
            <p>Distance: {nearestBin.distance.toFixed(2)} km</p>
            <div className="nearest-bin-status">
              <span className="status-emoji">
                {getStatusEmoji(nearestBin.capacity_percentage)}
              </span>
              <span
                className="status-text"
                style={{ backgroundColor: getStatusColor(nearestBin.capacity_percentage) }}
              >
                {getStatusText(nearestBin.capacity_percentage).toUpperCase()}
              </span>
            </div>
            <p>Capacité: {nearestBin.capacity_percentage || 0}%</p>
            <p>Code: {nearestBin.bin_code || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* 🧭 User route information */}
      {showUserRoute && nearestEmptyBin && (
        <div className="route-info-card user-route-info">
          <h4>🧭 Chemin vers la poubelle vide la plus proche</h4>
          <div className="route-info">
            <p><strong>{nearestEmptyBin.location_name}</strong></p>
            <p>📍 {nearestEmptyBin.address}</p>
            <p>Code: {nearestEmptyBin.bin_code || 'N/A'}</p>
            <p className="route-distance">Distance: {nearestEmptyBin.distance.toFixed(2)} km</p>
            <p className="route-time">Temps de marche estimé: {Math.round(nearestEmptyBin.distance * 12)} minutes</p>
            <p className="route-start">
              🚀 Départ: {userPosition ? 'Votre position' : 'Centre de la carte (Sousse)'}
            </p>
            <div className="route-status">
              <span className="status-emoji">🟢</span>
              <span className="status-text">VIDE</span>
            </div>
            <div className="route-instructions">
              <p>💡 <strong>Instructions:</strong> Suivez la ligne bleue sur la carte pour atteindre la poubelle vide la plus proche.</p>
            </div>
          </div>
        </div>
      )}

      {/* 🚛 Municipal route information */}
      {showMunicipalRoute && fullBinsRoute && (
        <div className="route-info-card municipal-route-info">
          <h4>🚛 Municipal Collection Route</h4>
          <div className="route-info">
            <p><strong>Route covers {fullBinsRoute.binCount} full bins</strong></p>
            <p className="route-distance">Total distance: {fullBinsRoute.totalDistance.toFixed(2)} km</p>
            <p className="route-time">Estimated collection time: {Math.round(fullBinsRoute.totalDistance * 3)} minutes</p>
            <div className="route-bins-list">
              <p><strong>Collection order:</strong></p>
              <ol>
                {fullBinsRoute.bins.map((bin: any, index: number) => (
                  <li key={bin.id}>
                    {bin.location_name} ({bin.distance.toFixed(2)} km) - {bin.bin_code || 'N/A'}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Map container - fixed size and centered */}
      <div className="map-wrapper">
        <MapContainer
          key="main-map" // Stable key to prevent re-renders
          center={defaultCenter as [number, number]} // Always start with default center
          zoom={zoom}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

            {/* MapController component handles user position updates and map flying */}
            <MapController
              userPosition={userPosition}
              setNearestBin={setNearestBin}
              bins={bins}
              showUserRoute={showUserRoute}
              showMunicipalRoute={showMunicipalRoute}
              nearestEmptyBin={nearestEmptyBin}
              fullBinsRoute={fullBinsRoute}
            />

          {/* User location marker - only rendered when userPosition exists */}
          {userPosition && (
            <Marker
              position={[userPosition.lat, userPosition.lng] as [number, number]}
              icon={L.divIcon({
                className: 'user-location-marker',
                html: `<div style="
                  background-color: #4285f4;
                  width: 25px;
                  height: 25px;
                  border-radius: 50%;
                  border: 4px solid white;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 14px;
                  color: white;
                  font-weight: bold;
                ">📍</div>`,
                iconSize: [25, 25],
                iconAnchor: [12, 12]
              })}
            >
              <Popup>
                <div className="popup-content">
                  <h3>📍 Your Location</h3>
                  <p>Lat: {userPosition.lat.toFixed(6)}</p>
                  <p>Lng: {userPosition.lng.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}

            {/* Bin markers - stable and never disappear */}
            {binMarkers}
            
            {/* Nearest bin marker - separate for highlighting */}
            {nearestBinMarker}

            {/* Routes are now handled by Leaflet Routing Machine in MapController */}

            {/* 🚀 Starting point marker for user route (when using map center) */}
            {showUserRoute && !userPosition && nearestEmptyBin && (
              <Marker
                position={[defaultCenter[0], defaultCenter[1]] as [number, number]}
                icon={L.divIcon({
                  className: 'starting-point-marker',
                  html: `<div style="
                    background-color: #4285f4;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    border: 4px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    font-weight: bold;
                  ">🚀</div>`,
                  iconSize: [25, 25],
                  iconAnchor: [12, 12]
                })}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>🚀 Starting Point</h3>
                    <p>Route starts from map center (Sousse)</p>
                    <p>Click "Add My Location" for personal routing</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* 🏢 Municipal center marker (admin mode) */}
            {isAdminMode && (
              <Marker
                position={[MUNICIPAL_CENTER.lat, MUNICIPAL_CENTER.lng] as [number, number]}
                icon={L.divIcon({
                  className: 'municipal-center-marker',
                  html: `<div style="
                    background-color: #8B4513;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    border: 4px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                    font-weight: bold;
                  ">🏢</div>`,
                  iconSize: [25, 25],
                  iconAnchor: [12, 12]
                })}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>🏢 {MUNICIPAL_CENTER.name}</h3>
                    <p>Starting point for municipal routes</p>
                  </div>
                </Popup>
              </Marker>
            )}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapTracker;
