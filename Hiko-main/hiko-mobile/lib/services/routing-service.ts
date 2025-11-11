export interface DrivingRoute {
  distanceKm: number;
  durationMinutes: number;
  polyline?: string;
}

export class RoutingService {
  async getDrivingTime(
    originLatLng: { lat: number; lng: number },
    destLatLng: { lat: number; lng: number }
  ): Promise<DrivingRoute> {
    const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (googleApiKey) {
      return this.getGoogleDirections(originLatLng, destLatLng, googleApiKey);
    }

    // Fallback to Mapbox Directions if Google is not configured
    const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
    if (mapboxToken) {
      return this.getMapboxDirections(originLatLng, destLatLng, mapboxToken);
    }

    // Fallback: calculate straight-line distance
    const distance = this.calculateDistance(originLatLng, destLatLng);
    return {
      distanceKm: distance,
      durationMinutes: Math.round(distance * 1.5),
    };
  }

  private async getGoogleDirections(
    origin: { lat: number; lng: number },
    dest: { lat: number; lng: number },
    apiKey: string
  ): Promise<DrivingRoute> {
    const originStr = `${origin.lat},${origin.lng}`;
    const destStr = `${dest.lat},${dest.lng}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.routes.length > 0) {
        const route = data.routes[0].legs[0];
        return {
          distanceKm: route.distance.value / 1000,
          durationMinutes: Math.round(route.duration.value / 60),
          polyline: data.routes[0].overview_polyline.points,
        };
      }
    } catch (error) {
      console.error("Error fetching Google Directions:", error);
    }

    const distance = this.calculateDistance(origin, dest);
    return {
      distanceKm: distance,
      durationMinutes: Math.round(distance * 1.5),
    };
  }

  private async getMapboxDirections(
    origin: { lat: number; lng: number },
    dest: { lat: number; lng: number },
    token: string
  ): Promise<DrivingRoute> {
    const originStr = `${origin.lng},${origin.lat}`;
    const destStr = `${dest.lng},${dest.lat}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originStr};${destStr}?access_token=${token}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          distanceKm: route.distance / 1000,
          durationMinutes: Math.round(route.duration / 60),
          polyline: route.geometry,
        };
      }
    } catch (error) {
      console.error("Error fetching Mapbox Directions:", error);
    }

    const distance = this.calculateDistance(origin, dest);
    return {
      distanceKm: distance,
      durationMinutes: Math.round(distance * 1.5),
    };
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371;
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(point1.lat)) *
        Math.cos(this.toRad(point2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const routingService = new RoutingService();
