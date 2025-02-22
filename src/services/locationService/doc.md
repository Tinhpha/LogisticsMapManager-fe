# Location Service Documentation

## Overview
Location Service quản lý việc lấy và xử lý thông tin về các địa điểm, bao gồm tìm kiếm, lọc và phân loại.

## Core Functions

### getLocations
- **Parameters**:
  - `type`: LocationType (optional) - Loại địa điểm cần lấy
  - `searchTerm`: string (optional) - Từ khóa tìm kiếm
- **Returns**: Promise<Location[]>
- Lấy danh sách địa điểm theo điều kiện

### searchLocations
- **Parameters**:
  - `query`: string - Từ khóa tìm kiếm
  - `type`: LocationType (optional) - Lọc theo loại
- **Returns**: Location[]
- Tìm kiếm địa điểm theo tên hoặc mô tả

### getCurrentLocation
- **Returns**: Promise<Location>
- Sử dụng Geolocation API
- Xử lý các trường hợp lỗi

## Data Structures

### Location Interface
```typescript
interface Location {
  id: number;
  ten_diem: string;
  kinh_do: number;
  vi_do: number;
  loai_diem_to: string;
  loai_diem_nho: string;
  ghi_chu: string;
  nguoi_audit: string;
  nguoi_nhap: string;
  nguon: string;
  thuoc_cong_ty: string;
  tinh: string;
}
```

## Caching
- In-memory cache cho kết quả tìm kiếm
- Cache invalidation strategy
- Performance optimization

## Error Handling
- Network errors
- Invalid data format
- Geolocation errors
- Timeout handling

## Dependencies
- Geolocation API
- Local storage
- API endpoints

## Performance Optimizations
- Debounced search
- Cached results
- Batch processing
- Memory management
