# Chi tiết yêu cầu tính năng

## 1. Vùng: Header

### 1.1. Tính năng: Logo
- **Mục đích**: Dẫn về trang chủ để người dùng có thể bắt đầu lại từ đầu.
- **Luồng thực hiện**:
  1. Người dùng nhấn vào logo.
  2. Hệ thống chuyển hướng đến trang chủ (URL mặc định hoặc định nghĩa trong routing).
- **Chi tiết hiển thị**:
  - Logo phải rõ ràng, có kích thước phù hợp (trong ảnh là "Smartlog").
  - Phản hồi khi người dùng nhấn vào (thay đổi giao diện nhẹ như đổi màu hoặc hiệu ứng nhấn).
- **Task chi tiết**:
  - Đặt logo ở góc trái trên cùng.
  - Liên kết logo với trang chủ (ví dụ: `/home`).
  - Tối ưu để hiển thị tốt trên mọi kích cỡ màn hình (Responsive).

### 1.2. Tính năng: Menu điều hướng
- **Mục đích**: Cung cấp khả năng điều hướng nhanh đến các trang khác trong hệ thống.
- **Luồng thực hiện**:
  1. Người dùng nhấn vào một mục (ví dụ: "About").
  2. Hệ thống chuyển hướng đến trang tương ứng.
  3. Trạng thái mục đang chọn được đánh dấu (highlight).
- **Chi tiết hiển thị**:
  - Các mục hiển thị: "About", "Services", "Contact".
  - Khoảng cách giữa các mục đủ để dễ nhấn, ngay cả trên thiết bị di động.
- **Task chi tiết**:
  - Thiết kế menu phù hợp, hỗ trợ hover và trạng thái chọn (hover → đổi màu, active → gạch chân hoặc màu nổi bật).
  - Kết nối từng mục với các trang tương ứng.
  - Kiểm tra trạng thái hoạt động chính xác khi ở từng trang.

### 1.3. Tính năng: Nút "Add Info"
- **Mục đích**: Mở form nhập liệu để người dùng thêm địa điểm mới vào hệ thống.
- **Luồng thực hiện**:
  1. Người dùng nhấn vào nút "Add Info".
  2. Một popup hoặc trang mới mở ra chứa form nhập liệu.
  3. Người dùng điền thông tin và nhấn nút "Submit".
  4. Dữ liệu được lưu trữ vào cơ sở dữ liệu và hiển thị lại trên bản đồ/danh sách.
- **Chi tiết hiển thị**:
  - Nút có màu cam nổi bật để thu hút sự chú ý.
  - Icon hoặc text "Add Info" phải dễ hiểu.
- **Task chi tiết**:
  - Tạo sự kiện khi nhấn nút, mở form nhập dữ liệu.
  - Tích hợp kiểm tra dữ liệu trước khi lưu (validation).
  - Tích hợp API lưu trữ dữ liệu.

---

## 2. Vùng: Sidebar

### 2.1. Tính năng: Bộ lọc danh mục
- **Mục đích**: Giúp người dùng lọc các địa điểm theo loại (Warehouse, Airport, Seaport, Depot, Company).
- **Luồng thực hiện**:
  1. Người dùng nhấn vào một danh mục (ví dụ: "Warehouse").
  2. Hệ thống chỉ hiển thị các địa điểm thuộc loại đó trên danh sách và bản đồ.
  3. Người dùng có thể nhấn "Show All" để hiển thị tất cả địa điểm.
- **Chi tiết hiển thị**:
  - Mỗi danh mục là một nút với icon và text tương ứng.
  - Trạng thái bật/tắt của nút thay đổi màu để dễ nhận biết.
- **Task chi tiết**:
  - Xây dựng logic lọc dữ liệu trên cơ sở dữ liệu (ví dụ: truy vấn chỉ lấy các địa điểm có `type = "Warehouse"`).
  - Tích hợp trạng thái nút (active/inactive).
  - Đồng bộ kết quả hiển thị trên danh sách và bản đồ.

### 2.2. Tính năng: Ô tìm kiếm "Your Location"
- **Mục đích**: Tìm kiếm địa điểm gần một vị trí cụ thể mà người dùng nhập vào.
- **Luồng thực hiện**:
  1. Người dùng nhập địa chỉ hoặc từ khóa (ví dụ: "G243 Bùi Văn Hòa").
  2. Hệ thống gọi API định vị (ví dụ: Google Maps Geocoding API) để tìm tọa độ vị trí.
  3. Kết quả tìm kiếm hiển thị các địa điểm gần đó trên danh sách và bản đồ.
- **Chi tiết hiển thị**:
  - Ô input có placeholder "Your location".
  - Gợi ý địa chỉ khi người dùng nhập (Autocomplete).
- **Task chi tiết**:
  - Tích hợp API định vị (Geocoding hoặc Places API).
  - Hiển thị danh sách gợi ý dưới ô tìm kiếm khi người dùng nhập.
  - Kết nối kết quả tìm kiếm với danh sách và bản đồ.

### 2.3. Tính năng: Danh sách kết quả tìm kiếm
- **Mục đích**: Hiển thị thông tin chi tiết của các địa điểm phù hợp với bộ lọc hoặc tìm kiếm.
- **Luồng thực hiện**:
  1. Danh sách tự động cập nhật theo kết quả tìm kiếm hoặc bộ lọc.
  2. Người dùng nhấn vào một mục trong danh sách, hệ thống sẽ highlight vị trí tương ứng trên bản đồ.
- **Chi tiết hiển thị**:
  - Tên địa điểm, địa chỉ, loại hình (Type), diện tích (Total Area), giá (Price), chất lượng (Quality), xếp hạng (Rating), và hình ảnh.
- **Task chi tiết**:
  - Kết nối danh sách với dữ liệu từ cơ sở dữ liệu.
  - Tạo sự kiện nhấn vào từng mục để đồng bộ với bản đồ.
  - Tối ưu giao diện hiển thị (hình ảnh, text dễ đọc).

---

## 3. Vùng: Main Content (Google Maps)

### 3.1. Tính năng: Hiển thị bản đồ
- **Mục đích**: Cung cấp cái nhìn trực quan về vị trí của các địa điểm.
- **Luồng thực hiện**:
  1. Hệ thống tải bản đồ tại khu vực được chỉ định hoặc dựa vào vị trí người dùng (nếu cho phép truy cập vị trí).
  2. Các marker hiển thị các địa điểm trên bản đồ.
- **Chi tiết hiển thị**:
  - Marker đại diện cho các địa điểm.
  - Bản đồ có thể zoom in/out và di chuyển.
- **Task chi tiết**:
  - Tích hợp Google Maps API.
  - Hiển thị marker từ dữ liệu.

### 3.2. Tính năng: Marker trên bản đồ
- **Mục đích**: Đánh dấu vị trí các địa điểm trên bản đồ.
- **Luồng thực hiện**:
  1. Marker được hiển thị khi có dữ liệu địa điểm.
  2. Người dùng nhấn vào marker, popup thông tin hiện ra.
- **Chi tiết hiển thị**:
  - Mỗi marker có icon đại diện loại hình (Warehouse, Airport, v.v.).
- **Task chi tiết**:
  - Gắn marker vào bản đồ tại tọa độ từ cơ sở dữ liệu.
  - Kết nối sự kiện nhấn marker với popup thông tin.

### 3.3. Tính năng: Popup thông tin địa điểm
- **Mục đích**: Hiển thị chi tiết thông tin địa điểm khi nhấn vào marker.
- **Luồng thực hiện**:
  1. Người dùng nhấn vào marker.
  2. Popup xuất hiện với đầy đủ thông tin: Tên, địa chỉ, diện tích, giá, chất lượng, hình ảnh.
- **Chi tiết hiển thị**:
  - Popup nổi trên bản đồ, có nút đóng.
- **Task chi tiết**:
  - Thiết kế giao diện popup.
  - Hiển thị thông tin từ dữ liệu khi nhấn marker.

### 3.4. Tính năng: Đồng bộ danh sách và bản đồ
- **Mục đích**: Khi người dùng nhấn vào một mục trong danh sách, bản đồ tự động highlight vị trí tương ứng.
- **Task chi tiết**:
  - Xây dựng sự kiện chọn mục trong danh sách → điều hướng bản đồ đến vị trí tương ứng.
  - Thay đổi giao diện marker (highlight) khi được chọn.
