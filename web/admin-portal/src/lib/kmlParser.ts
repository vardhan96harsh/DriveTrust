export interface ParsedKMLRegion {
  id: string;
  name: string;
  description?: string;
  center: [number, number];
  zoom: number;
  areaKm2: number;
  polygonCoords: [number, number][]; // [lat, lng]
  googlePolygonCoords: { lat: number; lng: number }[]; // { lat, lng }
  placemarks: {
    name: string;
    point?: [number, number];
    coords?: [number, number][];
    type: "polygon" | "linestring" | "point";
  }[];
}

/**
 * Parses a KML coordinate string: "lng,lat,alt lng,lat,alt" or "lng,lat"
 * Returns array of [lat, lng]
 */
export function parseKMLCoordinates(coordStr: string): [number, number][] {
  if (!coordStr) return [];
  const points: [number, number][] = [];
  const rawPairs = coordStr.trim().split(/\s+/);

  for (const pair of rawPairs) {
    const parts = pair.split(",").map((s) => parseFloat(s.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      // In KML coordinates are order: [longitude, latitude, altitude]
      const lng = parts[0];
      const lat = parts[1];
      points.push([lat, lng]);
    }
  }

  return points;
}

/**
 * Computes bounding box and centroid center of a list of coordinates [lat, lng]
 */
export function calculateRegionCenterAndZoom(
  points: [number, number][]
): { center: [number, number]; zoom: number } {
  if (points.length === 0) {
    return { center: [23.5251, 77.8081], zoom: 13 }; // Default Vidisha
  }

  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;

  for (const [lat, lng] of points) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Approximate zoom level based on bounding box span
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  let zoom = 14;
  if (maxDiff > 3.0) zoom = 7;
  else if (maxDiff > 1.5) zoom = 8;
  else if (maxDiff > 0.8) zoom = 9;
  else if (maxDiff > 0.4) zoom = 10;
  else if (maxDiff > 0.2) zoom = 11;
  else if (maxDiff > 0.1) zoom = 12;
  else if (maxDiff > 0.05) zoom = 13;
  else zoom = 14;

  return { center: [centerLat, centerLng], zoom };
}

/**
 * Calculates approximate area of polygon coordinates in square kilometers (km²)
 */
export function calculatePolygonAreaKm2(points: [number, number][]): number {
  if (!points || points.length < 3) return 0;
  // Center latitude for planar projection scaling
  const centerLat = points.reduce((acc, p) => acc + p[0], 0) / points.length;
  const latFactor = 111.32; // km per degree latitude
  const lngFactor = 111.32 * Math.cos((centerLat * Math.PI) / 180); // km per degree longitude

  // Convert to kilometers
  const projected = points.map(([lat, lng]) => ({
    x: lng * lngFactor,
    y: lat * latFactor,
  }));

  // Shoelace formula
  let area = 0;
  for (let i = 0; i < projected.length; i++) {
    const j = (i + 1) % projected.length;
    area += projected[i].x * projected[j].y;
    area -= projected[j].x * projected[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Client-safe KML Parser using DOMParser
 */
export function parseKMLString(kmlText: string, defaultName: string = "Custom KML Region"): ParsedKMLRegion {
  if (typeof window === "undefined") {
    return {
      id: "custom-kml",
      name: defaultName,
      center: [23.5251, 77.8081],
      zoom: 13,
      areaKm2: 25.5,
      polygonCoords: [],
      googlePolygonCoords: [],
      placemarks: [],
    };
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlText, "text/xml");

  const docName =
    xmlDoc.querySelector("Document > name")?.textContent ||
    xmlDoc.querySelector("Folder > name")?.textContent ||
    defaultName;

  const placemarksEls = xmlDoc.querySelectorAll("Placemark");
  const placemarks: ParsedKMLRegion["placemarks"] = [];
  const allPolygonCoords: [number, number][] = [];

  placemarksEls.forEach((pm, idx) => {
    const name = pm.querySelector("name")?.textContent || `Feature ${idx + 1}`;

    // 1. Check for Polygon
    const polyCoordsEl =
      pm.querySelector("Polygon outerBoundaryIs LinearRing coordinates") ||
      pm.querySelector("Polygon coordinates");

    if (polyCoordsEl && polyCoordsEl.textContent) {
      const coords = parseKMLCoordinates(polyCoordsEl.textContent);
      if (coords.length > 0) {
        placemarks.push({
          name,
          coords,
          type: "polygon",
        });
        allPolygonCoords.push(...coords);
        return;
      }
    }

    // 2. Check for LineString
    const lineCoordsEl = pm.querySelector("LineString coordinates");
    if (lineCoordsEl && lineCoordsEl.textContent) {
      const coords = parseKMLCoordinates(lineCoordsEl.textContent);
      if (coords.length > 0) {
        placemarks.push({
          name,
          coords,
          type: "linestring",
        });
        allPolygonCoords.push(...coords);
        return;
      }
    }

    // 3. Check for Point
    const ptCoordsEl = pm.querySelector("Point coordinates");
    if (ptCoordsEl && ptCoordsEl.textContent) {
      const coords = parseKMLCoordinates(ptCoordsEl.textContent);
      if (coords.length > 0) {
        placemarks.push({
          name,
          point: coords[0],
          type: "point",
        });
        allPolygonCoords.push(coords[0]);
      }
    }
  });

  const { center, zoom } = calculateRegionCenterAndZoom(allPolygonCoords);
  const rawArea = calculatePolygonAreaKm2(allPolygonCoords);
  const areaKm2 = rawArea > 0 ? parseFloat(rawArea.toFixed(2)) : 25.5;

  return {
    id: `kml-region-${Date.now()}`,
    name: docName.trim(),
    center,
    zoom,
    areaKm2,
    polygonCoords: allPolygonCoords,
    googlePolygonCoords: allPolygonCoords.map(([lat, lng]) => ({ lat, lng })),
    placemarks,
  };
}
