import { useState } from "react";
import palette from "../theme/palette";

export default function TopBar({ title, sub, isMobile = false, onMenuToggle }) {
  const [hovBell, setHovBell] = useState(false);

  return (
    <div
      style={{
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: isMobile ? 16 : 32,
        paddingRight: isMobile ? 16 : 32,
        background: palette.bgCard,
        borderBottom: `1px solid ${palette.border}`,
        flexShrink: 0,
      }}
    >
      {/* Left — hamburger en mobile, título en desktop */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
        {isMobile && (
          <button
            onClick={onMenuToggle}
            style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              border: `1px solid ${palette.border}`, background: "transparent",
              cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 16, height: 1.5,
                  background: palette.textMid,
                  borderRadius: 2, display: "block",
                }}
              />
            ))}
          </button>
        )}
        {!isMobile && (
          <div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700, fontSize: 19,
                color: palette.textDark, lineHeight: 1,
              }}
            >
              {title}
            </span>
            {sub && (
              <span style={{ fontSize: 11.5, color: palette.textLight, marginLeft: 10 }}>
                {sub}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        {/* Bell */}
        <button
          onMouseEnter={() => setHovBell(true)}
          onMouseLeave={() => setHovBell(false)}
          style={{
            position: "relative", width: 34, height: 34, borderRadius: 9,
            border: `1px solid ${hovBell ? palette.primary : palette.border}`,
            background: hovBell ? palette.primaryLt : "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: hovBell ? palette.primary : palette.textMid,
            transition: "all 0.15s",
          }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span
            style={{
              position: "absolute", top: 7, right: 7,
              width: 6, height: 6, borderRadius: "50%",
              background: palette.primary,
              border: `1.5px solid ${palette.bgCard}`,
            }}
          />
        </button>

        <div style={{ width: 1, height: 22, background: palette.border }} />

        {/* User chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isMobile && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: palette.textDark, lineHeight: 1.2 }}>
                Flor Baker
              </div>
              <div style={{ fontSize: 9.5, color: palette.textLight, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                Head Pastry Chef
              </div>
            </div>
          )}
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: palette.primaryLt,
              border: `1.5px solid ${palette.primaryMid}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: palette.primary, fontWeight: 700, fontSize: 11,
            }}
          >
            FB
          </div>
        </div>
      </div>
    </div>
  );
}
