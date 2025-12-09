const express = require("express");
const { sql, poolPromise } = require("../db");

const router = express.Router();
router.use(express.json());

// POST /api/tickets
router.post("/", async (req, res) => {
    const {
        cinemaId,
        showtimeId,
        roomId,
        startDate,
        endDate,
    } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();

        request.input("CinemaID", sql.Int, cinemaId);
        request.input("ShowtimeID", sql.Int, showtimeId);
        request.input("RoomID", sql.Int, roomId);
        request.input("StartDate", sql.Date, startDate);
        request.input("EndDate", sql.Date, endDate);

        const result = await request.execute("usp_GetRoomTicketsAndDetails");

        // Nếu không RAISERROR thì dữ liệu nằm ở recordset
        const data = result.recordset || [];

        return res.status(200).json({
            success: true,
            message:
                data.length > 0
                    ? `Lấy ${data.length} vé thành công.`
                    : "Không có dữ liệu phù hợp.",
            data,
        });
    } catch (err) {
        console.error("POST /api/tickets error:", err);

        const dbMsg =
            err?.originalError?.info?.message ||
            err?.message ||
            "Lỗi khi lấy báo cáo vé theo phòng.";

        return res.status(400).json({
            success: false,
            message: dbMsg,
        });
    }
});

// GET /api/tickets (simple notice)
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Dùng POST /api/tickets với cinemaId/showtimeId/roomId/startDate/endDate để lấy vé.",
    });
});

module.exports = router;
