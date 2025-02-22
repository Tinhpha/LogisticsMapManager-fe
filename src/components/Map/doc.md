# Map Module Documentation

## Overview
Map module là thành phần trung tâm của ứng dụng, hiển thị bản đồ tương tác và các location marker.

## Components

### MapComponent
- **Props**:
  - `center`: [number, number] - Tọa độ trung tâm bản đồ
  - `zoom`: number - Mức zoom mặc định
  - `locations`: Location[] - Danh sách các địa điểm
  - `selectedLocation`: Location | null - Địa điểm đang được chọn

### Marker System
- Sử dụng custom icons cho từng loại địa điểm
- Hiển thị popup khi click vào marker
- Animation khi marker được chọn

### Routing Display
- Hiển thị đường đi giữa hai điểm
- Sử dụng màu xanh dương (#2962FF) với hiệu ứng glow
- Tự động zoom để hiển thị toàn bộ route
- Hiển thị khoảng cách và thời gian

## State Management
- `mapInstance`: Lưu trữ instance của Leaflet map
- `markers`: Quản lý tất cả các marker trên bản đồ
- `routeLayer`: Quản lý layer hiển thị đường đi
- `routeInfo`: Lưu trữ thông tin về route hiện tại

## Events
1. **Click Marker**:
   - Hiển thị popup với thông tin địa điểm
   - Không tự động zoom vào marker

2. **Map Movement**:
   - Cập nhật center và zoom level
   - Lưu trữ viewport hiện tại

3. **Route Display**:
   - Vẽ route khi có đủ 2 điểm
   - Hiển thị thông tin khoảng cách
   - Xóa route khi clear input

## Dependencies
- Leaflet.js: Thư viện bản đồ chính
- OpenStreetMap: Nguồn dữ liệu bản đồ
- OSRM: API tính toán đường đi
- Custom Icons: Sử dụng cho các loại địa điểm khác nhau

## Styling
- Custom popup styles
- Marker animations
- Route styling với hiệu ứng glow
- Responsive design cho mobile

## Performance Optimizations
- Lazy loading của markers
- Cleanup markers khi component unmount
- Sử dụng React.memo cho các sub-components
- Cache route calculations

## Error Handling
- Xử lý lỗi khi load map
- Xử lý lỗi khi tính route
- Fallback UI khi có lỗi
- Retry mechanism cho API calls

## Future Enhancements
- Thêm waypoints
- Multiple route alternatives
- Traffic information
- Route elevation profile
