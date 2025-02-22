import L from 'leaflet';
import { Location } from '../../types/location';

class RoutingService {
  private map: L.Map | null = null;
  private routeLayer: L.Polyline | null = null;

  setMap(map: L.Map) {
    this.map = map;
  }

  async findRoute(start: Location, end: Location) {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes.length) {
        throw new Error('No route found');
      }

      const route = data.routes[0];
      const coordinates = route.geometry.coordinates;
      
      // Clear existing route
      this.clearRoute();

      // Create and add route layer
      this.routeLayer = L.polyline(coordinates.map(coord => [coord[1], coord[0]]), {
        color: '#2962FF',
        weight: 5,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'route-path'
      }).addTo(this.map);

      // Fit map to show the entire route
      if (coordinates.length > 0) {
        this.map.fitBounds(this.routeLayer.getBounds(), {
          padding: [50, 50]
        });
      }

      return {
        distance: route.distance, // Khoảng cách theo mét
        duration: route.duration, // Thời gian theo giây
        coordinates: coordinates
      };
    } catch (error) {
      console.error('Error finding route:', error);
      throw error;
    }
  }

  clearRoute() {
    if (this.routeLayer) {
      this.routeLayer.remove();
      this.routeLayer = null;
    }
  }
}

export const routingService = new RoutingService();
