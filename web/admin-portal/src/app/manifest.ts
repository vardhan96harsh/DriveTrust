import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sathi - Chauffeur & Driver Partner",
    short_name: "Sathi",
    description: "Aapki Gaadi, Aapka Sathi • Verified on-demand chauffeur dispatch and vehicle management platform.",
    start_url: "/install",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#10B981",
    shortcuts: [
      {
        name: "Customer: Book Chauffeur",
        short_name: "Book Chauffeur",
        description: "Book verified chauffeur for your personal vehicle",
        url: "/book",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Driver: Partner Cockpit",
        short_name: "Driver Duty",
        description: "Chauffeur duty toggle, incoming ride alerts and payouts",
        url: "/driver",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Live Tracking Radar",
        short_name: "Track Ride",
        description: "Track live vehicle location and telematics",
        url: "/track",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
    ],
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
