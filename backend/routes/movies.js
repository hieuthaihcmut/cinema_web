const express = require("express");
const { sql, poolPromise } = require("../db");

const router = express.Router();
router.use(express.json());

const validateMoviePayload = (body, isUpdate = false) => {
    const errors = {};

    const id = isUpdate ? parseInt(body.MovieID || body.id, 10) : parseInt(body.MovieID, 10);
    if (!isUpdate) {
        if (!id || id <= 0 || Number.isNaN(id)) {
            errors.MovieID = "MovieID phải là số dương";
        }
    }

    if (!body.Title || !body.Title.trim()) {
        errors.Title = "Tiêu đề là bắt buộc";
    } else if (body.Title.trim().length < 2) {
        errors.Title = "Tiêu đề tối thiểu 2 ký tự";
    }

    if (!body.AgeRating || !body.AgeRating.trim()) {
        errors.AgeRating = "AgeRating là bắt buộc";
    } else if (body.AgeRating.trim().length > 10) {
        errors.AgeRating = "AgeRating tối đa 10 ký tự";
    }

    if (!body.ReleaseDate) {
        errors.ReleaseDate = "ReleaseDate là bắt buộc";
    } else if (Number.isNaN(Date.parse(body.ReleaseDate))) {
        errors.ReleaseDate = "ReleaseDate không hợp lệ";
    }

    const duration = parseInt(body.Duration, 10);
    if (Number.isNaN(duration) || duration <= 0) {
        errors.Duration = "Duration phải là số nguyên dương";
    }

    let customerRating = null;
    if (body.CustomerRating !== undefined && body.CustomerRating !== null && body.CustomerRating !== "") {
        customerRating = Number(body.CustomerRating);
        if (Number.isNaN(customerRating) || customerRating < 0 || customerRating > 10) {
            errors.CustomerRating = "CustomerRating phải từ 0 đến 10";
        }
    }

    if (!body.Genre || !body.Genre.trim()) {
        errors.Genre = "Genre là bắt buộc";
    }
    if (!body.Language || !body.Language.trim()) {
        errors.Language = "Language là bắt buộc";
    }
    if (!body.Studio || !body.Studio.trim()) {
        errors.Studio = "Studio là bắt buộc";
    }
    if (!body.Country || !body.Country.trim()) {
        errors.Country = "Country là bắt buộc";
    }
    if (!body.Director || !body.Director.trim()) {
        errors.Director = "Director là bắt buộc";
    }

    return { errors, parsed: { id, duration, customerRating } };
};

router.get("/", async (_req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT *
            FROM Movie
            ORDER BY MovieID
        `);
        return res.json(result.recordset);
    } catch (err) {
        console.error("GET /api/movies error:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy danh sách phim" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Movie WHERE MovieID = @id");

        if (!result.recordset.length) {
            return res.status(404).json({ message: "Phim không tồn tại" });
        }

        return res.json(result.recordset[0]);
    } catch (err) {
        console.error("GET /api/movies/:id error:", err);
        return res.status(500).json({ message: "Lỗi server khi lấy chi tiết phim" });
    }
});

router.post("/", async (req, res) => {
    const { errors, parsed } = validateMoviePayload(req.body, false);
    if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors });
    }

    const {
        MovieID,
        Title,
        AgeRating,
        ReleaseDate,
        Duration,
        CustomerRating,
        Genre,
        Language,
        Description = null,
        Studio,
        Country,
        Director,
    } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();
        request.input("MovieID", sql.Int, parsed.id);
        request.input("Title", sql.NVarChar(200), Title.trim());
        request.input("AgeRating", sql.NVarChar(10), AgeRating.trim());
        request.input("ReleaseDate", sql.Date, ReleaseDate);
        request.input("Duration", sql.Int, parsed.duration);
        request.input("CustomerRating", sql.Decimal(3, 1), parsed.customerRating);
        request.input("Genre", sql.NVarChar(100), Genre.trim());
        request.input("Language", sql.NVarChar(50), Language.trim());
        request.input("Description", sql.NVarChar(sql.MAX), Description?.trim() || null);
        request.input("Studio", sql.NVarChar(100), Studio.trim());
        request.input("Country", sql.NVarChar(100), Country.trim());
        request.input("Director", sql.NVarChar(100), Director.trim());

        const result = await request.query(`
            INSERT INTO Movie (MovieID, Title, AgeRating, ReleaseDate, Duration, CustomerRating, Genre, Language, Description, Studio, Country, Director)
            VALUES (@MovieID, @Title, @AgeRating, @ReleaseDate, @Duration, @CustomerRating, @Genre, @Language, @Description, @Studio, @Country, @Director)
        `);

        return res.status(201).json({ success: true, message: "Thêm phim thành công" });
    } catch (err) {
        console.error("POST /api/movies error:", err);
        const dbMsg = err?.originalError?.info?.message || err?.message || "Lỗi server khi thêm phim";
        return res.status(400).json({ success: false, message: dbMsg });
    }
});

router.put("/:id", async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const { errors, parsed } = validateMoviePayload({ ...req.body, MovieID: movieId }, true);
    if (Object.keys(errors).length) {
        return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ", errors });
    }

    const {
        Title,
        AgeRating,
        ReleaseDate,
        Duration,
        CustomerRating,
        Genre,
        Language,
        Description = null,
        Studio,
        Country,
        Director,
    } = req.body;

    try {
        const pool = await poolPromise;
        const request = pool.request();
        request.input("MovieID", sql.Int, movieId);
        request.input("Title", sql.NVarChar(200), Title.trim());
        request.input("AgeRating", sql.NVarChar(10), AgeRating.trim());
        request.input("ReleaseDate", sql.Date, ReleaseDate);
        request.input("Duration", sql.Int, parsed.duration);
        request.input("CustomerRating", sql.Decimal(3, 1), parsed.customerRating);
        request.input("Genre", sql.NVarChar(100), Genre.trim());
        request.input("Language", sql.NVarChar(50), Language.trim());
        request.input("Description", sql.NVarChar(sql.MAX), Description?.trim() || null);
        request.input("Studio", sql.NVarChar(100), Studio.trim());
        request.input("Country", sql.NVarChar(100), Country.trim());
        request.input("Director", sql.NVarChar(100), Director.trim());

        const result = await request.query(`
            UPDATE Movie
            SET Title=@Title,
                AgeRating=@AgeRating,
                ReleaseDate=@ReleaseDate,
                Duration=@Duration,
                CustomerRating=@CustomerRating,
                Genre=@Genre,
                Language=@Language,
                Description=@Description,
                Studio=@Studio,
                Country=@Country,
                Director=@Director
            WHERE MovieID=@MovieID
        `);

        if (!result.rowsAffected[0]) {
            return res.status(404).json({ success: false, message: "Phim không tồn tại" });
        }

        return res.json({ success: true, message: "Cập nhật phim thành công" });
    } catch (err) {
        console.error("PUT /api/movies/:id error:", err);
        const dbMsg = err?.originalError?.info?.message || err?.message || "Lỗi server khi cập nhật phim";
        return res.status(400).json({ success: false, message: dbMsg });
    }
});

router.delete("/:id", async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    try {
        const pool = await poolPromise;
        const request = pool.request();
        request.input("MovieID", sql.Int, movieId);

        const result = await request.query("DELETE FROM Movie WHERE MovieID=@MovieID");

        if (!result.rowsAffected[0]) {
            return res.status(404).json({ success: false, message: "Phim không tồn tại" });
        }

        return res.json({ success: true, message: "Xóa phim thành công" });
    } catch (err) {
        console.error("DELETE /api/movies/:id error:", err);
        const dbMsg = err?.originalError?.info?.message || err?.message || "Lỗi server khi xóa phim";
        return res.status(400).json({ success: false, message: dbMsg });
    }
});

module.exports = router;
