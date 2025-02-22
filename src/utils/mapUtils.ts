import L from 'leaflet';

export const getIconFileName = (type: string): string => {
  if (!type) return 'default';  // Fallback for undefined/null
  
  const typeMap: { [key: string]: string } = {
    'MHE': 'MHE Provider',
    'MHE Provider': 'MHE Provider',
    'mhe': 'MHE Provider',
    'mhe provider': 'MHE Provider',
    'MHE PROVIDER': 'MHE Provider',
    'Mhe Provider': 'MHE Provider',
    'Mhe': 'MHE Provider'
  };
  
  const normalizedType = type.trim();  // Remove whitespace
  return typeMap[normalizedType] || typeMap[normalizedType.toLowerCase()] || normalizedType.toLowerCase();
};

// Create custom marker icon
export const getMarkerIcon = (type: string, isSelected: boolean = false) => {
  const size = isSelected ? 36 : 30;
  const className = `custom-marker ${isSelected ? 'selected' : ''}`;
  
  return L.divIcon({
    className,
    html: `
      <div class="marker-container">
        <img src="/markers/pin.svg" alt="Location marker" width="${size}" height="${size * 1.5}" />
      </div>
    `,
    iconSize: [size, size * 1.5],
    iconAnchor: [size/2, size * 1.5],
    popupAnchor: [0, -size * 1.5]
  });
};
