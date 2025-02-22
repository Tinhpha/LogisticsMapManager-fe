import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../../types/location';
import { getMarkerIcon, getIconFileName } from '../../utils/mapUtils';
import './Map.css';
import { routingService } from '../../services/routingService/routingService';

interface MapProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
}

const Map: React.FC<MapProps> = ({
  locations,
  onLocationSelect,
  selectedLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const mountedRef = useRef(false);

  const createPopupContent = (location: Location) => {
    return `
      <div class="marker-popup">
        <div class="popup-header">
          <h3>${location.name}</h3>
        </div>
        <div class="popup-content">
          <p><strong>Type:</strong> ${location.business_type}</p>
          <p><strong>Phone:</strong> ${location.phone_number || 'N/A'}</p>
          <p><strong>Address:</strong> ${location.address || 'N/A'}</p>
        </div>
      </div>
    `;
  };

  // Create map only once on mount
  useEffect(() => {
    const containerElement = mapContainerRef.current;
    
    // Strict mount checking
    if (!containerElement || mapRef.current || mountedRef.current) {
      console.log('⏭️ Skipping map creation:', {
        hasContainer: !!containerElement,
        hasMap: !!mapRef.current,
        isMounted: mountedRef.current
      });
      return;
    }

    console.log('🗺️ Creating new map instance');
    
    const map = L.map(containerElement).setView([16.047079, 108.206230], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    mapRef.current = map;
    mountedRef.current = true;
    
    console.log('✨ Map created successfully');

    return () => {
      console.log('🧹 Cleaning up map');
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      mountedRef.current = false;
    };
  }, []); // Empty deps - only run on mount/unmount

  // Create markers only when locations change
  useEffect(() => {
    if (!mapRef.current || !locations?.length) return;

    console.log('📍 Creating markers for locations:', locations.length);

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Create new markers
    locations.forEach(location => {
      if (!location?.latitude || !location?.longitude || !location.id) {
        console.log('⚠️ Invalid location:', location);
        return;
      }

      const marker = L.marker([location.latitude, location.longitude], {
        icon: getMarkerIcon(location.business_type, false),
        title: location.name
      });

      marker.addTo(mapRef.current!);
      
      const popupContent = createPopupContent(location);
      marker.bindPopup(popupContent);

      marker.on('click', () => onLocationSelect(location));

      markersRef.current[location.id] = marker;
    });

    console.log(`✨ Created ${Object.keys(markersRef.current).length} markers`);
  }, [locations]); // Only recreate markers when locations change

  // Handle selection changes
  useEffect(() => {
    if (!mapRef.current || !selectedLocation?.id) return;

    console.log('🎯 Handling selection:', selectedLocation.id);

    // Update markers
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = Number(id) === selectedLocation.id;
      const location = locations.find(l => l.id === Number(id));
      if (location) {
        marker.setIcon(getMarkerIcon(location.business_type, isSelected));
      }
    });

    // Pan to selected marker
    const marker = markersRef.current[selectedLocation.id];
    if (marker) {
      marker.openPopup();
      mapRef.current.flyTo(marker.getLatLng(), 15, {
        duration: 1
      });
    }
  }, [selectedLocation?.id]); // Only handle selection changes

  return (
    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
  );
};

export default Map;
