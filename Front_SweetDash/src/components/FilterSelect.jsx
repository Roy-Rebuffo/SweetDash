import { useState, useRef, useEffect } from "react";
import palette from "../theme/palette";

export default function FilterSelect({ value, onChange, options, minWidth = 130 }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          height: 38, paddingLeft: 14, paddingRight: 38,
          borderRadius: 10, minWidth,
          border: `1.5px solid ${open ? palette.primary : palette.border}`,
          background: palette.bgCard,
          boxShadow: open
            ? `0 0 0 3px ${palette.primaryLt}`
            : "0 1px 3px oklch(0% 0 0 / 0.06)",
          fontSize: 13, fontWeight: 500, color: palette.textDark,
          cursor: "pointer", textAlign: "left", whiteSpace: "nowrap",
          display: "flex", alignItems: "center",
          fontFamily: "'DM Sans', sans-serif",
          transition: "border-color 0.15s, box-shadow 0.15s",
          outline: "none",
        }}
      >
        {value}
      </button>

      {/* Chevron */}
      <svg
        width="12" height="12" fill="none" viewBox="0 0 24 24"
        stroke={palette.textMid} strokeWidth={2.2}
        style={{
          position: "absolute", right: 12, top: "50%",
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          pointerEvents: "none", transition: "transform 0.2s",
        }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
            background: palette.bgCard,
            border: `1.5px solid ${palette.border}`,
            borderRadius: 12,
            boxShadow: "0 8px 24px oklch(0% 0 0 / 0.10)",
            padding: 4, minWidth: "100%",
          }}
        >
          {options.map((opt) => {
            const isActive = opt === value;
            return (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  padding: "8px 12px", borderRadius: 8,
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? palette.primary : palette.textDark,
                  background: isActive ? palette.primaryLt : "transparent",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.12s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = palette.bg; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
