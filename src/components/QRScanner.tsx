'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Hash, X } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { supabase } from '@/lib/supabase';

interface QRScannerProps {
  onScanComplete: (points: number) => void;
}

export function QRScanner({ onScanComplete }: QRScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [qrCodeResult, setQrCodeResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [showCamera, setShowCamera] = useState(true); // Auto-show camera
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Valid 6-digit codes for Smart Bins (will be fetched from database)
  const [validCodes, setValidCodes] = useState<string[]>([]);

  const handleQRScan = async (result: string) => {
    if (result) {
      setIsScanning(true);
      setScanResult(null);
      setQrCodeResult(result);

      try {
        // Check if the scanned code is a valid 6-digit bin code using bin_status_view
        const { data: binData, error: binError } = await supabase
          .from('bin_status_view')
          .select('*')
          .eq('bin_code', result)
          .eq('status', 'active')
          .single();

        if (binError || !binData) {
          setScanResult('Invalid QR code. Please scan a valid Smart Bin QR code.');
          setIsScanning(false);
          return;
        }

        // Award points for successful scan of valid bin
        const points = 10; // Fixed 10 points per scan
        setScanResult(`QR Code scanned successfully! You earned ${points} points.`);
        onScanComplete(points);
        setIsScanning(false);
      } catch (err) {
        console.error('Error validating QR code:', err);
        setScanResult('Error validating QR code. Please try again.');
        setIsScanning(false);
      }
    }
  };

  const handleQRScanError = (error: unknown) => {
    console.error('QR Scan Error:', error);
    setScanResult('QR code scanning error. Please try again.');
  };

  const handleManualSubmit = async () => {
    if (manualCode.length !== 6) {
      setScanResult('Please enter a 6-digit code.');
      return;
    }

    try {
      // Check if the manual code is a valid bin code using bin_status_view
      const { data: binData, error: binError } = await supabase
        .from('bin_status_view')
        .select('*')
        .eq('bin_code', manualCode)
        .eq('status', 'active')
        .single();

      if (binError || !binData) {
        setScanResult('Invalid code. Please enter a valid Smart Bin code.');
        return;
      }

      // Award points for successful manual code entry
      const points = 10; // Fixed 10 points per scan
      setQrCodeResult(`Manual Code: ${manualCode}`);
      setScanResult(`Code verified! You earned ${points} points.`);
      onScanComplete(points);
      setManualCode('');
    } catch (err) {
      console.error('Error validating manual code:', err);
      setScanResult('Error validating code. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate QR code processing
      setIsScanning(true);
      setScanResult(null);

      setTimeout(() => {
        const points = 10; // Fixed 10 points per scan
        setQrCodeResult(`Uploaded: ${file.name}`);
        setScanResult(`QR code processed! You earned ${points} points.`);
        onScanComplete(points);
        setIsScanning(false);
      }, 2000);
    }
  };

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

  // Fetch valid bin codes from database using bin_status_view
  useEffect(() => {
    const fetchBinCodes = async () => {
      try {
        const { data, error } = await supabase
          .from('bin_status_view')
          .select('bin_code')
          .eq('status', 'active');

        if (error) {
          console.error('Error fetching bin codes:', error);
          // Fallback to hardcoded codes if database fails
          setValidCodes(['123456', '789012', '345678', '901234', '567890']);
        } else {
          const codes = data?.map(bin => bin.bin_code) || [];
          setValidCodes(codes);
        }
      } catch (err) {
        console.error('Error fetching bin codes:', err);
        // Fallback to hardcoded codes
        setValidCodes(['123456', '789012', '345678', '901234', '567890']);
      }
    };

    fetchBinCodes();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Scan QR Code
      </h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'camera'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Camera</span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Manual</span>
        </button>
      </div>

      {/* Camera Tab */}
      {activeTab === 'camera' && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Point your camera at a Smart Bin QR code
          </p>
          
          {showCamera ? (
            <div className="relative mb-4 flex justify-center">
              <div className="relative w-[600px] h-[600px] rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                <Scanner
                  onScan={(result) => handleQRScan(result[0]?.rawValue || '')}
                  onError={handleQRScanError}
                  components={{
                    finder: false,
                  }}
                  styles={{
                    container: {
                      width: '100%',
                      height: '100%',
                    },
                    video: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    },
                  }}
                />
                <button
                  onClick={toggleCamera}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* QR Code scanning overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-indigo-500 rounded-br-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={toggleCamera}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Camera
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Make sure to allow camera permissions when prompted
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Upload a QR code image to scan
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto"
          >
            {isScanning ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Choose Image
              </>
            )}
          </button>
        </div>
      )}

      {/* Manual Tab */}
      {activeTab === 'manual' && (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Enter the 6-digit code from the Smart Bin
          </p>
          <div className="max-w-xs mx-auto">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              maxLength={6}
            />
            <button
              onClick={handleManualSubmit}
              disabled={manualCode.length !== 6}
              className="w-full mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Hash className="w-5 h-5 mr-2" />
              Verify Code
            </button>
          </div>
          {/* Show valid codes for testing */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Valid test codes:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {validCodes.slice(0, 5).map((code) => (
                <span key={code} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR Code Result Display */}
      {qrCodeResult && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">QR Code Result:</h4>
          <p className="text-sm text-gray-900 dark:text-gray-100 font-mono bg-white dark:bg-gray-800 p-3 rounded border break-all">
            {qrCodeResult}
          </p>
        </div>
      )}

      {/* Result Display */}
      {scanResult && (
        <div className="mt-6 p-4 rounded-lg text-center">
          <p className={`font-medium ${
            scanResult.includes('earned') || scanResult.includes('verified') || scanResult.includes('processed')
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {scanResult}
          </p>
        </div>
      )}
    </div>
  );
}