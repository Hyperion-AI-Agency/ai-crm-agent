import React from "react";

const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <img src="/assets/logo.png" alt="App" style={{ height: "40px", width: "auto" }} />
    <span
      style={{
        fontFamily: "THICCCBOI, sans-serif",
        fontWeight: 600,
        fontSize: "20px",
        color: "var(--theme-text, #0b1f3a)",
      }}
    >
      App
    </span>
  </div>
);

export default Logo;
