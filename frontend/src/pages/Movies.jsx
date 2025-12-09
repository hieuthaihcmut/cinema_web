import React, { useEffect, useState } from "react";

const API_BASE_URL = "/movies"; // dùng proxy Vite

const emptyForm = {
    MovieID: "",
    Title: "",
    AgeRating: "",
    ReleaseDate: "",
    Duration: "",
    CustomerRating: "",
    Genre: "",
    Language: "",
    Description: "",
    Studio: "",
    Country: "",
    Director: "",
};

const theme = {
    primary: "#1e88e5",
    primaryStrong: "#1565c0",
    surface: "#ffffff",
    surfaceAlt: "#e8f2ff",
    border: "#c6d9f5",
    text: "#0f172a",
    muted: "#556581",
    danger: "#e53935",
    success: "#2e7d32",
    shadow: "0 14px 35px rgba(30, 136, 229, 0.12)",
};

const styles = {
    page: { maxWidth: "1200px", margin: "0 auto", padding: "20px", color: theme.text },
    hero: {
        background: "linear-gradient(135deg, #eef5ff 0%, #dce9ff 100%)",
        border: `1px solid ${theme.border}`,
        borderRadius: "14px",
        padding: "18px 20px",
        boxShadow: theme.shadow,
        marginBottom: "18px",
    },
    heroTitle: { margin: 0, fontSize: "24px", fontWeight: 700, color: theme.primaryStrong },
    heroSub: { margin: "8px 0 0", color: theme.muted },
    badge: {
        padding: "6px 10px",
        background: "#eef6ff",
        color: theme.primaryStrong,
        borderRadius: "10px",
        border: `1px solid ${theme.border}`,
        fontWeight: 600,
    },
    banner: (type) => ({
        marginBottom: "10px",
        padding: "10px 12px",
        borderRadius: "10px",
        border: `1px solid ${type === "error" ? theme.danger : theme.success}33`,
        color: type === "error" ? theme.danger : theme.success,
        background: type === "error" ? "#fff5f5" : "#f1fbf2",
    }),
    panel: {
        border: `1px solid ${theme.border}`,
        borderRadius: "12px",
        padding: "14px",
        background: theme.surface,
        boxShadow: theme.shadow,
        marginBottom: "16px",
    },
    sectionTitle: { margin: "0 0 10px", fontSize: "18px", color: theme.primaryStrong },
    label: { display: "block", fontWeight: 600, marginBottom: "6px", color: theme.muted },
    input: {
        width: "100%",
        padding: "12px 12px",
        borderRadius: "10px",
        border: `1px solid ${theme.border}`,
        background: theme.surfaceAlt,
        color: theme.text,
        boxSizing: "border-box",
    },
    textarea: {
        width: "100%",
        padding: "12px 12px",
        borderRadius: "10px",
        border: `1px solid ${theme.border}`,
        background: theme.surfaceAlt,
        color: theme.text,
        boxSizing: "border-box",
        minHeight: "80px",
    },
    button: {
        background: theme.primary,
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "10px 14px",
        cursor: "pointer",
        fontWeight: 600,
        boxShadow: theme.shadow,
    },
    buttonGhost: {
        background: "transparent",
        color: theme.primaryStrong,
        border: `1px solid ${theme.primaryStrong}`,
        borderRadius: "10px",
        padding: "10px 14px",
        cursor: "pointer",
        fontWeight: 600,
    },
    tableWrap: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        borderBottom: `2px solid ${theme.border}`,
        padding: "10px 8px",
        textAlign: "left",
        color: theme.muted,
        background: "#f0f5ff",
    },
    td: {
        borderBottom: `1px solid ${theme.border}`,
        padding: "10px 8px",
        color: theme.text,
        background: "#fff",
    },
    actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
};

export default function MovieManagement() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            setApiError("");
            const res = await fetch(API_BASE_URL);
            if (!res.ok) throw new Error("Không thể tải danh sách phim");
            const data = await res.json();
            setMovies(data);
        } catch (err) {
            setApiError(err.message || "Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};

        const idNum = parseInt(form.MovieID, 10);
        if (!isEditing) {
            if (!form.MovieID) {
                errors.MovieID = "MovieID là bắt buộc";
            } else if (Number.isNaN(idNum) || idNum <= 0) {
                errors.MovieID = "MovieID phải là số dương";
            }
        }

        if (!form.Title || !form.Title.trim()) {
            errors.Title = "Tiêu đề là bắt buộc";
        } else if (form.Title.trim().length < 2) {
            errors.Title = "Tiêu đề tối thiểu 2 ký tự";
        }

        if (!form.AgeRating || !form.AgeRating.trim()) {
            errors.AgeRating = "AgeRating là bắt buộc";
        } else if (form.AgeRating.trim().length > 10) {
            errors.AgeRating = "AgeRating tối đa 10 ký tự";
        }

        if (!form.ReleaseDate) {
            errors.ReleaseDate = "ReleaseDate là bắt buộc";
        } else if (Number.isNaN(Date.parse(form.ReleaseDate))) {
            errors.ReleaseDate = "ReleaseDate không hợp lệ";
        }

        const duration = parseInt(form.Duration, 10);
        if (Number.isNaN(duration) || duration <= 0) {
            errors.Duration = "Duration phải là số nguyên dương";
        }

        if (form.CustomerRating !== "" && form.CustomerRating !== null) {
            const rating = Number(form.CustomerRating);
            if (Number.isNaN(rating) || rating < 0 || rating > 10) {
                errors.CustomerRating = "CustomerRating phải từ 0 đến 10";
            }
        }

        if (!form.Genre || !form.Genre.trim()) errors.Genre = "Genre là bắt buộc";
        if (!form.Language || !form.Language.trim()) errors.Language = "Language là bắt buộc";
        if (!form.Studio || !form.Studio.trim()) errors.Studio = "Studio là bắt buộc";
        if (!form.Country || !form.Country.trim()) errors.Country = "Country là bắt buộc";
        if (!form.Director || !form.Director.trim()) errors.Director = "Director là bắt buộc";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setForm(emptyForm);
        setFormErrors({});
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        setSuccessMessage("");

        if (!validateForm()) return;

        const payload = {
            MovieID: Number(form.MovieID),
            Title: form.Title.trim(),
            AgeRating: form.AgeRating.trim(),
            ReleaseDate: form.ReleaseDate,
            Duration: Number(form.Duration),
            CustomerRating:
                form.CustomerRating === "" || form.CustomerRating === null
                    ? null
                    : Number(form.CustomerRating),
            Genre: form.Genre.trim(),
            Language: form.Language.trim(),
            Description: form.Description?.trim() || null,
            Studio: form.Studio.trim(),
            Country: form.Country.trim(),
            Director: form.Director.trim(),
        };

        const url = isEditing ? `${API_BASE_URL}/${form.MovieID}` : API_BASE_URL;
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const contentType = res.headers.get("content-type") || "";
            const data = contentType.includes("application/json") ? await res.json().catch(() => ({})) : {};

            if (!res.ok) throw new Error(data?.message || "Lỗi khi lưu phim");

            await fetchMovies();
            resetForm();
            setSuccessMessage(data?.message || (isEditing ? "Cập nhật phim thành công" : "Thêm phim thành công"));
        } catch (err) {
            setSuccessMessage("");
            setApiError(err.message || "Lỗi khi gọi API");
        }
    };

    const handleEdit = (movie) => {
        setForm({
            MovieID: movie.MovieID,
            Title: movie.Title,
            AgeRating: movie.AgeRating,
            ReleaseDate: movie.ReleaseDate?.slice(0, 10) || "",
            Duration: movie.Duration,
            CustomerRating: movie.CustomerRating ?? "",
            Genre: movie.Genre,
            Language: movie.Language,
            Description: movie.Description || "",
            Studio: movie.Studio,
            Country: movie.Country,
            Director: movie.Director,
        });
        setFormErrors({});
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa phim này?")) return;
        setApiError("");
        setSuccessMessage("");
        try {
            const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
            const contentType = res.headers.get("content-type") || "";
            const data = contentType.includes("application/json") ? await res.json().catch(() => ({})) : {};
            if (!res.ok) throw new Error(data?.message || "Không thể xóa phim");
            await fetchMovies();
            setSuccessMessage(data?.message || "Xóa phim thành công");
            if (isEditing && String(id) === String(form.MovieID)) resetForm();
        } catch (err) {
            setSuccessMessage("");
            setApiError(err.message || "Lỗi khi gọi API");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                        <h2 style={styles.heroTitle}>Quản lý phim</h2>
                        <p style={styles.heroSub}>Thêm, sửa, xóa phim kèm kiểm tra điều kiện đầu vào.</p>
                    </div>
                    <div style={styles.badge}>Tổng phim: {movies.length}</div>
                </div>
            </div>

            {apiError && !successMessage && <div style={styles.banner("error")}>{apiError}</div>}
            {successMessage && <div style={styles.banner("success")}>{successMessage}</div>}

            <div style={styles.panel}>
                <h3 style={styles.sectionTitle}>{isEditing ? "Cập nhật phim" : "Thêm phim mới"}</h3>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "12px",
                    }}
                >
                    {!isEditing && (
                        <div>
                            <label style={styles.label}>Movie ID</label>
                            <input
                                name="MovieID"
                                type="number"
                                value={form.MovieID}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.MovieID && <small style={{ color: theme.danger }}>{formErrors.MovieID}</small>}
                        </div>
                    )}

                    <div>
                        <label style={styles.label}>Title</label>
                        <input
                            name="Title"
                            value={form.Title}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.Title && <small style={{ color: theme.danger }}>{formErrors.Title}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Age Rating</label>
                        <input
                            name="AgeRating"
                            value={form.AgeRating}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.AgeRating && <small style={{ color: theme.danger }}>{formErrors.AgeRating}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Release Date</label>
                        <input
                            name="ReleaseDate"
                            type="date"
                            value={form.ReleaseDate}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.ReleaseDate && <small style={{ color: theme.danger }}>{formErrors.ReleaseDate}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Duration (phút)</label>
                        <input
                            name="Duration"
                            type="number"
                            value={form.Duration}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.Duration && <small style={{ color: theme.danger }}>{formErrors.Duration}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Customer Rating (0-10)</label>
                        <input
                            name="CustomerRating"
                            type="number"
                            step="0.1"
                            value={form.CustomerRating}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.CustomerRating && <small style={{ color: theme.danger }}>{formErrors.CustomerRating}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Genre</label>
                        <input
                            name="Genre"
                            value={form.Genre}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.Genre && <small style={{ color: theme.danger }}>{formErrors.Genre}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Language</label>
                        <input
                            name="Language"
                            value={form.Language}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.Language && <small style={{ color: theme.danger }}>{formErrors.Language}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Studio</label>
                        <input
                            name="Studio"
                            value={form.Studio}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.Studio && <small style={{ color: theme.danger }}>{formErrors.Studio}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Country</label>
                        <input
                            name="Country"
                            value={form.Country}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.Country && <small style={{ color: theme.danger }}>{formErrors.Country}</small>}
                    </div>

                    <div>
                        <label style={styles.label}>Director</label>
                        <input
                            name="Director"
                            value={form.Director}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                        {formErrors.Director && <small style={{ color: theme.danger }}>{formErrors.Director}</small>}
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            name="Description"
                            value={form.Description}
                            onChange={handleInputChange}
                            style={styles.textarea}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexWrap: "wrap" }}>
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm phim"}
                        </button>
                        <button type="button" style={styles.buttonGhost} onClick={resetForm}>
                            Làm mới
                        </button>
                    </div>
                </form>
            </div>

            <div style={styles.tableWrap}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>MovieID</th>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>AgeRating</th>
                            <th style={styles.th}>ReleaseDate</th>
                            <th style={styles.th}>Duration</th>
                            <th style={styles.th}>Rating</th>
                            <th style={styles.th}>Genre</th>
                            <th style={styles.th}>Language</th>
                            <th style={styles.th}>Studio</th>
                            <th style={styles.th}>Country</th>
                            <th style={styles.th}>Director</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.length === 0 && !loading && (
                            <tr>
                                <td colSpan="13" style={{ ...styles.td, textAlign: "center" }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}

                        {movies.map((m) => (
                            <tr key={m.MovieID}>
                                <td style={styles.td}>{m.MovieID}</td>
                                <td style={styles.td}>{m.Title}</td>
                                <td style={styles.td}>{m.AgeRating}</td>
                                <td style={styles.td}>{m.ReleaseDate?.slice(0, 10)}</td>
                                <td style={styles.td}>{m.Duration}</td>
                                <td style={styles.td}>{m.CustomerRating ?? ""}</td>
                                <td style={styles.td}>{m.Genre}</td>
                                <td style={styles.td}>{m.Language}</td>
                                <td style={styles.td}>{m.Studio}</td>
                                <td style={styles.td}>{m.Country}</td>
                                <td style={styles.td}>{m.Director}</td>
                                <td style={styles.td}>{m.Description ? `${m.Description.slice(0, 40)}${m.Description.length > 40 ? "..." : ""}` : ""}</td>
                                <td style={{ ...styles.td }}>
                                    <div style={styles.actions}>
                                        <button style={{ ...styles.buttonGhost, borderColor: theme.primary, color: theme.primaryStrong }} onClick={() => handleEdit(m)}>
                                            Sửa
                                        </button>
                                        <button style={{ ...styles.buttonGhost, borderColor: theme.danger, color: theme.danger }} onClick={() => handleDelete(m.MovieID)}>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
