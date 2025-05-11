import { GeoJsonFeatureCollection } from "../types/api/trips";

export class RouteFormatConverter {
    public static geoJsonToGpx(geoJson: GeoJsonFeatureCollection): string {
        if (!geoJson || !geoJson.features) {
            throw new Error("Invalid GeoJSON object");
        }

        const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RouteFormatConverter" xmlns="http://www.topografix.com/GPX/1/1">
`;
        const gpxFooter = `</gpx>`;

        let waypoints = "";
        let trackPoints = "";

        geoJson.features.forEach((feature: any) => {
            if (feature.geometry.type === "Point") {
                const [lon, lat] = feature.geometry.coordinates;
                waypoints += `<wpt lon="${lon}" lat="${lat}"><name>${feature.properties?.name || ""}</name></wpt>\n`;
            } else if (feature.geometry.type === "LineString") {
                trackPoints += `<trk><trkseg>\n`;
                feature.geometry.coordinates.forEach(([lon, lat]: [number, number]) => {
                    trackPoints += `<trkpt lon="${lon}" lat="${lat}"></trkpt>\n`;
                });
                trackPoints += `</trkseg></trk>\n`;
            }
        });

        return gpxHeader + waypoints + trackPoints + gpxFooter;
    }


    public static gpxToGeoJson(gpx: string): GeoJsonFeatureCollection {
        if (!gpx) {
            throw new Error("Invalid GPX data");
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpx, "application/xml");

        const geoJson: GeoJsonFeatureCollection = {
            type: "FeatureCollection",
            features: []
        };

        const waypoints = xmlDoc.getElementsByTagName("wpt");
        for (let i = 0; i < waypoints.length; i++) {
            const wpt = waypoints[i];
            const lon = parseFloat(wpt.getAttribute("lon") || "0");
            const lat = parseFloat(wpt.getAttribute("lat") || "0");
            const name = wpt.getElementsByTagName("name")[0]?.textContent || "";

            geoJson.features.push({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [lon, lat]
                },
                properties: {
                    name
                }
            });
        }

        const tracks = xmlDoc.getElementsByTagName("trk");
        for (let i = 0; i < tracks.length; i++) {
            const trk = tracks[i];
            const trackSegments = trk.getElementsByTagName("trkseg");

            for (let j = 0; j < trackSegments.length; j++) {
                const trkseg = trackSegments[j];
                const trackPoints = trkseg.getElementsByTagName("trkpt");

                const coordinates: [number, number, number?][] = [];
                for (let k = 0; k < trackPoints.length; k++) {
                    const trkpt = trackPoints[k];
                    const lon = parseFloat(trkpt.getAttribute("lon") || "0");
                    const lat = parseFloat(trkpt.getAttribute("lat") || "0");
                    const ele = parseFloat(trkpt.getElementsByTagName("ele")[0]?.textContent || "0");
                    coordinates.push([lon, lat, ele]);
                }

                geoJson.features.push({
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates
                    },
                    properties: {}
                });
            }
        }

        return geoJson;
    }
}