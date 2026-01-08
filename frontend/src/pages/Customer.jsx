import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "/customers";

const emptyForm = {
    CustomerID: "",
    FullName: "",
    Email: "",
    PhoneNumber: "",
    DateOfBirth: "",
    MembershipLevel: "Bronze",
    RegistrationDate: "",
    TotalSpent: 0,
    TotalOrders: 0,
};

const membershipOptions = ["Bronze", "Silver", "Gold", "Platinum"];

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
    page: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        color: theme.text,
    },
    hero: {
        background: "linear-gradient(135deg, #eef5ff 0%, #dce9ff 100%)",
        border: `1px solid ${theme.border}`,
        borderRadius: "14px",
        padding: "18px 20px",
        boxShadow: theme.shadow,
        marginBottom: "18px",
    },
    heroTitle: {
        margin: 0,
        fontSize: "24px",
        fontWeight: 700,
        color: theme.primaryStrong,
    },
    heroSub: {
        margin: "8px 0 0",
        color: theme.muted,
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
    sectionTitle: {
        margin: "0 0 10px",
        fontSize: "18px",
        color: theme.primaryStrong,
    },
    label: {
        display: "block",
        fontWeight: 600,
        marginBottom: "6px",
        color: theme.muted,
    },
    input: {
        width: "100%",
        padding: "12px 12px",
        borderRadius: "10px",
        border: `1px solid ${theme.border}`,
        background: theme.surfaceAlt,
        color: theme.text,
        outline: "none",
        boxSizing: "border-box",
    },
    select: {
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
    chip: (level) => ({
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "999px",
        background: level === "Platinum" ? "#e3f2fd" : level === "Gold" ? "#fff9e6" : level === "Silver" ? "#f3f6fb" : "#eef6ff",
        color: theme.primaryStrong,
        fontWeight: 600,
        fontSize: "12px",
        border: `1px solid ${theme.border}`,
    }),
    badge: {
        padding: "6px 10px",
        background: "#eef6ff",
        color: theme.primaryStrong,
        borderRadius: "10px",
        border: `1px solid ${theme.border}`,
        fontWeight: 600,
    },
};

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // search / filter / sort / paging
    const [searchTerm, setSearchTerm] = useState("");
    const [membershipFilter, setMembershipFilter] = useState("all");
    const [sortField, setSortField] = useState("FullName");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // --------------------------------------------------
    // 1. Load dữ liệu
    // --------------------------------------------------
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setApiError("");
            const res = await fetch(API_BASE_URL);
            if (!res.ok) {
                throw new Error("Không thể tải danh sách khách hàng");
            }
            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            setApiError(err.message || "Lỗi khi gọi API");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // --------------------------------------------------
    // 2. Xử lý input form
    // --------------------------------------------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --------------------------------------------------
    // 3. Validate dữ liệu nhập
    // --------------------------------------------------
    const validateForm = () => {
        const errors = {};

        // CustomerID
        if (!form.CustomerID) {
            errors.CustomerID = "Mã khách hàng là bắt buộc";
        } else if (isNaN(Number(form.CustomerID)) || Number(form.CustomerID) <= 0) {
            errors.CustomerID = "Mã khách hàng phải là số dương";
        }

        // FullName
        if (!form.FullName || form.FullName.trim() === "") {
            errors.FullName = "Họ tên là bắt buộc";
        } else if (form.FullName.trim().length < 3) {
            errors.FullName = "Họ tên phải có ít nhất 3 ký tự";
        }

        // Email
        if (!form.Email || form.Email.trim() === "") {
            errors.Email = "Email là bắt buộc";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.Email.trim())) {
                errors.Email = "Email không đúng định dạng";
            }
        }

        // PhoneNumber: bắt đầu bằng 0, đúng 10 số
        if (!form.PhoneNumber || form.PhoneNumber.trim() === "") {
            errors.PhoneNumber = "Số điện thoại là bắt buộc";
        } else {
            const phone = form.PhoneNumber.trim();
            if (!phone.startsWith("0")) {
                errors.PhoneNumber = "Số điện thoại phải bắt đầu bằng số 0";
            } else if (phone.length !== 10) {
                errors.PhoneNumber = "Số điện thoại phải có đúng 10 chữ số";
            } else if (!/^[0-9]+$/.test(phone)) {
                errors.PhoneNumber = "Số điện thoại chỉ được chứa chữ số";
            }
        }

        // DateOfBirth
        if (!form.DateOfBirth) {
            errors.DateOfBirth = "Ngày sinh là bắt buộc";
        } else {
            const dob = new Date(form.DateOfBirth);
            const today = new Date();
            if (dob >= today) {
                errors.DateOfBirth = "Ngày sinh không được lớn hơn hoặc bằng hôm nay";
            } else {
                const age = today.getFullYear() - dob.getFullYear();
                if (age < 5) {
                    errors.DateOfBirth = "Khách hàng phải ít nhất 5 tuổi";
                }
            }
        }

        // MembershipLevel
        if (!membershipOptions.includes(form.MembershipLevel)) {
            errors.MembershipLevel = "Loại thành viên không hợp lệ";
        }

        // TotalSpent
        if (form.TotalSpent === "" || form.TotalSpent === null) {
            errors.TotalSpent = "Tổng chi tiêu là bắt buộc";
        } else if (isNaN(Number(form.TotalSpent)) || Number(form.TotalSpent) < 0) {
            errors.TotalSpent = "Tổng chi tiêu không được âm";
        }

        // TotalOrders
        if (form.TotalOrders === "" || form.TotalOrders === null) {
            errors.TotalOrders = "Tổng số đơn hàng là bắt buộc";
        } else if (!Number.isInteger(Number(form.TotalOrders)) || Number(form.TotalOrders) < 0) {
            errors.TotalOrders = "Tổng số đơn hàng phải là số nguyên không âm";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // --------------------------------------------------
    // 4. Submit form (Create / Update)
    // --------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        setSuccessMessage("");

        if (!validateForm()) return;

        // 👇 tạo payload khác nhau cho thêm mới và cập nhật
        let payload;
        let url;
        let method;

        if (isEditing) {
            // UPDATE -> dùng DateOfBirthStr, RegistrationDateStr
            url = `${API_BASE_URL}/${form.CustomerID}`;
            method = "PUT";
            payload = {
                FullName: form.FullName.trim(),
                Email: form.Email.trim(),
                PhoneNumber: form.PhoneNumber.trim(),
                DateOfBirthStr: form.DateOfBirth,          // yyyy-MM-dd
                MembershipLevel: form.MembershipLevel,
                RegistrationDateStr: form.RegistrationDate, // yyyy-MM-dd
                TotalSpent: Number(form.TotalSpent),
                TotalOrders: Number(form.TotalOrders),
            };
        } else {
            // INSERT -> dùng DateOfBirth, RegistrationDate + CustomerID
            url = API_BASE_URL;
            method = "POST";
            payload = {
                CustomerID: Number(form.CustomerID),
                FullName: form.FullName.trim(),
                Email: form.Email.trim(),
                PhoneNumber: form.PhoneNumber.trim(),
                DateOfBirth: form.DateOfBirth,           // yyyy-MM-dd
                MembershipLevel: form.MembershipLevel,
                RegistrationDate: form.RegistrationDate, // yyyy-MM-dd
                TotalSpent: Number(form.TotalSpent),
                TotalOrders: Number(form.TotalOrders),
            };
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const contentType = res.headers.get("content-type") || "";
            const data = contentType.includes("application/json")
                ? await res.json().catch(() => ({}))
                : {};

            if (!res.ok) {
                throw new Error(data.error || "Lỗi khi lưu khách hàng");
            }

            // Thành công: reload data từ SQL + reset form + hiển thị message từ server
            await fetchCustomers();
            resetForm();
            setApiError("");
            setSuccessMessage(data?.message || (isEditing ? "Cập nhật khách hàng thành công"
                : "Thêm khách hàng thành công"));
        } catch (err) {
            setSuccessMessage("");
            setApiError(err.message || "Lỗi khi gọi API");
        }
    };


    const resetForm = () => {
        setForm(emptyForm);
        setFormErrors({});
        setIsEditing(false);
    };

    const handleEditClick = (customer) => {
        setForm({
            CustomerID: customer.CustomerID,
            FullName: customer.FullName,
            Email: customer.Email,
            PhoneNumber: customer.PhoneNumber,
            DateOfBirth: customer.DateOfBirth?.slice(0, 10) || "",
            MembershipLevel: customer.MembershipLevel,
            RegistrationDate: customer.RegistrationDate?.slice(0, 10) || "",
            TotalSpent: customer.TotalSpent,
            TotalOrders: customer.TotalOrders,
        });
        setFormErrors({});
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDeleteClick = async (customer) => {
        if (!window.confirm(`Bạn có chắc muốn xóa khách hàng: ${customer.FullName}?`)) return;

        try {
            setApiError("");
            setSuccessMessage("");
            const res = await fetch(`${API_BASE_URL}/${customer.CustomerID}`, {
                method: "DELETE",
            });

            const contentType = res.headers.get("content-type") || "";
            const payload = contentType.includes("application/json")
                ? await res.json().catch(() => null)
                : null;

            if (!res.ok) {
                const msg = payload?.error || payload?.message || "Không thể xóa khách hàng";
                throw new Error(msg);
            }

            // Hiển thị thông báo từ server (nếu có), không dùng alert frontend
            setSuccessMessage(payload?.message || "Xóa khách hàng thành công");
            await fetchCustomers();
        } catch (err) {
            setApiError(err.message || "Lỗi khi gọi API");
        }
    };

    // --------------------------------------------------
    // 5. Search + Filter + Sort + Pagination
    // --------------------------------------------------
    const processedCustomers = useMemo(() => {
        let list = [...customers];

        // search theo tên / email / phone
        if (searchTerm.trim() !== "") {
            const q = searchTerm.trim().toLowerCase();
            list = list.filter(
                (c) =>
                    c.FullName.toLowerCase().includes(q) ||
                    c.Email.toLowerCase().includes(q) ||
                    c.PhoneNumber.toLowerCase().includes(q)
            );
        }

        // filter theo MembershipLevel
        if (membershipFilter !== "all") {
            list = list.filter((c) => c.MembershipLevel === membershipFilter);
        }

        // sort
        list.sort((a, b) => {
            let va = a[sortField];
            let vb = b[sortField];

            if (typeof va === "string") va = va.toLowerCase();
            if (typeof vb === "string") vb = vb.toLowerCase();

            if (va < vb) return sortDirection === "asc" ? -1 : 1;
            if (va > vb) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return list;
    }, [customers, searchTerm, membershipFilter, sortField, sortDirection]);

    const totalPages = Math.ceil(processedCustomers.length / pageSize) || 1;

    const pagedCustomers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return processedCustomers.slice(start, start + pageSize);
    }, [processedCustomers, currentPage]);

    const handleSortChange = (field) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortIcon = (field) => {
        if (sortField !== field) return "↕";
        return sortDirection === "asc" ? "↑" : "↓";
    };

    // --------------------------------------------------
    // 6. Render UI
    // --------------------------------------------------
    return (
        <div style={styles.page}>
            <div style={styles.hero}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                        <h2 style={styles.heroTitle}>Quản lý khách hàng</h2>
                        <p style={styles.heroSub}>Quản lý hồ sơ, theo dõi chi tiêu và hạng thành viên trong một nơi.</p>
                    </div>
                    <div style={styles.badge}>Tổng khách: {customers.length}</div>
                </div>
            </div>

            {/* Thông báo lỗi API */}
            {apiError && !successMessage && <div style={styles.banner("error")}>Lỗi: {apiError}</div>}
            {successMessage && <div style={styles.banner("success")}>{successMessage}</div>}

            {/* Form thêm / sửa */}
            <div style={styles.panel}>
                <h3 style={styles.sectionTitle}>{isEditing ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}</h3>
                <form onSubmit={handleSubmit}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                            gap: "12px",
                            alignItems: "start",
                        }}
                    >
                        <div style={{ flex: "1 1 200px" }}>
                            <label style={styles.label}>Mã khách hàng</label>
                            <input
                                type="number"
                                name="CustomerID"
                                value={form.CustomerID}
                                onChange={handleInputChange}
                                disabled={isEditing}
                                style={styles.input}
                            />
                            {formErrors.CustomerID && (
                                <div style={{ color: "red" }}>{formErrors.CustomerID}</div>
                            )}
                        </div>

                        <div style={{ flex: "2 1 300px" }}>
                            <label style={styles.label}>Họ tên</label>
                            <input
                                type="text"
                                name="FullName"
                                value={form.FullName}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.FullName && (
                                <div style={{ color: "red" }}>{formErrors.FullName}</div>
                            )}
                        </div>

                        <div style={{ flex: "2 1 300px" }}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                name="Email"
                                value={form.Email}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.Email && (
                                <div style={{ color: "red" }}>{formErrors.Email}</div>
                            )}
                        </div>

                        <div style={{ flex: "1 1 200px" }}>
                            <label style={styles.label}>Số điện thoại</label>
                            <input
                                type="text"
                                name="PhoneNumber"
                                value={form.PhoneNumber}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.PhoneNumber && (
                                <div style={{ color: "red" }}>{formErrors.PhoneNumber}</div>
                            )}
                        </div>

                        <div style={{ flex: "1 1 200px" }}>
                            <label style={styles.label}>Ngày sinh</label>
                            <input
                                type="date"
                                name="DateOfBirth"
                                value={form.DateOfBirth}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.DateOfBirth && (
                                <div style={{ color: "red" }}>{formErrors.DateOfBirth}</div>
                            )}
                        </div>

                        <div style={{ flex: "1 1 200px" }}>
                            <label style={styles.label}>Loại thành viên</label>
                            <select
                                name="MembershipLevel"
                                value={form.MembershipLevel}
                                onChange={handleInputChange}
                                style={styles.select}
                            >
                                {membershipOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            {formErrors.MembershipLevel && (
                                <div style={{ color: "red" }}>{formErrors.MembershipLevel}</div>
                            )}
                        </div>

                        <div style={{ flex: "1 1 200px" }}>
                            <label style={styles.label}>Ngày đăng ký</label>
                            <input
                                type="date"
                                name="RegistrationDate"
                                value={form.RegistrationDate}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.RegistrationDate && (
                                <div style={{ color: "red" }}>
                                    {formErrors.RegistrationDate}
                                </div>
                            )}
                        </div>

                        <div style={{ flex: "1 1 200px" }}>
                            <label style={styles.label}>Tổng chi tiêu (VND)</label>
                            <input
                                type="number"
                                name="TotalSpent"
                                value={form.TotalSpent}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.TotalSpent && (
                                <div style={{ color: "red" }}>{formErrors.TotalSpent}</div>
                            )}
                        </div>

                        <div style={{ flex: "1 1 200px" }}>
                            <label style={styles.label}>Tổng số đơn hàng</label>
                            <input
                                type="number"
                                name="TotalOrders"
                                value={form.TotalOrders}
                                onChange={handleInputChange}
                                style={styles.input}
                            />
                            {formErrors.TotalOrders && (
                                <div style={{ color: "red" }}>{formErrors.TotalOrders}</div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: "12px" }}>
                        <button type="submit" disabled={loading} style={styles.button}>
                            {isEditing ? "Cập nhật" : "Thêm mới"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{ ...styles.buttonGhost, marginLeft: "8px" }}
                            >
                                Hủy chỉnh sửa
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Thanh tìm kiếm + filter */}
            <div
                style={{
                    marginBottom: "12px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <input
                    type="text"
                    placeholder="Tìm theo tên / email / sđt..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ ...styles.input, flex: "2 1 300px" }}
                />
                <select
                    value={membershipFilter}
                    onChange={(e) => {
                        setMembershipFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    style={{ ...styles.select, flex: "1 1 150px" }}
                >
                    <option value="all">Tất cả hạng</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                </select>
                <button
                    type="button"
                    onClick={fetchCustomers}
                    disabled={loading}
                    style={{ ...styles.buttonGhost, borderColor: theme.primary, color: theme.primaryStrong }}
                >
                    Làm mới danh sách
                </button>
            </div>

            {/* Bảng danh sách */}
            <div style={{ ...styles.tableWrap, marginBottom: "12px" }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSortChange("CustomerID")}>
                                ID {sortIcon("CustomerID")}
                            </th>
                            <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSortChange("FullName")}>
                                Họ tên {sortIcon("FullName")}
                            </th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>SĐT</th>
                            <th style={styles.th}>Ngày sinh</th>
                            <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSortChange("MembershipLevel")}>
                                Hạng {sortIcon("MembershipLevel")}
                            </th>
                            <th style={styles.th}>Ngày đăng ký</th>
                            <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSortChange("TotalSpent")}>
                                Tổng chi tiêu {sortIcon("TotalSpent")}
                            </th>
                            <th style={{ ...styles.th, cursor: "pointer" }} onClick={() => handleSortChange("TotalOrders")}>
                                Tổng đơn {sortIcon("TotalOrders")}
                            </th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} style={{ ...styles.td, textAlign: "center" }}>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : pagedCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{ ...styles.td, textAlign: "center" }}>
                                    Không có khách hàng nào
                                </td>
                            </tr>
                        ) : (
                            pagedCustomers.map((c) => (
                                <tr key={c.CustomerID}>
                                    <td style={styles.td}>{c.CustomerID}</td>
                                    <td style={styles.td}>{c.FullName}</td>
                                    <td style={styles.td}>{c.Email}</td>
                                    <td style={styles.td}>{c.PhoneNumber}</td>
                                    <td style={styles.td}>{c.DateOfBirth?.slice(0, 10)}</td>
                                    <td style={styles.td}>
                                        <span style={styles.chip(c.MembershipLevel)}>{c.MembershipLevel}</span>
                                    </td>
                                    <td style={styles.td}>{c.RegistrationDate?.slice(0, 10)}</td>
                                    <td style={styles.td}>{c.TotalSpent}</td>
                                    <td style={styles.td}>{c.TotalOrders}</td>
                                    <td style={styles.td}>
                                        <button onClick={() => handleEditClick(c)} style={styles.button}>Sửa</button>
                                        <button
                                            style={{ ...styles.buttonGhost, marginLeft: "6px", borderColor: theme.danger, color: theme.danger }}
                                            onClick={() => handleDeleteClick(c)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    alignItems: "center",
                }}
            >
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ ...styles.buttonGhost, opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                    {"<"}
                </button>
                <span>
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    style={{ ...styles.buttonGhost, opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                    {">"}
                </button>
            </div>
        </div>
    );
}