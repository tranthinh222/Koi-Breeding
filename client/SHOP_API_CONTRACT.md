# Shop API contract

Base URL: `http://localhost:8080/api` (hoặc `VITE_API_BASE_URL`). Hiện chưa cần token.

## Product DTO

```json
{
  "id": 8,
  "name": "250 Koins",
  "category": "CURRENCY",
  "price": 0.99,
  "currency": "USD",
  "coinAmount": 250,
  "description": "A starter Koin package."
}
```

`category`: `FOOD`, `MEDICINE`, `KOI`, `CURRENCY`. Với gói `CURRENCY`, `coinAmount` là số Koins nhận được còn `price`/`currency=USD` là tiền thật thanh toán; ví dụ nhận 250 Koins khi trả `$0.99`.

| Chức năng                 | Endpoint                                 | Dữ liệu                            | Kết quả                                                               |
| ------------------------- | ---------------------------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| Danh sách Shop theo tab   | `GET /shop/products?category=FOOD`       | Có thể thêm `page`, `size`, `sort` | `ProductDto[]` hoặc `{ data: ProductDto[] }`                          |
| Chi tiết sản phẩm         | `GET /shop/products/{id}`                | —                                  | `ProductDto`                                                          |
| Mua item/Koi bằng Koins   | `POST /shop/products/{id}/purchase`      | `{ "quantity": 1 }`                | `{ "purchaseId": 10, "walletBalance": 24800, "inventoryItemId": 35 }` |
| Gói Koins/thanh toán thật | `POST /shop/coin-packages/{id}/checkout` | URL callback/nhà cung cấp nếu cần  | `{ "checkoutUrl": "..." }`                                            |
| Xác nhận payment webhook  | `POST /payments/webhook`                 | Payload từ payment provider        | `200 OK`; cộng Koins theo giao dịch idempotent                        |
| Số dư để HUD              | `GET /wallet/me`                         | —                                  | `{ "balance": 25800 }`                                                |

Mua item phải chạy transaction: kiểm tra số dư → trừ `wallet.balance` → thêm/cộng `inventory` → tạo `transaction`. Mua Koi phải tạo Koi/đặt vào pond phù hợp. Không trả entity `User` trực tiếp để tránh lộ `password`.

Frontend hiện gọi `GET /shop/products?category=...` và `POST /shop/products/{id}/purchase`. Nếu backend chưa sẵn sàng, nó hiển thị dữ liệu demo để kiểm thử giao diện.
