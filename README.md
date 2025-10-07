# 🗑️ SmartBin — Intelligent Waste Bin with Map Tracking & People Detection

SmartBin is a **Next.js + Supabase + Clerk** powered IoT project designed to revolutionize waste management.  
It tracks smart bins on a map in real time, monitors fill levels, detects nearby people, and provides data-driven insights for efficient collection routes.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | [Next.js 14](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| **Backend / Database** | [Supabase](https://supabase.com/) (PostgreSQL + Realtime) |
| **Authentication** | [Clerk](https://clerk.dev/) |
| **Map Integration** | [Leaflet](https://leafletjs.com/) / [Mapbox](https://www.mapbox.com/) |
| **Device Communication** | REST API / Supabase Edge Functions / MQTT bridge |
| **Deployment** | Vercel / Docker (optional) |

---

## 🧭 Overview

SmartBin is an IoT-based smart waste management system that allows:

- 📍 **Map tracking** of all bins in real-time  
- 🧠 **People detection** for activity awareness (e.g., ultrasonic or camera sensors)  
- 📊 **Automatic fill-level monitoring** via sensors  
- 🔔 **Realtime alerts** when bins are full  
- 🗺️ **Dashboard visualization** for admins to manage collection and routes  

---

## 🧩 Architecture

```text
┌────────────┐        ┌───────────────┐        ┌───────────────┐
│  Smart Bin │──Data──▶ Supabase (DB) │──API──▶ Next.js Frontend│
│ (Sensors)  │        │ Realtime +    │        │ (Dashboard UI) │
│ + MicroCtrl│        │ Edge Functions│        └────────────────┘
└────────────┘        └──────┬────────┘
                              │
                       ┌──────▼──────┐
                       │   Clerk     │
                       │ Auth & Users│
                       └─────────────┘
