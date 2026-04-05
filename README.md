# Product Dashboard

## Mô tả dự án

Dashboard hiển thị danh sách sản phẩm từ API: https://api.escuelajs.co/api/v1/products

## Các tính năng đã hoàn thành

### 1. ✅ Fetch data từ API và hiển thị trong dashboard

- Kéo dữ liệu từ API khi trang load
- Hiển thị loading indicator khi đang tải dữ liệu
- Hiển thị dữ liệu trong bảng Bootstrap đẹp mắt

### 2. ✅ Tuân theo format CSS của Bootstrap

- Sử dụng Bootstrap 5.3.0
- Áp dụng các class: container-fluid, table, table-striped, table-hover, card, form-control, btn, pagination
- Responsive design với các breakpoint của Bootstrap

### 3. ✅ Tìm kiếm theo title với onChange

- Ô tìm kiếm tự động filter kết quả khi người dùng nhập
- Sử dụng event `input` để cập nhật real-time
- Reset về trang 1 khi tìm kiếm

### 4. ✅ Nút sort ở cột giá và title

- Nút sort với icon ⇅ ở cột Title và Giá
- Click để sort tăng dần/giảm dần
- Toggle giữa ascending và descending

### 5. ✅ Phân trang với limit 5, 10, 20 phần tử

- Dropdown chọn số lượng hiển thị: 5, 10, 20 sản phẩm
- Pagination với nút Previous/Next
- Hiển thị số trang hiện tại
- Hiển thị thống kê "Hiển thị X - Y trong tổng số Z sản phẩm"

### 6. ✅ Ẩn cột description, hiển thị khi hover

- Description không hiển thị trong bảng
- Khi hover vào dòng sản phẩm, tooltip hiển thị description
- Tooltip theo con trỏ chuột
- Tooltip có border và shadow đẹp mắt

## Cấu trúc file

```
NNPTUD_s4/
├── dashboard.html    # File HTML chính
├── styles.css        # File CSS tùy chỉnh
├── script.js         # File JavaScript với tất cả logic
└── README.md         # File hướng dẫn này
```

## Cách sử dụng

1. Mở file `dashboard.html` trong trình duyệt web
2. Chờ dữ liệu load từ API
3. Sử dụng các tính năng:
   - **Tìm kiếm**: Nhập text vào ô "Tìm kiếm theo Title"
   - **Thay đổi limit**: Chọn số lượng sản phẩm hiển thị từ dropdown
   - **Sort**: Click vào nút ⇅ bên cạnh Title hoặc Giá
   - **Phân trang**: Click vào số trang hoặc nút Previous/Next
   - **Xem description**: Di chuột vào bất kỳ dòng sản phẩm nào

## Công nghệ sử dụng

- **HTML5**: Cấu trúc trang
- **CSS3**: Styling và animations
- **Bootstrap 5.3.0**: Framework CSS
- **JavaScript (ES6+)**: Logic xử lý
- **Fetch API**: Gọi REST API
- **Async/Await**: Xử lý bất đồng bộ

## Các điểm nổi bật

- ✅ Code sạch, có comments rõ ràng
- ✅ Responsive design, hoạt động tốt trên mobile
- ✅ User-friendly interface
- ✅ Smooth animations và transitions
- ✅ Error handling khi API fail
- ✅ Loading indicator
- ✅ Tooltip thông minh không bị tràn màn hình

## Screenshots

### 1. Dashboard chính với dữ liệu đầy đủ

![Dashboard chính](screenshots/main-dashboard.png)

### 2. Chức năng tìm kiếm

![Tìm kiếm](screenshots/search-feature.png)

### 3. Chức năng sort

![Sort](screenshots/sort-feature.png)

### 4. Phân trang với các limit khác nhau

![Phân trang](screenshots/pagination-feature.png)

### 5. Tooltip description khi hover

![Tooltip](screenshots/tooltip-feature.png)

---

**Lưu ý**: Để chạy project, chỉ cần mở file `dashboard.html` trong trình duyệt. Không cần cài đặt thêm gì cả vì đã sử dụng CDN cho Bootstrap.
