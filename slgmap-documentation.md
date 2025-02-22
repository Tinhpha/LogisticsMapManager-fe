[Previous sections remain the same up to API Quản lý người dùng...]

### Quản lý địa điểm

#### 1. Tìm kiếm địa điểm
- **Endpoint:** `GET /api/locations`
- **Authentication:** Required
- **Permission:** VIEW_LOCATIONS
- **Query Parameters:**
  - search: string (tìm kiếm theo tên/địa chỉ)
  - business_type: string
  - district: string
  - min_rate: number
  - sort: string (name, rate, created_at)
  - order: string (asc, desc)
  - page: integer
  - per_page: integer
- **Response:** Array of Location objects

#### 2. Lọc địa điểm chi tiết
- **Endpoint:** `GET /api/locations/filter`
- **Authentication:** Required
- **Query Parameters:**
  - business_type: string
  - district: string
  - min_rate: number
  - search: string
  - max_distance: number (km)
  - latitude: number
  - longitude: number
  - page: integer (default: 1)
  - per_page: integer (default: 10)
- **Response:**
  ```json
  {
    "locations": [Location],
    "total": "integer",
    "pages": "integer",
    "current_page": "integer"
  }
  ```

#### 3. Thêm địa điểm mới
- **Endpoint:** `POST /api/locations`
- **Authentication:** Required
- **Permission:** CREATE_LOCATION
- **Request Body:** Location object
- **Response:** 201 Created

#### 4. Xem chi tiết địa điểm
- **Endpoint:** `GET /api/locations/{id}`
- **Authentication:** Required
- **Permission:** VIEW_LOCATIONS
- **Parameters:**
  - id: integer (path parameter)
- **Response:** Location object

#### 5. Cập nhật địa điểm
- **Endpoint:** `PUT /api/locations/{id}`
- **Authentication:** Required
- **Permission:** EDIT_LOCATION
- **Parameters:**
  - id: integer (path parameter)
- **Request Body:** Location object
- **Response:** 200 OK

#### 6. Xóa địa điểm
- **Endpoint:** `DELETE /api/locations/{id}`
- **Authentication:** Required
- **Permission:** DELETE_LOCATION
- **Parameters:**
  - id: integer (path parameter)
- **Response:** 204 No Content

#### 7. Xuất dữ liệu địa điểm
- **Endpoint:** `POST /api/locations/export`
- **Authentication:** Required
- **Permission:** EXPORT_ROUTE (VIP)
- **Request Body:**
  ```json
  {
    "format": "csv",
    "filters": {
      "business_type": "string",
      "district": "string"
    }
  }
  ```
- **Response:** CSV file

### Quản lý vai trò (Roles)

#### 1. Xem danh sách vai trò
- **Endpoint:** `GET /api/roles`
- **Authentication:** Required
- **Permission:** MANAGE_USERS
- **Response:** Array of Role objects

#### 2. Tạo vai trò mới
- **Endpoint:** `POST /api/roles`
- **Authentication:** Required
- **Permission:** MANAGE_USERS
- **Request Body:** Role object
- **Response:** 201 Created

#### 3. Cập nhật vai trò
- **Endpoint:** `PUT /api/roles/{id}`
- **Authentication:** Required
- **Permission:** MANAGE_USERS
- **Parameters:**
  - id: integer (path parameter)
- **Request Body:** Role object
- **Response:** 200 OK

#### 4. Xóa vai trò
- **Endpoint:** `DELETE /api/roles/{id}`
- **Authentication:** Required
- **Permission:** MANAGE_USERS
- **Parameters:**
  - id: integer (path parameter)
- **Response:** 204 No Content

#### 5. Gán vai trò cho người dùng
- **Endpoint:** `PUT /api/users/{user_id}/roles`
- **Authentication:** Required
- **Permission:** MANAGE_USERS
- **Parameters:**
  - user_id: integer (path parameter)
- **Request Body:**
  ```json
  {
    "roles": ["string"]
  }
  ```
- **Response:** 200 OK

[Rest of the document remains the same...]
