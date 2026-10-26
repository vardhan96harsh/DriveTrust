"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Layers, Navigation, Compass, MapPin, ZoomIn, ZoomOut, Check, Globe } from "lucide-react";
import { VIDISHA_KML_POLYGON_LEAFLET } from "@/data/vidishaGeofence";

export type CityKey = "VIDISHA" | "BHOPAL" | "BHOPAL_VIDISHA" | "BANGALORE";

export interface CityPreset {
  id: CityKey;
  name: string;
  state: string;
  center: [number, number];
  zoom: number;
  pickup: [number, number];
  pickupLabel: string;
  dropoff: [number, number];
  dropoffLabel: string;
  driverStart: [number, number];
  driverName: string;
  vehicleName: string;
  vehiclePlate: string;
  rtoCode: string;
  routePoints: [number, number][];
  otherDrivers: { pos: [number, number]; name: string; vehicle: string }[];
}

export const CITY_PRESETS: Record<CityKey, CityPreset> = {
  VIDISHA: {
    id: "VIDISHA",
    name: "Vidisha",
    state: "Madhya Pradesh (MP-40)",
    center: [23.5251, 77.8081],
    zoom: 14,
    pickup: [23.5262, 77.8211],
    pickupLabel: "Vidisha Railway Station, Station Rd",
    dropoff: [23.5350, 77.8115],
    dropoffLabel: "Collectorate Civil Lines / Durga Nagar, Vidisha",
    driverStart: [23.5285, 77.8180],
    driverName: "Rajesh Sharma",
    vehicleName: "Toyota Fortuner 4x4",
    vehiclePlate: "MP-40-CA-4921",
    rtoCode: "MP-40 (Vidisha)",
    routePoints: [
      [23.5262, 77.8211], // Vidisha Railway Station
      [23.5275, 77.8185], // Station Road Circle
      [23.5288, 77.8155], // Neem Tal Market
      [23.5302, 77.8135], // Tilak Chowk / Hospital Rd
      [23.5325, 77.8122], // Civil Lines Road
      [23.5350, 77.8115], // Collectorate & District Court Vidisha
    ],
    otherDrivers: [
      { pos: [23.5215, 77.8145], name: "Chauffeur Mukesh Patel", vehicle: "Creta (MP-40-AB-1290)" },
      { pos: [23.5380, 77.8050], name: "Chauffeur Dharmendra Lodhi", vehicle: "Scorpio-N (MP-40-MB-7788)" },
      { pos: [23.5290, 77.8010], name: "Chauffeur Sanjay Ahirwar", vehicle: "Innova Crysta (MP-40-TA-3321)" },
    ],
  },
  BHOPAL: {
    id: "BHOPAL",
    name: "Bhopal",
    state: "Madhya Pradesh (MP-04)",
    center: [23.2599, 77.4126],
    zoom: 13,
    pickup: [23.2332, 77.4334],
    pickupLabel: "DB City Mall, MP Nagar Zone-1, Bhopal",
    dropoff: [23.2875, 77.3378],
    dropoffLabel: "Raja Bhoj International Airport, VIP Rd, Bhopal",
    driverStart: [23.2365, 77.4310],
    driverName: "Mukesh Patel",
    vehicleName: "BMW 330Li M Sport",
    vehiclePlate: "MP-04-BK-8822",
    rtoCode: "MP-04 (Bhopal)",
    routePoints: [
      [23.2332, 77.4334], // DB City Mall, MP Nagar
      [23.2365, 77.4310], // Board Office Square
      [23.2420, 77.4080], // Link Road 1 / Roshanpura
      [23.2480, 77.3930], // Polytechnic Square / Kamla Park
      [23.2540, 77.3780], // VIP Road / Upper Lake (Bada Talab)
      [23.2720, 77.3620], // Lalghati Square
      [23.2810, 77.3480], // Gandhi Nagar Approach
      [23.2875, 77.3378], // Raja Bhoj Airport
    ],
    otherDrivers: [
      { pos: [23.2167, 77.4398], name: "Chauffeur Sunil Verma (Rani Kamlapati)", vehicle: "Fortuner (MP-04-CA-9921)" },
      { pos: [23.2684, 77.4107], name: "Chauffeur Imran Qureshi (Bhopal Jn)", vehicle: "City (MP-04-CC-1120)" },
      { pos: [23.2450, 77.4200], name: "Chauffeur Ramesh Yadav (Arera Colony)", vehicle: "XUV700 (MP-04-XY-4491)" },
    ],
  },
  BHOPAL_VIDISHA: {
    id: "BHOPAL_VIDISHA",
    name: "Bhopal ⇄ Vidisha",
    state: "Intercity Highway (SH-19 / NH-146)",
    center: [23.3850, 77.6200],
    zoom: 11,
    pickup: [23.2332, 77.4334],
    pickupLabel: "MP Nagar Zone-1, Bhopal (MP)",
    dropoff: [23.5262, 77.8211],
    dropoffLabel: "Vidisha Railway Station (via Sanchi Stupa Highway)",
    driverStart: [23.2450, 77.4420],
    driverName: "Dharmendra Lodhi",
    vehicleName: "Mercedes-Benz E-Class",
    vehiclePlate: "MP-40-EX-0001",
    rtoCode: "MP-40 / MP-04 Transit",
    routePoints: [
      [23.2332, 77.4334], // Bhopal MP Nagar
      [23.2800, 77.4650], // Anand Nagar / Raisen Rd T-Point
      [23.3420, 77.5140], // Sukhi Sewaniya Toll
      [23.4010, 77.6250], // Dewanganj Bypass (SH-19)
      [23.4450, 77.6890], // Salamatpur Crossroad
      [23.4793, 77.7397], // Sanchi Stupa Heritage Junction
      [23.5180, 77.8020], // Betwa River Bridge, Vidisha
      [23.5262, 77.8211], // Vidisha Railway Station
    ],
    otherDrivers: [
      { pos: [23.4793, 77.7397], name: "Chauffeur Vikas (Sanchi Stupa Gate)", vehicle: "Fortuner (MP-40-SN-1008)" },
      { pos: [23.3420, 77.5140], name: "Chauffeur Arvind (Sukhi Sewaniya)", vehicle: "Innova (MP-04-HW-8833)" },
    ],
  },
  BANGALORE: {
    id: "BANGALORE",
    name: "Bangalore",
    state: "Karnataka (KA-01)",
    center: [12.9716, 77.5946],
    zoom: 13,
    pickup: [12.9784, 77.6408],
    pickupLabel: "Indiranagar 100ft Rd, Bangalore",
    dropoff: [12.9352, 77.6245],
    dropoffLabel: "Koramangala 5th Block, Bangalore",
    driverStart: [12.9725, 77.6402],
    driverName: "Rajesh Kumar",
    vehicleName: "Toyota Fortuner 4x4",
    vehiclePlate: "KA-01-MJ-4921",
    rtoCode: "KA-01 (Koramangala)",
    routePoints: [
      [12.9784, 77.6408],
      [12.9745, 77.6402],
      [12.9685, 77.6395],
      [12.9612, 77.6382],
      [12.9568, 77.6372],
      [12.9515, 77.6352],
      [12.9462, 77.6335],
      [12.9405, 77.6292],
      [12.9352, 77.6245],
    ],
    otherDrivers: [
      { pos: [12.9755, 77.6082], name: "Chauffeur Sunil (MG Road)", vehicle: "Creta (KA-05-AB-1290)" },
      { pos: [12.9298, 77.6145], name: "Chauffeur Imran (BTM 1st Stage)", vehicle: "City (KA-01-MM-8822)" },
    ],
  },
};

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadFactor = 1.25; // Indian road curvature factor
  return Math.round(R * c * roadFactor * 10) / 10;
}

export function findNearbyLandmark(lat: number, lng: number): string {
  const landmarks = [
    { name: "Vidisha Railway Station Road, Vidisha (M.P.)", lat: 23.5262, lng: 77.8211 },
    { name: "Collectorate Civil Lines / Durga Nagar, Vidisha (M.P.)", lat: 23.5350, lng: 77.8115 },
    { name: "Neem Tal Market, Station Rd, Vidisha", lat: 23.5288, lng: 77.8155 },
    { name: "Tilak Chowk / Civil Hospital Rd, Vidisha", lat: 23.5302, lng: 77.8135 },
    { name: "Betwa River Ghat / Charans Tirth, Vidisha", lat: 23.5180, lng: 77.8020 },
    { name: "Sanchi Stupa Heritage Junction (SH-19 / NH-146)", lat: 23.4793, lng: 77.7397 },
    { name: "DB City Mall, MP Nagar Zone-1, Bhopal (M.P.)", lat: 23.2332, lng: 77.4334 },
    { name: "Raja Bhoj International Airport, VIP Road, Bhopal", lat: 23.2875, lng: 77.3378 },
    { name: "Rani Kamlapati World-Class Station, Bhopal", lat: 23.2167, lng: 77.4398 },
    { name: "Upper Lake / VIP Road, Bhopal", lat: 23.2540, lng: 77.3780 },
    { name: "Indiranagar 100ft Rd, Bangalore", lat: 12.9784, lng: 77.6408 },
    { name: "Koramangala 5th Block, Bangalore", lat: 12.9352, lng: 77.6245 },
  ];

  for (const lm of landmarks) {
    const d = calculateDistanceKm(lat, lng, lm.lat, lm.lng);
    if (d < 0.5) return lm.name;
    if (d < 1.8) return `Near ${lm.name}`;
  }
  return `Point (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
}

interface RealStreetMapProps {
  initialCity?: CityKey;
  center?: [number, number];
  zoom?: number;
  pickupCoords?: [number, number];
  dropoffCoords?: [number, number];
  pickupLabel?: string;
  dropoffLabel?: string;
  driverCoords?: [number, number];
  driverName?: string;
  vehicleName?: string;
  vehiclePlate?: string;
  isTripActive?: boolean;
  animateCar?: boolean;
  loopAnimation?: boolean;
  height?: string;
  className?: string;
  showOtherDrivers?: boolean;
  enableLocationPicker?: boolean;
  activePickerTarget?: "NONE" | "PICKUP" | "DROPOFF";
  onLocationSelect?: (
    type: "pickup" | "dropoff",
    coords: [number, number],
    label: string,
    distanceKm: number
  ) => void;
  onLocationSelected?: (
    type: "pickup" | "dropoff",
    coords: [number, number],
    label: string
  ) => void;
  polygon?: [number, number][];
  polygonLabel?: string;
  hideCitySelector?: boolean;
  customTitle?: string;
  onCityChanged?: (cityKey: CityKey) => void;
}

function calculateBearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

export default function RealStreetMap({
  initialCity = "VIDISHA",
  center,
  zoom,
  pickupCoords,
  dropoffCoords,
  pickupLabel,
  dropoffLabel,
  driverCoords,
  driverName,
  vehicleName,
  vehiclePlate,
  isTripActive = false,
  animateCar = true,
  loopAnimation = true,
  height = "420px",
  className = "",
  showOtherDrivers = true,
  polygon,
  polygonLabel,
  hideCitySelector = false,
  customTitle,
  enableLocationPicker = true,
  activePickerTarget = "NONE",
  onLocationSelect,
  onLocationSelected,
  onCityChanged,
}: RealStreetMapProps) {
  const [selectedCity, setSelectedCity] = useState<CityKey>(initialCity);
  const [mapLayer, setMapLayer] = useState<"streets" | "satellite" | "osm">("streets");
  const [currentSpeed, setCurrentSpeed] = useState<number>(42);
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [pickerMode, setPickerMode] = useState<"NONE" | "PICKUP" | "DROPOFF">(activePickerTarget);
  const [pickerFeedback, setPickerFeedback] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pickerModeRef = useRef<"NONE" | "PICKUP" | "DROPOFF">(pickerMode);

  useEffect(() => {
    pickerModeRef.current = pickerMode;
  }, [pickerMode]);

  useEffect(() => {
    if (activePickerTarget) {
      setPickerMode(activePickerTarget);
      pickerModeRef.current = activePickerTarget;
    }
  }, [activePickerTarget]);

  const activePreset = CITY_PRESETS[selectedCity];

  // Effective coordinates, honoring overrides if provided
  const effCenter = center || activePreset.center;
  const effZoom = zoom || activePreset.zoom;
  const effPickup = pickupCoords || activePreset.pickup;
  const effPickupLabel = pickupLabel || activePreset.pickupLabel;
  const effDropoff = dropoffCoords || activePreset.dropoff;
  const effDropoffLabel = dropoffLabel || activePreset.dropoffLabel;
  const effDriverName = driverName || activePreset.driverName;
  const effVehicleName = vehicleName || activePreset.vehicleName;
  const effVehiclePlate = vehiclePlate || activePreset.vehiclePlate;
  const effRoutePoints = activePreset.routePoints;

  const handleCitySwitch = (cityKey: CityKey) => {
    setSelectedCity(cityKey);
    if (onCityChanged) onCityChanged(cityKey);
  };

  // Google Maps Direct Navigation Link
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${effPickup[0]},${effPickup[1]}&destination=${effDropoff[0]},${effDropoff[1]}&travelmode=driving`;

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: effCenter,
        zoom: effZoom,
        zoomControl: false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      // Top-right Zoom Control
      L.control.zoom({ position: "topright" }).addTo(map);

      // Layer Tiles
      let tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      let tileSubdomains = "abcd";

      if (mapLayer === "satellite") {
        // High-resolution Esri Satellite imagery with clear roads and physical terrain
        tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        tileSubdomains = "";
      } else if (mapLayer === "osm") {
        // OpenStreetMap standard
        tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        tileSubdomains = "abc";
      }

      tileLayerRef.current = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: tileSubdomains || "abc",
      }).addTo(map);

      // Add Satellite Labels layer if in satellite mode
      if (mapLayer === "satellite") {
        L.tileLayer(
          "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 19 }
        ).addTo(map);
      }

      // Pickup Marker (Green Pin)
      const pickupIcon = L.divIcon({
        className: "custom-pickup-pin",
        html: `
          <div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;background:#0f172a;border:2.5px solid #ffffff;border-radius:9999px;box-shadow:0 6px 16px rgba(0,0,0,0.35);">
            <div style="width:10px;height:10px;background:#22c55e;border-radius:9999px;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker(effPickup, { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;font-size:12px;line-height:1.4;color:#0f172a;">
            <b style="font-size:13px;color:#16a34a;">● Pickup Location</b><br/>
            <span>${effPickupLabel}</span><br/>
            <span style="font-size:10px;color:#64748b;font-family:monospace;">${effPickup[0].toFixed(4)}°N, ${effPickup[1].toFixed(4)}°E</span>
          </div>
        `);

      // Destination Marker (Red Pin)
      const dropoffIcon = L.divIcon({
        className: "custom-dropoff-pin",
        html: `
          <div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;background:#0f172a;border:2.5px solid #ffffff;border-radius:9999px;box-shadow:0 6px 16px rgba(0,0,0,0.35);">
            <div style="width:10px;height:10px;background:#ef4444;border-radius:9999px;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker(effDropoff, { icon: dropoffIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;font-size:12px;line-height:1.4;color:#0f172a;">
            <b style="font-size:13px;color:#dc2626;">■ Destination</b><br/>
            <span>${effDropoffLabel}</span><br/>
            <span style="font-size:10px;color:#64748b;font-family:monospace;">${effDropoff[0].toFixed(4)}°N, ${effDropoff[1].toFixed(4)}°E</span>
          </div>
        `);

      // Draw Route Polyline
      routeLineRef.current = L.polyline(effRoutePoints, {
        color: mapLayer === "satellite" ? "#38bdf8" : "#0f172a",
        weight: 5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Render Official Vidisha KML Boundary Geofence or custom polygon
      const targetPolygon = polygon || (selectedCity === "VIDISHA" ? VIDISHA_KML_POLYGON_LEAFLET : null);
      if (targetPolygon && targetPolygon.length > 0) {
        L.polygon(targetPolygon, {
          color: mapLayer === "satellite" ? "#38bdf8" : "#0284c7",
          weight: 2.5,
          opacity: 0.9,
          fillColor: "#38bdf8",
          fillOpacity: 0.14,
          dashArray: "4, 6",
        })
          .addTo(map)
          .bindPopup(`<div style='font-family:sans-serif;font-size:11px;'><b style='color:#0284c7;'>${polygonLabel || "Municipal Service Geofence"}</b><br/>Verified KML Boundary Perimeter</div>`);
      }

      // Fit map bounds only if no explicit center is provided
      if (!center) {
        const bounds = L.latLngBounds(effRoutePoints);
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      // Chauffeur Car Marker
      const initialDriverPos = driverCoords || effRoutePoints[0];
      const initialBearing =
        effRoutePoints.length > 1
          ? calculateBearing(
              effRoutePoints[0][0],
              effRoutePoints[0][1],
              effRoutePoints[1][0],
              effRoutePoints[1][1]
            )
          : 45;

      const createCarIcon = (bearing: number) =>
        L.divIcon({
          className: "custom-car-pin",
          html: `
            <div id="driver-car-marker" style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:#0f172a;border:2.5px solid ${
              mapLayer === "satellite" ? "#38bdf8" : "#ffffff"
            };border-radius:14px;box-shadow:0 8px 20px rgba(0,0,0,0.45);transform:rotate(${bearing}deg);transition:transform 0.4s ease, top 0.4s ease, left 0.4s ease;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

      const carMarker = L.marker(initialDriverPos, {
        icon: createCarIcon(initialBearing),
      }).addTo(map);
      driverMarkerRef.current = carMarker;

      carMarker.bindPopup(`
        <div style="font-family:sans-serif;font-size:12px;line-height:1.4;color:#0f172a;min-width:200px;">
          <b style="font-size:13px;display:block;margin-bottom:2px;">Chauffeur: ${effDriverName}</b>
          <div style="font-size:11px;color:#475569;margin-bottom:4px;">
            Car: <b>${effVehicleName}</b> (${effVehiclePlate})
          </div>
          <div style="display:inline-block;padding:2px 6px;background:#ecfdf5;color:#065f46;border-radius:4px;font-size:10px;font-weight:bold;">
            ★ 4.96 • MoRTH ${activePreset.rtoCode} Verified
          </div>
        </div>
      `);

      // Map Click Event for Interactive Location Selection
      map.on("click", (e: any) => {
        const lat = Number(e.latlng.lat.toFixed(5));
        const lng = Number(e.latlng.lng.toFixed(5));
        const label = findNearbyLandmark(lat, lng);
        const currentMode = pickerModeRef.current;

        if (currentMode === "PICKUP") {
          const dist = calculateDistanceKm(lat, lng, effDropoff[0], effDropoff[1]);
          if (onLocationSelect) {
            onLocationSelect("pickup", [lat, lng], label, dist);
          }
          if (onLocationSelected) {
            onLocationSelected("pickup", [lat, lng], label);
          }
          setPickerFeedback(`📍 Pickup set: ${label}`);
          setTimeout(() => setPickerFeedback(null), 3500);
        } else if (currentMode === "DROPOFF") {
          const dist = calculateDistanceKm(effPickup[0], effPickup[1], lat, lng);
          if (onLocationSelect) {
            onLocationSelect("dropoff", [lat, lng], label, dist);
          }
          if (onLocationSelected) {
            onLocationSelected("dropoff", [lat, lng], label);
          }
          setPickerFeedback(`🎯 Dropoff set: ${label}`);
          setTimeout(() => setPickerFeedback(null), 3500);
        } else {
          // Interactive pin prompt popup
          const distToDropoff = calculateDistanceKm(lat, lng, effDropoff[0], effDropoff[1]);
          const distToPickup = calculateDistanceKm(effPickup[0], effPickup[1], lat, lng);

          const popupContainer = document.createElement("div");
          popupContainer.style.fontFamily = "system-ui, -apple-system, sans-serif";
          popupContainer.style.fontSize = "12px";
          popupContainer.style.color = "#0f172a";
          popupContainer.style.padding = "4px";

          popupContainer.innerHTML = `
            <div style="font-weight:800;font-size:12px;margin-bottom:2px;color:#0f172a;">
              📍 Selected Map Coordinate
            </div>
            <div style="font-size:11px;color:#475569;margin-bottom:8px;font-weight:600;">
              ${label}
            </div>
            <div style="display:flex;gap:6px;">
              <button id="btn-map-set-pickup" style="background:#16a34a;color:#ffffff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;">
                Set as Pickup
              </button>
              <button id="btn-map-set-dropoff" style="background:#dc2626;color:#ffffff;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:bold;cursor:pointer;">
                Set Destination
              </button>
            </div>
          `;

          L.popup({ minWidth: 180 })
            .setLatLng(e.latlng)
            .setContent(popupContainer)
            .openOn(map);

          setTimeout(() => {
            const btnPickup = document.getElementById("btn-map-set-pickup");
            const btnDropoff = document.getElementById("btn-map-set-dropoff");
            if (btnPickup) {
              btnPickup.onclick = () => {
                if (onLocationSelect) onLocationSelect("pickup", [lat, lng], label, distToDropoff);
                if (onLocationSelected) onLocationSelected("pickup", [lat, lng], label);
                setPickerFeedback(`📍 Pickup set: ${label}`);
                setTimeout(() => setPickerFeedback(null), 3500);
                map.closePopup();
              };
            }
            if (btnDropoff) {
              btnDropoff.onclick = () => {
                if (onLocationSelect) onLocationSelect("dropoff", [lat, lng], label, distToPickup);
                if (onLocationSelected) onLocationSelected("dropoff", [lat, lng], label);
                setPickerFeedback(`🎯 Dropoff set: ${label}`);
                setTimeout(() => setPickerFeedback(null), 3500);
                map.closePopup();
              };
            }
          }, 30);
        }
      });

      // Nearby Chauffeurs in this City
      if (showOtherDrivers && activePreset.otherDrivers) {
        const neighborIcon = L.divIcon({
          className: "neighbor-driver-pin",
          html: `
            <div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:#ffffff;border:2px solid #0f172a;border-radius:10px;box-shadow:0 3px 8px rgba(0,0,0,0.25);">
              <div style="width:7px;height:7px;background:#0f172a;border-radius:9999px;"></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        activePreset.otherDrivers.forEach((od) => {
          L.marker(od.pos, { icon: neighborIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif;font-size:11px;color:#0f172a;">
                <b>${od.name}</b><br/>
                <span style="color:#64748b;">${od.vehicle}</span><br/>
                <span style="color:#16a34a;font-weight:bold;">● Online Available Chauffeur</span>
              </div>
            `);
        });
      }

      // Smooth Car Animation Loop along the real city route
      if (animateCar || isTripActive) {
        let stepIdx = 0;
        const totalSteps = effRoutePoints.length;

        animIntervalRef.current = setInterval(() => {
          if (!isMounted || !driverMarkerRef.current) return;

          stepIdx = (stepIdx + 1) % totalSteps;
          const currentPoint = effRoutePoints[stepIdx];
          const nextPoint = effRoutePoints[(stepIdx + 1) % totalSteps];

          const bearing = calculateBearing(
            currentPoint[0],
            currentPoint[1],
            nextPoint[0],
            nextPoint[1]
          );

          driverMarkerRef.current.setLatLng(currentPoint);
          driverMarkerRef.current.setIcon(createCarIcon(bearing));
          setCurrentSpeed(Math.floor(36 + Math.random() * 16));
        }, 1800);
      }
    });

    return () => {
      isMounted = false;
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    selectedCity,
    mapLayer,
    effCenter,
    effZoom,
    effPickup,
    effDropoff,
    effPickupLabel,
    effDropoffLabel,
    effDriverName,
    effVehicleName,
    effVehiclePlate,
    animateCar,
    isTripActive,
    showOtherDrivers,
    polygon,
  ]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md ${className}`}>
      {/* Sleek, Minimal Map Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-white text-xs tracking-tight">
            {customTitle || polygonLabel || `Live Fleet Radar • ${activePreset.name}`}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
            GPS ACTIVE
          </span>
        </div>

        {!hideCitySelector && (
          <div className="flex items-center gap-1 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800">
            {(["VIDISHA", "BHOPAL", "BHOPAL_VIDISHA"] as CityKey[]).map((cityKey) => {
              const preset = CITY_PRESETS[cityKey];
              const isSelected = selectedCity === cityKey;
              return (
                <button
                  key={cityKey}
                  type="button"
                  onClick={() => handleCitySwitch(cityKey)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500 text-slate-950 shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Feedback Notification Toast */}
        {pickerFeedback && (
          <div className="absolute bottom-12 left-3 z-[1000] bg-slate-900/95 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xl border border-emerald-500/50 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{pickerFeedback}</span>
          </div>
        )}

        {/* Floating Speed & Driver HUD */}
        {(animateCar || isTripActive) && (
          <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-mono shadow-xl flex items-center gap-3 border border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-emerald-400">{currentSpeed} km/h</span>
            </div>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 text-[11px]">Chauffeur: {effDriverName}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-300 font-bold text-[11px]">{effVehiclePlate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
