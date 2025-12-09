import React, { useState } from "react";

// Dùng proxy Vite
const API_TOP_MOVIES = "http://localhost:3000/score";

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
    tableWrap: { overflowX: "auto", marginTop: "12px" },
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
};

function TopMoviesReportPage() {
    const [minRatingsCount, setMinRatingsCount] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        setApiError("");
        setSuccessMessage("");
        setMovies([]);
        setLoading(true);

        try {
            const res = await fetch(API_TOP_MOVIES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    minRatingsCount:
                        minRatingsCount === "" ? null : Number(minRatingsCount),
                }),
            });

            const contentType = res.headers.get("content-type") || "";
            let payload = null;
            if (contentType.includes("application/json")) {
                try {
                    payload = await res.json();
                } catch {
                    payload = null;
                }
            }

            if (!res.ok) {
                const msg =
                    payload?.message ||
                    payload?.error ||
                    `Không thể tải dữ liệu (mã lỗi ${res.status})`;
                throw new Error(msg);
            }

            const data = Array.isArray(payload?.data) ? payload.data : [];
            setMovies(data);
            setSuccessMessage(
                payload?.message ||
                (data.length > 0
                    ? `Tìm thấy ${data.length} phim`
                    : "Không có dữ liệu.")
            );
        } catch (err) {
            console.error("fetch top movies report error:", err);
            setApiError(err.message || "Lỗi khi gọi API báo cáo.");
        } finally {
            setLoading(false);
        }
    };

    // ====== Export CSV / Excel ======
    const buildCsvContent = () => {
        if (!movies || movies.length === 0) return "";

        const header = [
            "Movie ID",
            "Movie Title",
            "Duration (Mins)",
            "Total Ratings",
            "Average Score",
        ];

        const rows = movies.map((m) => [
            m["Movie ID"] ?? m.MovieID,
            m["Movie Title"] ?? m.Title,
            m["Duration (Mins)"] ?? m.Duration,
            m["Total Ratings"] ?? m.TotalRatings,
            m["Average Score"] ?? m.AverageScore,
        ]);

        const escapeCell = (cell) => {
            if (cell === null || cell === undefined) return "";
            const str = String(cell);
            if (str.includes('"') || str.includes(",") || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const lines = [
            header.map(escapeCell).join(","),
            ...rows.map((row) => row.map(escapeCell).join(",")),
        ];

        return lines.join("\r\n");
    };

    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportCsv = () => {
        const csv = buildCsvContent();
        if (!csv) {
            setApiError("Không có dữ liệu để export.");
            return;
        }
        const withBom = "\ufeff" + csv;
        downloadFile(withBom, "top-movies-report.csv", "text/csv;charset=utf-8;");
    };

    const handleExportExcel = () => {
        const csv = buildCsvContent();
        if (!csv) {
            setApiError("Không có dữ liệu để export.");
            return;
        }
        // Xuất CSV kèm BOM và dùng đuôi .csv để Excel mở trực tiếp
        const withBom = "\ufeff" + csv;
        downloadFile(withBom, "top-movies-report-excel.csv", "text/csv;charset=utf-8;");
    };

    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                        <h2 style={styles.heroTitle}>Báo cáo phim điểm cao</h2>
                        <p style={styles.heroSub}>Lọc phim theo số lượt đánh giá tối thiểu và xuất báo cáo.</p>
                    </div>
                    <div style={styles.badge}>Tổng phim: {movies.length}</div>
                </div>
            </div>

            {apiError && !successMessage && <div style={styles.banner("error")}>{apiError}</div>}
            {successMessage && <div style={styles.banner("success")}>{successMessage}</div>}

            <div style={styles.panel}>
                <h3 style={styles.sectionTitle}>Bộ lọc</h3>
                <form onSubmit={handleSearch}
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}
                >
                    <div>
                        <label style={styles.label}>Min Ratings Count (số lượt đánh giá tối thiểu)</label>
                        <input
                            type="number"
                            value={minRatingsCount}
                            onChange={(e) => setMinRatingsCount(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", flexWrap: "wrap" }}>
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? "Đang tải..." : "Xem báo cáo"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMinRatingsCount("");
                                setMovies([]);
                                setApiError("");
                                setSuccessMessage("");
                            }}
                            style={styles.buttonGhost}
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                <button
                    style={{ ...styles.buttonGhost, borderColor: theme.primary, color: theme.primaryStrong }}
                    onClick={handleExportCsv}
                    disabled={movies.length === 0}
                >
                    Export CSV
                </button>
                <button
                    style={{ ...styles.buttonGhost, borderColor: theme.success, color: theme.success }}
                    onClick={handleExportExcel}
                    disabled={movies.length === 0}
                >
                    Export Excel
                </button>
            </div>

            <div style={styles.tableWrap}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Movie ID</th>
                            <th style={styles.th}>Movie Title</th>
                            <th style={styles.th}>Duration (Mins)</th>
                            <th style={styles.th}>Total Ratings</th>
                            <th style={styles.th}>Average Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" style={{ ...styles.td, textAlign: "center" }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}

                        {movies.map((m, idx) => (
                            <tr key={idx}>
                                <td style={styles.td}>{m["Movie ID"] ?? m.MovieID}</td>
                                <td style={styles.td}>{m["Movie Title"] ?? m.MovieTitle ?? m.Title}</td>
                                <td style={styles.td}>{m["Duration (Mins)"] ?? m.Duration}</td>
                                <td style={styles.td}>{m["Total Ratings"] ?? m.TotalRatings}</td>
                                <td style={styles.td}>{m["Average Score"] ?? m.AverageScore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TopMoviesReportPage;
