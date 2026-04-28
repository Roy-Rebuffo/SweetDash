import { useState } from "react";
import palette from "../theme/palette";

const sections = [
  {
    title: "Información del negocio",
    icon: "M21 15.5A3.5 3.5 0 0117.5 19H6.5A3.5 3.5 0 013 15.5V14a2 2 0 012-2h14a2 2 0 012 2v1.5z M8 12V9a4 4 0 018 0v3 M12 6.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z",
    fields: [
      ["Nombre",    "La Pastelería de Flor"],
      ["Dirección", "Calle Mayor 12, Madrid"],
      ["Teléfono",  "+34 911 234 567"],
      ["Email",     "info@florbaker.es"],
    ],
  },
  {
    title: "Preferencias",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    fields: [
      ["Moneda",        "EUR (€)"],
      ["Zona horaria",  "Europe/Madrid"],
      ["Idioma",        "Español"],
      ["Formato fecha", "DD/MM/YYYY"],
    ],
  },
];

function ConfigCard({ section, isMobile }) {
  const pad = isMobile ? "16px" : "24px";
  return (
    <div
      style={{
        background: palette.bgCard, borderRadius: 14,
        border: `1px solid ${palette.border}`,
        boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
        padding: pad, minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: palette.primaryLt,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={palette.primary} strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d={section.icon} />
          </svg>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: palette.textDark }}>
          {section.title}
        </div>
      </div>

      {section.fields.map(([label, value]) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.bg, fontSize: 13, color: palette.textDark }}>
            {value}
          </div>
        </div>
      ))}

      <button
        style={{
          width: "100%", padding: "8px", borderRadius: 8,
          border: `1px solid ${palette.primary}`, background: "transparent",
          color: palette.primary, fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = palette.primaryLt)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Editar
      </button>
    </div>
  );
}

function BackupCard({ isMobile }) {
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupDone,    setBackupDone]    = useState(false);

  const handleBackup = () => {
    setBackupLoading(true);
    setBackupDone(false);
    setTimeout(() => { setBackupLoading(false); setBackupDone(true); }, 2000);
  };

  const pad = isMobile ? "16px" : "24px";

  return (
    <div
      style={{
        background: palette.bgCard, borderRadius: 14,
        border: `1px solid ${palette.border}`,
        boxShadow: "0 1px 4px oklch(0% 0 0 / 0.04)",
        padding: pad, gridColumn: "1 / -1", minWidth: 0,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        {/* Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, borderRadius: 12,
              background: palette.accent3Lt,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <svg width={isMobile ? 17 : 20} height={isMobile ? 17 : 20} fill="none" viewBox="0 0 24 24" stroke={palette.accent3} strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: palette.textDark, marginBottom: 3 }}>
              Copia de seguridad
            </div>
            <div style={{ fontSize: 12, color: palette.textLight }}>
              {backupDone
                ? `Última copia: hoy a las ${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
                : "Última copia: 25 abr 2026 a las 03:00"}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: isMobile ? "wrap" : "nowrap", width: isMobile ? "100%" : "auto" }}>
          {backupDone && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: palette.accent3, fontWeight: 600, width: isMobile ? "100%" : "auto" }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={palette.accent3} strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copia generada
            </div>
          )}
          <button
            onClick={handleBackup}
            disabled={backupLoading}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: isMobile ? "8px 14px" : "9px 20px",
              borderRadius: 10, fontSize: isMobile ? 12 : 13, fontWeight: 600,
              border: "none",
              background: backupLoading ? palette.border : palette.accent3,
              color: backupLoading ? palette.textLight : "#fff",
              cursor: backupLoading ? "default" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              flex: isMobile ? 1 : undefined,
              transition: "all 0.2s",
            }}
          >
            {backupLoading ? (
              <>
                <span style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${palette.textLight}`, borderTopColor: "transparent", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Generando...
              </>
            ) : (
              <>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Hacer copia ahora
              </>
            )}
          </button>
          <button
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: isMobile ? "8px 14px" : "9px 16px",
              borderRadius: 10, fontSize: isMobile ? 12 : 13, fontWeight: 600,
              border: `1px solid ${palette.border}`, background: palette.bg,
              color: palette.textMid, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              flex: isMobile ? 1 : undefined,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = palette.primaryMid)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = palette.border)}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver historial
          </button>
        </div>
      </div>

      {/* Info row */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: isMobile ? 8 : 12, marginTop: isMobile ? 14 : 18 }}>
        {[
          { label: "Frecuencia automática", value: "Diaria — 03:00 h" },
          { label: "Retención",             value: "30 copias"        },
          { label: "Almacenamiento usado",  value: "124 MB / 500 MB"  },
        ].map((item, i) => (
          <div
            key={item.label}
            style={{ padding: isMobile ? "8px 10px" : "10px 14px", borderRadius: 9, background: palette.bg, border: `1px solid ${palette.border}`, gridColumn: isMobile && i === 2 ? "1 / -1" : undefined }}
          >
            <div style={{ fontSize: isMobile ? 9 : 10, fontWeight: 700, color: palette.textLight, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: palette.textDark }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminView({ isMobile = false }) {
  return (
    <div style={{ maxWidth: "100%", animation: "fadeUp 0.3s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 12 : 20 }}>
        {sections.map((s) => (
          <ConfigCard key={s.title} section={s} isMobile={isMobile} />
        ))}
        <BackupCard isMobile={isMobile} />
      </div>
    </div>
  );
}
