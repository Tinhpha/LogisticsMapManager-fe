# Routing Service Documentation

## Overview
Routing Service quản lý việc tìm và hiển thị đường đi giữa hai điểm trên bản đồ, sử dụng OSRM API.

## Core Functions

### initializeRouting
- Khởi tạo service với map instance
- Setup event handlers
- Khởi tạo route layer

### findRoute
- **Parameters**:
  - `start`: Location - Điểm bắt đầu
  - `end`: Location - Điểm kết thúc
- **Returns**: Promise<RouteResult>
  ```typescript
  interface RouteResult {
    distance: number;    // Meters
    duration: number;    // Seconds
    coordinates: number[][];
  }
  ```
- Sử dụng OSRM API để tìm đường đi ngắn nhất

### displayRoute
- Hiển thị đường đi trên bản đồ
- Styling với màu xanh dương và hiệu ứng glow
- Tự động zoom để hiển thị toàn bộ route

### clearRoute
- Xóa route hiện tại khỏi map
- Reset state
- Cleanup resources

## API Integration

### OSRM API
- Base URL: `https://router.project-osrm.org/route/v1/driving`
- Parameters:
  - Coordinates: `{longitude},{latitude}`
  - Options: `overview=full&geometries=geojson`
- Response handling và error management

## Route Styling
- Color: #2962FF
- Weight: 5px
- Opacity: 0.8
- Glow effect
- Animation

## Route Information
- Khoảng cách (m/km)
- Thời gian dự kiến (phút)
- Tọa độ các điểm
- Send to email functionality

## Error Handling
- Network errors
- Invalid coordinates
- No route found
- Timeout handling
- Retry mechanism

## Performance
- Route caching
- Cleanup on unmount
- Efficient polyline rendering
- Memory management

## Dependencies
- OSRM API
- Leaflet.js
- GeoJSON utilities
- Email service

## Usage Examples
```typescript
// Initialize service
routingService.initialize(mapInstance);

// Find and display route
const route = await routingService.findRoute(startLocation, endLocation);
routingService.displayRoute(route);

// Clear route
routingService.clearRoute();

// Send route info
routingService.sendRouteInfo(routeInfo, email);
```
