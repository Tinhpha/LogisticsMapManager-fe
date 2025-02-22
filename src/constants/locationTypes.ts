export const LOCATION_TYPES = [
  { id: 'Company', icon: 'company-icon' },
  { id: 'Factory', icon: 'factory-icon' },
  { id: 'MHE Provider', icon: 'mhe-icon' },
  { id: 'Port', icon: 'port-icon' },
  { id: 'Supermarket', icon: 'supermarket-icon' },
  { id: 'Transporter', icon: 'transporter-icon' },
  { id: 'Warehouse', icon: 'warehouse-icon' },
] as const;

export type LocationType = typeof LOCATION_TYPES[number]['id'];

export const getLocationIcon = (type: string): string => {
  const locationType = LOCATION_TYPES.find(t => t.id === type);
  return locationType?.icon || 'default-icon';
};
