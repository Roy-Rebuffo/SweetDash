import ConfigCard from "./components/ConfigCard";
import BackupCard from "./components/BackupCard";
import { sections } from "./adminUtils";

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
