# Logistics Manager Project Documentation

## Project Overview

Logistics Manager is a web-based application built with React and TypeScript that helps manage and visualize logistics locations across different types of facilities. The application provides an interactive map interface with a filterable sidebar for easy navigation and management of logistics points.

## Tech Stack

- **Frontend Framework**: React.js with TypeScript
- **Map Integration**: Leaflet
- **State Management**: React Hooks
- **Styling**: CSS Modules
- **Icons**: React Icons (FontAwesome)
- **API Integration**: Axios

## Project Structure

```
Logistics_Manager/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── Map.tsx
│   │   │   └── Map.css
│   │   └── Sidebar/
│   │       ├── Sidebar.tsx
│   │       └── Sidebar.css
│   ├── services/
│   │   ├── apiConfig.ts
│   │   └── mockData.ts
│   ├── types/
│   │   └── location.ts
│   └── App.tsx
```

## Core Components

### 1. Sidebar Component (`Sidebar.tsx`)

The sidebar is a crucial navigation component that displays all logistics locations grouped by their types.

#### Features:
- Dynamic grouping of locations by type (Warehouse, Seaport, Depot, Company, Airport)
- Count-based sorting of location types
- Search functionality
- Expandable/collapsible sections
- Custom icons for each location type
- Empty state handling

#### Key Implementation Details:
```typescript
interface Location {
  id: number;
  ten_diem: string;
  thuoc_cong_ty: string;
  loai_diem_to: string;
  vi_do: number;
  kinh_do: number;
  // ... other fields
}
```

### 2. Map Component (`Map.tsx`)

Interactive map component that displays all logistics locations with markers.

#### Features:
- Interactive markers for each location
- Popup information on marker click
- Synchronized selection with sidebar
- Custom marker icons based on location type
- Zoom and pan controls

### 3. Location Types

The application supports various types of logistics locations:
- Warehouse
- Seaport
- Depot
- Company
- Airport

Each type has its own icon and styling in both the sidebar and map.

## State Management

The application uses React's built-in state management through hooks:
- `useState` for local component state
- `useMemo` for optimized computations
- Props for component communication

## Styling Architecture

The project uses a modular CSS approach with separate stylesheets for each component:

### Sidebar Styling Highlights:
- Responsive design
- Hover effects
- Custom scrollbar
- Smooth transitions
- Consistent spacing and typography

### Map Styling Highlights:
- Custom marker styles
- Popup customization
- Control panel styling
- Responsive layout

## API Integration

The application is designed to work with a REST API:

```typescript
// apiConfig.ts
export const API_ENDPOINTS = {
  locations: '/api/locations',
  // ... other endpoints
};
```

## Data Flow

1. App loads and fetches location data
2. Data is processed and stored in state
3. Sidebar displays grouped and sorted locations
4. Map displays markers based on location data
5. User interactions sync between sidebar and map

## Best Practices Implemented

1. **TypeScript Integration**
   - Strong typing for all components and data structures
   - Interface definitions for props and state

2. **Performance Optimization**
   - Memoized computations for sorting and filtering
   - Efficient rendering with proper React hooks usage
   - Optimized marker rendering on map

3. **Code Organization**
   - Modular component structure
   - Separation of concerns
   - Clear file naming conventions

4. **Styling Methodology**
   - Consistent color scheme
   - Responsive design patterns
   - Reusable CSS classes

## User Interface Features

### Sidebar UI
- Search box with icon
- Type headers with counts
- Location items with icons
- Hover effects and transitions
- Clear visual hierarchy

### Map UI
- Custom markers
- Interactive popups
- Zoom controls
- Responsive layout

## Future Enhancements

1. **Potential Features**
   - Advanced filtering options
   - Route planning
   - Location clustering
   - Custom marker icons
   - Real-time updates

2. **Performance Improvements**
   - Virtual scrolling for long lists
   - Map marker clustering
   - Lazy loading of location details

3. **UI Enhancements**
   - Dark mode support
   - More interactive animations
   - Additional map layers
   - Custom themes

## Maintenance Guidelines

1. **Adding New Location Types**
   - Update `ALL_LOCATION_TYPES` array
   - Add corresponding icon in `getTypeIcon`
   - Update type definitions
   - Add styling for new type

2. **Styling Updates**
   - Follow existing color scheme
   - Maintain consistent spacing
   - Use existing CSS variables
   - Test responsiveness

3. **Component Updates**
   - Maintain TypeScript types
   - Update relevant tests
   - Follow existing patterns
   - Document changes

## Testing Strategy

1. **Component Testing**
   - Unit tests for components
   - Integration tests for map and sidebar
   - Event handling tests
   - State management tests

2. **UI Testing**
   - Responsive design tests
   - Cross-browser compatibility
   - Accessibility testing
   - Visual regression tests

## Deployment Considerations

1. **Build Process**
   - TypeScript compilation
   - CSS optimization
   - Asset optimization
   - Environment variables

2. **Performance Monitoring**
   - Load time metrics
   - Interaction metrics
   - Error tracking
   - Usage analytics

## Conclusion

This documentation serves as a comprehensive guide to the Logistics Manager project, covering its architecture, components, and best practices. Regular updates to this documentation will help maintain project consistency and facilitate future development.
