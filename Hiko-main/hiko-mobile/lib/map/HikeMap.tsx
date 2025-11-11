import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import MapLibreGL from "react-native-maplibre-gl";

MapLibreGL.setAccessToken(process.env.EXPO_PUBLIC_MAP_TOKEN ?? "");

interface HikeMapProps {
  coordinates: { lat: number; lng: number };
  geojson?: string | null;
  zoomLevel?: number;
}

function parseGeoJson(source?: string | null) {
  if (!source) return undefined;
  try {
    return JSON.parse(source);
  } catch (error) {
    console.warn("Failed to parse GeoJSON", error);
    return undefined;
  }
}

function HikeMapComponent({ coordinates, geojson, zoomLevel = 11 }: HikeMapProps) {
  const route = useMemo(() => parseGeoJson(geojson), [geojson]);

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView style={styles.map} styleURL="https://demotiles.maplibre.org/style.json">
        <MapLibreGL.Camera
          zoomLevel={zoomLevel}
          centerCoordinate={[coordinates.lng, coordinates.lat]}
        />
        {route && (
          <MapLibreGL.ShapeSource id="route" shape={route}>
            <MapLibreGL.LineLayer
              id="route-line"
              style={{ lineWidth: 4, lineColor: "#02685A" }}
            />
          </MapLibreGL.ShapeSource>
        )}
        <MapLibreGL.PointAnnotation
          id="start"
          coordinate={[coordinates.lng, coordinates.lat]}
        />
      </MapLibreGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
});

export const HikeMap = memo(HikeMapComponent);
