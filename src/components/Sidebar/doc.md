# Sidebar Module Documentation

## Overview
Sidebar module quản lý giao diện tìm kiếm và hiển thị danh sách các địa điểm, cho phép người dùng tìm kiếm và chọn địa điểm để tìm đường.

## Components

### SearchSection
- **Input Fields**:
  - Start Location Input
  - End Location Input
  - Clear buttons cho mỗi input
  - Current Location button
  - Search Route button
  - Send Route Info button

### LocationList
- Hiển thị danh sách địa điểm theo loại
- Collapsible sections cho mỗi loại
- Hiển thị số lượng địa điểm trong mỗi loại

### RouteInfo
- Hiển thị thông tin về tuyến đường
- Khoảng cách và thời gian dự kiến
- Nút gửi thông tin qua email
- Hiển thị điểm đầu/cuối với icons

## Features

### Location Search
- **Search Logic**:
  - Tìm kiếm real-time khi nhập
  - Lọc theo loại địa điểm
  - Hiển thị kết quả theo nhóm

### Current Location
- Sử dụng Geolocation API
- Tự động điền vào input đang focus
- Xử lý các trường hợp lỗi

### Route Search
- Validate cả hai input
- Tìm đường khi có đủ điểm đầu và điểm cuối
- Hiển thị kết quả trên bản đồ
- Hiển thị thông tin chi tiết

### Send Route Info
- Gửi thông tin qua email
- Preview thông tin trước khi gửi
- Xác nhận gửi thành công

## State Management
- `startLocation`: Địa điểm bắt đầu
- `endLocation`: Địa điểm kết thúc
- `isSelectingStart`: Đang chọn input nào
- `expandedTypes`: Các loại địa điểm đang mở rộng
- `routeInfo`: Thông tin về route hiện tại

## Events
1. **Input Focus**:
   - Cập nhật isSelectingStart
   - Cập nhật danh sách địa điểm theo input

2. **Location Selection**:
   - Cập nhật input tương ứng
   - Trigger map update

3. **Route Info**:
   - Hiển thị khi có đủ thông tin
   - Cập nhật khi thay đổi điểm
   - Clear khi xóa input

## Styling
- Responsive design
- Animations cho expand/collapse
- Hover effects
- Focus states
- Clear button animations
- Route info card design

## Error Handling
- Geolocation errors
- Search validation
- Route finding errors
- Email sending errors

## Performance
- Debounced search
- Memoized location lists
- Optimized re-renders
- Lazy loading components
