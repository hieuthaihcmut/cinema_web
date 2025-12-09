USE Cinema
GO 

-----------------------------------------------------
-- CINEMA
-----------------------------------------------------
CREATE TABLE Cinema (
    CinemaID      INT            NOT NULL,
    Name          NVARCHAR(100)  NOT NULL,
    Location      NVARCHAR(255)  NOT NULL,
    OpeningHours  TIME           NOT NULL,
    ClosingHours  TIME           NOT NULL,
    CONSTRAINT PK_Cinema PRIMARY KEY (CinemaID)
);

-----------------------------------------------------
-- CINEMAPHONE (đa trị)
-----------------------------------------------------
CREATE TABLE CinemaPhone (
    CinemaID    INT           NOT NULL,
    PhoneNumber NVARCHAR(20)  NOT NULL,
    CONSTRAINT PK_CinemaPhone PRIMARY KEY (CinemaID, PhoneNumber),
    CONSTRAINT FK_CinemaPhone_Cinema FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID)
);

-----------------------------------------------------
-- ROOM
-----------------------------------------------------
CREATE TABLE Room (
    RoomID   INT           NOT NULL,
    CinemaID INT           NOT NULL,
    Type     NVARCHAR(50)  NOT NULL,
    Capacity INT           NOT NULL,
    Status   NVARCHAR(50)  NOT NULL,
    CONSTRAINT PK_Room PRIMARY KEY (RoomID),
    CONSTRAINT FK_Room_Cinema FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID)
);

-----------------------------------------------------
-- SCREEN (1–1 ROOM)
-----------------------------------------------------
CREATE TABLE Screen (
    ScreenID      INT           NOT NULL,
    RoomID        INT           NOT NULL,
    Type          NVARCHAR(50)  NOT NULL,
    Size          NVARCHAR(50)  NOT NULL,
    SupportFormat NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_Screen PRIMARY KEY (ScreenID),
    CONSTRAINT UQ_Screen_Room UNIQUE (RoomID),
    CONSTRAINT FK_Screen_Room FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

-----------------------------------------------------
-- SEAT (thực thể yếu)
-----------------------------------------------------
CREATE TABLE Seat (
    SeatNumber NVARCHAR(10) NOT NULL,
    RoomID     INT          NOT NULL,
    SeatType   NVARCHAR(30) NOT NULL,
    BasePrice  INT          NOT NULL,
    CONSTRAINT PK_Seat PRIMARY KEY (SeatNumber, RoomID),
    CONSTRAINT FK_Seat_Room FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

-----------------------------------------------------
-- CUSTOMER
-----------------------------------------------------
CREATE TABLE Customer (
    CustomerID      INT            NOT NULL,
    FullName        NVARCHAR(100)  NOT NULL,
    Email           NVARCHAR(255)  NOT NULL,
    PhoneNumber     NVARCHAR(15)   NOT NULL,
    DateOfBirth     DATE           NOT NULL,
    MembershipLevel NVARCHAR(20)   NOT NULL,
    RegistrationDate DATE          NOT NULL,
    TotalSpent      DECIMAL(18,2)  NOT NULL 
    CONSTRAINT DF_Customer_TotalSpent DEFAULT (0),
    TotalOrders     INT            NOT NULL 
    CONSTRAINT DF_Customer_TotalOrders DEFAULT (0),
    CONSTRAINT PK_Customer PRIMARY KEY (CustomerID),
    CONSTRAINT UQ_Customer_Email UNIQUE (Email),
    CONSTRAINT UQ_Customer_Phone UNIQUE (PhoneNumber)
);

-----------------------------------------------------
-- MOVIE
-----------------------------------------------------
CREATE TABLE Movie (
    MovieID        INT            NOT NULL,
    Title          NVARCHAR(200)  NOT NULL,
    AgeRating      NVARCHAR(10)   NOT NULL,
    ReleaseDate    DATE           NOT NULL,
    Duration       INT            NOT NULL,
    CustomerRating DECIMAL(3,1)   NULL,
    Genre          NVARCHAR(100)  NOT NULL,
    Language       NVARCHAR(50)   NOT NULL,
    Description    NVARCHAR(MAX)  NULL,
    Studio         NVARCHAR(100)  NOT NULL,
    Country        NVARCHAR(100)  NOT NULL,
    Director       NVARCHAR(100)  NOT NULL,
    CONSTRAINT PK_Movie PRIMARY KEY (MovieID),
    CONSTRAINT CK_Movie_CustomerRating
    CHECK (CustomerRating IS NULL OR (CustomerRating >= 0 AND CustomerRating <= 10))
);

-----------------------------------------------------
-- SHOWTIME
-----------------------------------------------------
CREATE TABLE Showtime (
    ShowtimeID INT   NOT NULL,
    RoomID     INT   NOT NULL,
    MovieID    INT   NOT NULL,
    CinemaID   INT   NOT NULL,
    StartTime  TIME  NOT NULL,
    EndTime    TIME  NOT NULL,
    Date       DATE  NOT NULL,
    CONSTRAINT PK_Showtime PRIMARY KEY (ShowtimeID),
    CONSTRAINT FK_Showtime_Movie FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    CONSTRAINT FK_Showtime_Room FOREIGN KEY (RoomID) REFERENCES Room(RoomID),
    CONSTRAINT FK_Showtime_Cinema FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID)
);

-----------------------------------------------------
-- EMPLOYEE (tự giám sát chính nó)
-----------------------------------------------------
CREATE TABLE Employee (
    EmployeeID  INT            NOT NULL,
    CinemaID    INT            NOT NULL,
    FullName    NVARCHAR(100)  NOT NULL,
    Email       NVARCHAR(255)  NOT NULL,
    Address     NVARCHAR(255)  NOT NULL,
    DateOfBirth DATE           NOT NULL,
    Sex         NVARCHAR(10)   NOT NULL,
    Salary      INT            NOT NULL,
    SupervisorID INT           NULL,
    CONSTRAINT PK_Employee PRIMARY KEY (EmployeeID),
    CONSTRAINT UQ_Employee_Email UNIQUE (Email),
    CONSTRAINT UQ_Employee_Address UNIQUE (Address),
    CONSTRAINT FK_Employee_Cinema FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID),
    CONSTRAINT FK_Employee_Supervisor FOREIGN KEY (SupervisorID) REFERENCES Employee(EmployeeID)
);

-----------------------------------------------------
-- VOUCHER
-----------------------------------------------------
CREATE TABLE Voucher (
    VoucherID        INT           NOT NULL,
    Code             NVARCHAR(50)  NOT NULL,
    Description      NVARCHAR(255) NULL,
    Type             NVARCHAR(20)  NOT NULL,
    Discount         INT           NULL,
    Amount           INT           NULL,
    IssueDate        DATE          NOT NULL,
    ExpirationDate   DATE          NOT NULL,
    MaxUsage         INT           NOT NULL,
    UsedCount        INT           NOT NULL,
    IsActive         BIT           NOT NULL,
    MinOrderValue    INT           NOT NULL,
    MaxDiscountValue INT           NOT NULL,
    IsStackable      BIT           NOT NULL,
    CONSTRAINT PK_Voucher PRIMARY KEY (VoucherID),
    CONSTRAINT UQ_Voucher_Code UNIQUE (Code),
    CONSTRAINT CK_Voucher_Type CHECK (Type IN (N'Percent', N'Fixed')),
    CONSTRAINT CK_Voucher_DiscountAmount
        CHECK (
            (Type = N'Percent' AND Discount IS NOT NULL AND Amount IS NULL)
            OR (Type = N'Fixed' AND Amount IS NOT NULL AND Discount IS NULL)
        )
);

-----------------------------------------------------
-- CUSTOMER–VOUCHER (M–N)
-----------------------------------------------------
CREATE TABLE CustomerVoucher (
    CustomerID   INT  NOT NULL,
    VoucherID    INT  NOT NULL,
    AssignedDate DATE NOT NULL,
    CONSTRAINT PK_CustomerVoucher PRIMARY KEY (CustomerID, VoucherID),
    CONSTRAINT FK_CustomerVoucher_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    CONSTRAINT FK_CustomerVoucher_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(VoucherID)
);

-----------------------------------------------------
-- FOOD AND DRINK
-----------------------------------------------------
CREATE TABLE FoodAndDrink (
    ItemID        INT           NOT NULL,
    Name          NVARCHAR(100) NOT NULL,
    Size          NVARCHAR(20)  NOT NULL,
    Price         INT           NOT NULL,
    IsAvailable   BIT           NOT NULL,
    StockQuantity INT           NOT NULL,
    CONSTRAINT PK_FoodAndDrink PRIMARY KEY (ItemID),
    CONSTRAINT CK_FoodAndDrink_Price CHECK (Price >= 0),
    CONSTRAINT CK_FoodAndDrink_Stock CHECK (StockQuantity >= 0)
);

-----------------------------------------------------
-- ORDERS
-----------------------------------------------------
CREATE TABLE Orders (
    OrderID      INT            NOT NULL,
    CustomerID   INT            NOT NULL,
    Date         DATE           NOT NULL,
    Time         TIME           NOT NULL,
    TotalPrice   DECIMAL(18,2)  NOT NULL,
    Status       NVARCHAR(50)   NOT NULL,
    PaymentMethod NVARCHAR(50)  NOT NULL,
    VoucherID    INT            NULL,
    CONSTRAINT PK_Orders PRIMARY KEY (OrderID),
    CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    CONSTRAINT FK_Orders_Voucher FOREIGN KEY (VoucherID) REFERENCES Voucher(VoucherID)
);

-----------------------------------------------------
-- ORDER FOOD DRINK (M–N)
-----------------------------------------------------
CREATE TABLE OrderFoodDrink (
    OrderID  INT NOT NULL,
    ItemID   INT NOT NULL,
    Quantity INT NOT NULL,
    CONSTRAINT PK_OrderFoodDrink PRIMARY KEY (OrderID, ItemID),
    CONSTRAINT FK_OrderFoodDrink_Order FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT FK_OrderFoodDrink_Item FOREIGN KEY (ItemID) REFERENCES FoodAndDrink(ItemID),
    CONSTRAINT CK_OrderFoodDrink_Quantity CHECK (Quantity > 0)
);

-----------------------------------------------------
-- MOVIE CUSTOMER RATING (M–N)
-----------------------------------------------------
CREATE TABLE MovieCustomerRating (
    MovieID     INT           NOT NULL,
    CustomerID  INT           NOT NULL,
    RatingDate  DATE          NOT NULL,
    Score       INT           NOT NULL,
    Comment     NVARCHAR(255) NULL,
    CONSTRAINT PK_MovieCustomerRating PRIMARY KEY (MovieID, CustomerID),
    CONSTRAINT FK_MovieCustomerRating_Movie FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    CONSTRAINT FK_MovieCustomerRating_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    CONSTRAINT CK_MovieCustomerRating_Score CHECK (Score BETWEEN 1 AND 10)
);

-----------------------------------------------------
-- TICKET
-----------------------------------------------------
CREATE TABLE Ticket (
    TicketID   INT          NOT NULL,
    OrderID    INT          NOT NULL,
    ShowtimeID INT          NOT NULL,
    SeatNumber NVARCHAR(10) NOT NULL,
    RoomID     INT          NOT NULL,
    Price      INT          NOT NULL,
    CONSTRAINT PK_Ticket PRIMARY KEY (TicketID),
    CONSTRAINT FK_Ticket_Order FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT FK_Ticket_Showtime FOREIGN KEY (ShowtimeID)  REFERENCES Showtime(ShowtimeID),
    CONSTRAINT FK_Ticket_Seat FOREIGN KEY (SeatNumber, RoomID) REFERENCES Seat(SeatNumber, RoomID)
);  
