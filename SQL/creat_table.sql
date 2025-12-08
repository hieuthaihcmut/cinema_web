USE Cinema;
GO

-----------------------------------------------------
-- TẠO BẢNG CINEMA
-----------------------------------------------------
CREATE TABLE Cinema (
    CinemaID INT PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Location NVARCHAR(255) NOT NULL,
    OpeningHours TIME NOT NULL,
    ClosingHours TIME NOT NULL
);


-----------------------------------------------------
-- CINEMAPHONE (đa trị)
-----------------------------------------------------
CREATE TABLE CinemaPhone (
    CinemaID INT NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    PRIMARY KEY (CinemaID, PhoneNumber),
    FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID)
);


-----------------------------------------------------
-- ROOM
-----------------------------------------------------
CREATE TABLE Room (
    RoomID INT PRIMARY KEY,
    CinemaID INT NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Capacity INT NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID)
);


-----------------------------------------------------
-- SCREEN (1–1 ROOM)
-----------------------------------------------------
CREATE TABLE Screen (
    ScreenID INT PRIMARY KEY,
    RoomID INT UNIQUE NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Size NVARCHAR(50) NOT NULL,
    SupportFormat NVARCHAR(100) NOT NULL,
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);


-----------------------------------------------------
-- SEAT (thực thể yếu)
-----------------------------------------------------
CREATE TABLE Seat (
    SeatNumber NVARCHAR(10) NOT NULL,
    RoomID INT NOT NULL,
    SeatType NVARCHAR(30) NOT NULL,
    BasePrice INT NOT NULL,
    PRIMARY KEY (SeatNumber, RoomID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);


-----------------------------------------------------
-- CUSTOMER
-----------------------------------------------------
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber NVARCHAR(15) NOT NULL UNIQUE,
    DateOfBirth DATE NOT NULL,
    MembershipLevel NVARCHAR(20) NOT NULL,
    RegistrationDate DATE NOT NULL,
    TotalSpent DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalOrders INT NOT NULL DEFAULT 0
);


-----------------------------------------------------
-- MOVIE
-----------------------------------------------------
CREATE TABLE Movie (
    MovieID INT PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    AgeRating NVARCHAR(10) NOT NULL,
    ReleaseDate DATE NOT NULL,
    Duration INT NOT NULL,
    CustomerRating DECIMAL(3,1) NULL,
    Genre NVARCHAR(100) NOT NULL,
    Language NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Studio NVARCHAR(100) NOT NULL,
    Country NVARCHAR(100) NOT NULL,
    --PosterURL NVARCHAR(255) NULL, delete
    Director NVARCHAR(100) NOT NULL
);


-----------------------------------------------------
-- SHOWTIME
-----------------------------------------------------
CREATE TABLE Showtime (
    ShowtimeID INT PRIMARY KEY,
    MovieID INT NOT NULL,
    RoomID INT NOT NULL,
    CinemaID INT NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    Date DATE NOT NULL,
    BasePriceMultiplier DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID),
    FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID)
);


-----------------------------------------------------
-- EMPLOYEE (tự giám sát chính nó)
-----------------------------------------------------
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    CinemaID INT NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Address NVARCHAR(255) NOT NULL UNIQUE,
    DateOfBirth DATE NOT NULL,
    Sex NVARCHAR(10) NOT NULL,
    Salary INT NOT NULL,
    SupervisorID INT NULL,
    FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID),
    FOREIGN KEY (SupervisorID) REFERENCES Employee(EmployeeID)
);


-----------------------------------------------------
-- VOUCHER
-----------------------------------------------------
CREATE TABLE Voucher (
    VoucherID INT PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL,
    Type NVARCHAR(20) NOT NULL,
    Discount INT NULL,
    Amount INT NULL,
    IssueDate DATE NOT NULL,
    ExpirationDate DATE NOT NULL,
    MaxUsage INT NOT NULL,
    UsedCount INT NOT NULL,
    IsActive BIT NOT NULL,
    MinOrderValue INT NOT NULL,
    MaxDiscountValue INT NOT NULL,
    IsStackable BIT NOT NULL
);


-----------------------------------------------------
-- CUSTOMER–VOUCHER (M–N)
-----------------------------------------------------
CREATE TABLE CustomerVoucher (
    CustomerID INT NOT NULL,
    VoucherID INT NOT NULL,
    AssignedDate DATE NOT NULL,
    PRIMARY KEY (CustomerID, VoucherID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (VoucherID) REFERENCES Voucher(VoucherID)
);


-----------------------------------------------------
-- FOOD AND DRINK
-----------------------------------------------------
CREATE TABLE FoodAndDrink (
    ItemID INT PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Size NVARCHAR(20) NOT NULL,
    Price INT NOT NULL,
    IsAvailable BIT NOT NULL,
    StockQuantity INT NOT NULL
);


-----------------------------------------------------
-- ORDERS
-----------------------------------------------------
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT NOT NULL,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL,
    VoucherID INT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (VoucherID) REFERENCES Voucher(VoucherID)
);


-----------------------------------------------------
-- ORDER FOOD DRINK (M–N)
-----------------------------------------------------
CREATE TABLE OrderFoodDrink (
    OrderID INT NOT NULL,
    ItemID INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (OrderID, ItemID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ItemID) REFERENCES FoodAndDrink(ItemID)
);


-----------------------------------------------------
-- MOVIE CUSTOMER RATING (M–N)
-----------------------------------------------------
CREATE TABLE MovieCustomerRating (
    MovieID INT NOT NULL,
    CustomerID INT NOT NULL,
    RatingDate DATE NOT NULL,
    Score INT NOT NULL,
    Comment NVARCHAR(255),
    PRIMARY KEY (MovieID, CustomerID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);


-----------------------------------------------------
-- TICKET
-----------------------------------------------------
CREATE TABLE Ticket (
    TicketID INT PRIMARY KEY,
    OrderID INT NOT NULL,
    ShowtimeID INT NOT NULL,
    SeatNumber NVARCHAR(10) NOT NULL,
    RoomID INT NOT NULL,
    Price INT NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ShowtimeID) REFERENCES Showtime(ShowtimeID),
    FOREIGN KEY (SeatNumber, RoomID) REFERENCES Seat(SeatNumber, RoomID)
);