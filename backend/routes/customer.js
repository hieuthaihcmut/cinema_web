const express = require("express");
// const sql = require("mssql");
const { sql, poolPromise } = require('../db');
const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT *
            FROM Customer
            ORDER BY CustomerID
        `);
        return res.json(result.recordset);
    } catch (err) {
        console.error("GET /api/customers error:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy danh sách khách hàng" });
    }
});


// GET customer detail by ID
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Customer WHERE CustomerID = @id");

        if (!result.recordset[0]) {
            return res.status(404).json({ message: "Khách hàng không tồn tại" });
        }

        return res.json(result.recordset[0]);
    } catch (err) {
        console.error("GET /api/customers/:id error:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy chi tiết khách hàng" });
    }
});

router.post("/", async (req, res) => {
    const {
        CustomerID,
        FullName,
        Email,
        PhoneNumber,
        DateOfBirth,      // 'yyyy-MM-dd'
        MembershipLevel,
        RegistrationDate, // 'yyyy-MM-dd'
        TotalSpent,
        TotalOrders,
    } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input("CustomerID", sql.Int, CustomerID);
        request.input("FullName", sql.NVarChar(100), FullName);
        request.input("Email", sql.NVarChar(255), Email);
        request.input("PhoneNumber", sql.NVarChar(15), PhoneNumber);
        request.input("DateOfBirth", sql.Date, DateOfBirth);
        request.input("MembershipLevel", sql.NVarChar(20), MembershipLevel);
        request.input("RegistrationDate", sql.Date, RegistrationDate || null);
        request.input("TotalSpent", sql.Decimal(18, 2), TotalSpent || 0);
        request.input("TotalOrders", sql.Int, TotalOrders || 0);
        request.output("ErrorMessage", sql.NVarChar(200));

        const result = await request.execute("INSERT_Customer");

        const errorMessage = result.output.ErrorMessage;
        if (errorMessage) {
            // Lỗi validate / logic từ stored procedure
            return res.status(400).json({
                success: false,
                message: errorMessage,
                error: errorMessage,
            });
        }

        return res.status(201).json({
            success: true,
            message: "Thêm khách hàng thành công",
        });
    } catch (err) {
        // Nếu bên trong INSERT_Customer có RAISERROR thì sẽ nhảy vào đây
        console.error("POST /api/customers error:", err);
        const dbMsg =
            err?.originalError?.info?.message ||
            err?.message ||
            "Lỗi server khi thêm khách hàng";

        return res.status(400).json({
            success: false,
            message: dbMsg,
            error: dbMsg,
        });
    }
});
// PUT: cập nhật khách hàng - gọi UPDATE_Customer
router.put("/:id", async (req, res) => {
    const customerId = parseInt(req.params.id, 10);
    const {
        FullName,
        Email,
        PhoneNumber,
        DateOfBirthStr,      // chuỗi 'yyyy-MM-dd'
        MembershipLevel,
        RegistrationDateStr, // chuỗi 'yyyy-MM-dd'
        TotalSpent,
        TotalOrders,
    } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input("CustomerID", sql.Int, customerId);
        request.input("FullName", sql.NVarChar(100), FullName);
        request.input("Email", sql.NVarChar(255), Email);
        request.input("PhoneNumber", sql.NVarChar(15), PhoneNumber);
        request.input("DateOfBirthStr", sql.NVarChar(20), DateOfBirthStr);
        request.input("MembershipLevel", sql.NVarChar(20), MembershipLevel);
        request.input("RegistrationDateStr", sql.NVarChar(20), RegistrationDateStr || null);
        request.input("TotalSpent", sql.Decimal(18, 2), TotalSpent);
        request.input("TotalOrders", sql.Int, TotalOrders);
        request.output("ErrorMessage", sql.NVarChar(200));

        const result = await request.execute("UPDATE_Customer");

        const errorMessage = result.output.ErrorMessage;
        if (errorMessage) {
            return res.status(400).json({
                success: false,
                message: errorMessage,
                error: errorMessage,
            });
        }

        return res.json({
            success: true,
            message: "Cập nhật khách hàng thành công",
        });
    } catch (err) {
        console.error("PUT /api/customers/:id error:", err);
        const dbMsg =
            err?.originalError?.info?.message ||
            err?.message ||
            "Lỗi server khi cập nhật khách hàng";

        return res.status(400).json({
            success: false,
            message: dbMsg,
            error: dbMsg,
        });
    }
});

// DELETE: xóa khách hàng - gọi DELETE_Customer
router.delete("/:id", async (req, res) => {
    const customerId = parseInt(req.params.id, 10);

    try {
        const pool = await poolPromise;   // <-- KHÔNG DÙNG config

        const request = pool.request();
        request.input("CustomerID", sql.Int, customerId);
        request.output("ErrorMessage", sql.NVarChar(200));

        const result = await request.execute("DELETE_Customer");

        // Khi không có RAISERROR, proc sẽ gán ErrorMessage = 'Xóa khách hàng thành công'
        const msg = result.output.ErrorMessage || "Xóa khách hàng thành công";

        return res.status(200).json({
            success: true,
            message: msg,
        });

    } catch (err) {
        const dbMsg =
            err?.originalError?.info?.message ||
            err?.message ||
            "Lỗi xóa khách hàng";

        return res.status(400).json({
            success: false,
            message: dbMsg,
        });
    }
});

module.exports = router;
