/**
 * Official Vidisha Municipal Service Geofence
 * Ground-truth polygon extracted directly from Google Earth KML (Placemark: VIDISHA)
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// 1. Google Maps Platform format: { lat, lng }
export const VIDISHA_KML_POLYGON_GOOGLE: LatLng[] = [
  { lat: 23.49965352804375, lng: 77.78823352878834 },
  { lat: 23.49820481554576, lng: 77.80125419295862 },
  { lat: 23.49745689178146, lng: 77.81590754143197 },
  { lat: 23.50110930016881, lng: 77.82448503970627 },
  { lat: 23.5137027521558,  lng: 77.8418974639514  },
  { lat: 23.52259802023461, lng: 77.84644377889344 },
  { lat: 23.52718764097606, lng: 77.84000991232304 },
  { lat: 23.53341551570499, lng: 77.83296342239504 },
  { lat: 23.53383759443507, lng: 77.81478378700766 },
  { lat: 23.53997039246435, lng: 77.8040080297754  },
  { lat: 23.5383300067628,  lng: 77.78929949429654 },
  { lat: 23.52254797090081, lng: 77.77617706065   },
  { lat: 23.49965352804375, lng: 77.78823352878834 }, // Closed ring
];

// 2. Leaflet / PostGIS format: [lat, lng]
export const VIDISHA_KML_POLYGON_LEAFLET: [number, number][] = VIDISHA_KML_POLYGON_GOOGLE.map(
  (pt) => [pt.lat, pt.lng]
);

// 3. LookAt Centroid from KML
export const VIDISHA_KML_LOOKAT = {
  center: { lat: 23.53128600897603, lng: 77.81749027618446 },
  centerLeaflet: [23.53128600897603, 77.81749027618446] as [number, number],
  range: 13646.56671653383,
  recommendedZoom: 13,
  name: "Vidisha Municipal Service Geofence (MP-40)",
  areaKm2: 28.45,
  rtoCode: "MP-40",
};

/**
 * Standard Ray-Casting algorithm to test if a coordinate is inside the Vidisha KML polygon
 */
export function isInsideVidishaKMLGeofence(lat: number, lng: number): boolean {
  const polygon = VIDISHA_KML_POLYGON_LEAFLET;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];

    const intersect =
      ((yi > lat) !== (yj > lat)) &&
      (lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}
