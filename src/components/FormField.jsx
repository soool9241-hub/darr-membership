const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: 600,
  color: "#3A4A3E", marginBottom: "6px",
};

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: "10px",
  border: "1.5px solid #E8E5DC", fontSize: "14px", color: "#1B1B18",
  background: "#FAFAF7", outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

const errorStyle = {
  fontSize: "12px", color: "#D32F2F", marginTop: "4px",
};

export default function FormField({ label, type = "text", value, onChange, error, required, placeholder, options }) {
  const id = label.replace(/\s/g, "-");

  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor={id} style={labelStyle}>
        {label} {required && <span style={{ color: "#D32F2F" }}>*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
          onFocus={(e) => e.target.style.borderColor = "#2D6A4F"}
          onBlur={(e) => e.target.style.borderColor = "#E8E5DC"}
        />
      ) : type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">{placeholder || "선택해주세요"}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            style={{ marginTop: "3px", accentColor: "#2D6A4F" }}
          />
          <span style={{ fontSize: "13px", color: "#5A6A5E", lineHeight: 1.5 }}>{placeholder}</span>
        </label>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = "#2D6A4F"}
          onBlur={(e) => e.target.style.borderColor = "#E8E5DC"}
        />
      )}

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}
