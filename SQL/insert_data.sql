USE Cinema;
GO

-----------------------------------------------------
-- 1. CINEMA
-----------------------------------------------------
INSERT INTO Cinema (CinemaID, Name, Location, OpeningHours, ClosingHours)
VALUES
(1, N'Rạp A', N'Địa chỉ 01', '08:00', '22:00'),
(2, N'Rạp B', N'Địa chỉ 02', '09:00', '23:00'),
(3, N'Rạp C', N'Địa chỉ 03', '08:30', '22:30'),
(4, N'Rạp D', N'Địa chỉ 04', '09:00', '23:00'),
(5, N'Rạp E', N'Địa chỉ 05', '08:00', '22:00');


-----------------------------------------------------
-- 2. CINEMAPHONE
-----------------------------------------------------
INSERT INTO CinemaPhone (CinemaID, PhoneNumber)
VALUES
(1, '0900000001'),
(2, '0900000002'),
(3, '0900000003'),
(4, '0900000004'),
(5, '0900000005');


-----------------------------------------------------
-- 3. ROOM
-----------------------------------------------------
INSERT INTO Room (RoomID, CinemaID, Type, Capacity, Status)
VALUES
(1, 1, N'2D', 120, N'Đang hoạt động'),
(2, 2, N'3D', 150, N'Đang hoạt động'),
(3, 3, N'IMAX', 200, N'Đang hoạt động'),
(4, 4, N'4D', 80, N'Bảo trì'),
(5, 5, N'2D', 100, N'Tạm ngưng');


-----------------------------------------------------
-- 4. SCREEN (1–1 với ROOM)
-----------------------------------------------------
INSERT INTO Screen (ScreenID, RoomID, Type, Size, SupportFormat)
VALUES
(1, 1, N'Tiêu chuẩn', N'50 inch', N'2D'),
(2, 2, N'Tiêu chuẩn', N'70 inch', N'2D,3D'),
(3, 3, N'IMAX',       N'120 inch', N'2D,3D'),
(4, 4, N'4DX',        N'90 inch',  N'2D,4D'),
(5, 5, N'LED',        N'65 inch',  N'2D');


-----------------------------------------------------
-- 5. SEAT
-----------------------------------------------------
INSERT INTO Seat (SeatNumber, RoomID, SeatType, BasePrice)
VALUES
(N'A1', 1, N'Thường', 70000),
(N'A2', 1, N'Thường', 70000),
(N'B1', 2, N'VIP', 90000),
(N'C1', 3, N'Đôi', 120000),
(N'D1', 3, N'Thường', 80000);


-----------------------------------------------------
-- 6. CUSTOMER
-----------------------------------------------------
INSERT INTO Customer
(CustomerID, FullName, Email, PhoneNumber, DateOfBirth, MembershipLevel, RegistrationDate, TotalSpent, TotalOrders)
VALUES
(1, N'Nguyễn Văn A', 'user01@example.com', '0901111111', '2000-01-01', N'Thường', '2024-01-10', 0, 0),
(2, N'Trần Thị B',   'user02@example.com', '0902222222', '2001-02-02', N'VIP',     '2024-01-11', 0, 0),
(3, N'Lê Văn C',     'user03@example.com', '0903333333', '2002-03-03', N'Thường', '2024-01-12', 0, 0),
(4, N'Phạm Thị D',   'user04@example.com', '0904444444', '2003-04-04', N'VIP',     '2024-01-13', 0, 0),
(5, N'Hoàng Văn E',  'user05@example.com', '0905555555', '2004-05-05', N'Thường', '2024-01-14', 0, 0);


-----------------------------------------------------
-- 7. MOVIE
-----------------------------------------------------
INSERT INTO Movie
(MovieID, Title, AgeRating, ReleaseDate, Duration, CustomerRating, Genre, Language, Description, Studio, Country, PosterURL, Director)
VALUES
(1, N'Phim A', 'PG',    '2020-01-01', 120, 2.1, N'Hành động', N'VN', N'Mô tả A', N'Studio A', N'VN',  N'Đạo diễn A'),
(2, N'Phim B', 'PG-13', '2020-02-01', 110, 1.9, N'Hài',        N'VN', N'Mô tả B', N'Studio B', N'VN',  N'Đạo diễn B'),
(3, N'Phim C', 'R',     '2020-03-01', 130, 7.2, N'Kinh dị',    N'VN', N'Mô tả C', N'Studio C', N'VN', N'Đạo diễn C'),
(4, N'Phim D', 'G',     '2020-04-01',  95, 3.9, N'Hoạt hình',  N'VN', N'Mô tả D', N'Studio D', N'VN',  N'Đạo diễn D'),
(5, N'Phim E', 'PG',    '2020-05-01', 105, 9.9, N'Lãng mạn',   N'VN', N'Mô tả E', N'Studio E', N'VN',  N'Đạo diễn E');


-----------------------------------------------------
-- 8. SHOWTIME
-----------------------------------------------------
INSERT INTO Showtime
(ShowtimeID, MovieID, RoomID, CinemaID, StartTime, EndTime, Date, BasePriceMultiplier)
VALUES
(1, 1, 1, 1, '10:00', '12:00', '2024-11-20', 1.0),
(2, 2, 2, 2, '13:00', '15:00', '2024-11-20', 1.2),
(3, 3, 3, 3, '16:00', '18:00', '2024-11-20', 1.5),
(4, 4, 1, 1, '18:00', '19:30', '2024-11-20', 1.1),
(5, 5, 3, 3, '20:00', '21:45', '2024-11-20', 1.3);


-----------------------------------------------------
-- 9. EMPLOYEE
-----------------------------------------------------
INSERT INTO Employee
(EmployeeID, CinemaID, FullName, Email, Address, DateOfBirth, Sex, Salary, SupervisorID)
VALUES
(1, 1, N'Nhân viên A', 'emp01@example.com', N'Địa chỉ 1', '1990-01-01', N'Nam', 12000000, NULL),
(2, 1, N'Nhân viên B', 'emp02@example.com', N'Địa chỉ 2', '1991-02-02', N'Nữ', 11000000, 1),
(3, 2, N'Nhân viên C', 'emp03@example.com', N'Địa chỉ 3', '1992-03-03', N'Nam', 10000000, 1),
(4, 3, N'Nhân viên D', 'emp04@example.com', N'Địa chỉ 4', '1993-04-04', N'Nữ', 13000000, 1),
(5, 4, N'Nhân viên E', 'emp05@example.com', N'Địa chỉ 5', '1994-05-05', N'Nam',  9000000, 1);


-----------------------------------------------------
-- 10. VOUCHER
-----------------------------------------------------
INSERT INTO Voucher
(VoucherID, Code, Description, Type, Discount, Amount, IssueDate, ExpirationDate,
 MaxUsage, UsedCount, IsActive, MinOrderValue, MaxDiscountValue, IsStackable)
VALUES
(1, N'VC10', N'Giảm 10%', N'PERCENT', 10, NULL, '2024-01-01','2024-12-31', 100, 0, 1,  50000, 20000, 0),
(2, N'VC20', N'Giảm 20%', N'PERCENT', 20, NULL, '2024-01-01','2024-12-31', 100, 0, 1, 100000, 30000, 0),
(3, N'FIX50',N'Giảm 50K', N'FIXED',   NULL, 50000,'2024-01-01','2024-12-31', 200, 0, 1, 100000, 50000, 0),
(4, N'ST15', N'SV 15%',   N'PERCENT', 15, NULL, '2024-01-01','2024-12-31', 150, 0, 1,  30000, 20000, 1),
(5, N'EARLY30',N'Early 30K',N'FIXED', NULL,30000,'2024-01-01','2024-06-30', 50,  0, 1,      0, 30000, 0);


-----------------------------------------------------
-- 11. CUSTOMER–VOUCHER
-----------------------------------------------------
INSERT INTO CustomerVoucher (CustomerID, VoucherID, AssignedDate)
VALUES
(1, 1, '2024-06-01'),
(2, 2, '2024-06-02'),
(3, 3, '2024-06-03'),
(4, 4, '2024-06-04'),
(5, 5, '2024-06-05');


-----------------------------------------------------
-- 12. FOOD & DRINK
-----------------------------------------------------
INSERT INTO FoodAndDrink (ItemID, Name, Size, Price, IsAvailable, StockQuantity)
VALUES
(1, N'Bắp nhỏ', N'Nhỏ', 30000, 1, 100),
(2, N'Bắp vừa', N'Vừa', 45000, 1, 80),
(3, N'Nước ngọt', N'Lớn', 25000, 1, 200),
(4, N'Nước suối', N'Nhỏ', 10000, 1, 300),
(5, N'Combo', N'Vừa', 70000, 1, 50);


-----------------------------------------------------
-- 13. ORDERS
-----------------------------------------------------
INSERT INTO Orders
(OrderID, CustomerID, Date, Time, TotalPrice, Status, PaymentMethod, VoucherID)
VALUES
(1, 1,'2024-11-20','10:00',100000,N'Hoàn thành',N'Tiền mặt',1),
(2, 2,'2024-11-20','12:00',150000,N'Hoàn thành',N'Thẻ',2),
(3, 3,'2024-11-20','14:00', 80000,N'Xử lý',     N'Ví',NULL),
(4, 4,'2024-11-20','16:00',200000,N'Hoàn thành',N'Ví',3),
(5, 5,'2024-11-20','18:00', 90000,N'Xử lý',     N'Tiền mặt',NULL);


-----------------------------------------------------
-- 14. ORDER–FOOD
-----------------------------------------------------
INSERT INTO OrderFoodDrink (OrderID, ItemID, Quantity)
VALUES
(1, 1, 1),
(1, 3, 2),
(2, 5, 1),
(3, 2, 1),
(4, 4, 2);


-----------------------------------------------------
-- 15. MOVIE–CUSTOMER RATING
-----------------------------------------------------
INSERT INTO MovieCustomerRating (MovieID, CustomerID, RatingDate, Score, Comment)
VALUES
(1, 1,'2024-11-21',8,N'Hay'),
(2, 2,'2024-11-21',9,N'Rất tốt'),
(3, 3,'2024-11-21',7,N'Ổn'),
(4, 4,'2024-11-21',8,N'OK'),
(5, 5,'2024-11-21',9,N'Tuyệt');


-----------------------------------------------------
-- 16. TICKET
-----------------------------------------------------
INSERT INTO Ticket (TicketID, OrderID, ShowtimeID, SeatNumber, RoomID, Price)
VALUES
(1, 1, 1, N'A1', 1, 70000),
(2, 1, 1, N'A2', 1, 70000),
(3, 2, 2, N'B1', 2, 90000),
(4, 4, 3, N'C1', 3,120000),
(5, 5, 5, N'D1', 3, 80000);
