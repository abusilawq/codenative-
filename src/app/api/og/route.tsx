import { ImageResponse } from "next/og";
import { getLanguage, type LanguageCode } from "@/lib/i18n/languages";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("t") ?? "Learn to code in your language").slice(0, 120);
  const analogy = (searchParams.get("a") ?? "Story Mode").slice(0, 60);
  const lang = (searchParams.get("l") ?? "uz") as LanguageCode;
  const takeaway = (searchParams.get("k") ?? "").slice(0, 200);
  const language = getLanguage(lang);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0A0E27 0%, #141C3F 50%, #1E2954 100%)",
          padding: "60px 80px",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "white",
          position: "relative",
        }}
      >
        {/* Gold ambient orb */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "500px",
            background: "radial-gradient(circle, rgba(245,183,0,0.35) 0%, rgba(245,183,0,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "600px",
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 70%)",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 10 }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #F5B700 0%, #FFD54F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 800,
              color: "#0A0E27",
              boxShadow: "0 8px 32px rgba(245,183,0,0.4)",
            }}
          >
            C
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.02em" }}>CodeNative</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              learn in your tongue
            </div>
          </div>
        </div>

        {/* Analogy badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "60px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(245,183,0,0.15)",
              border: "1px solid rgba(245,183,0,0.3)",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "20px",
              color: "#FFD54F",
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: "26px" }}>{language.flag}</span>
            <span>{analogy}</span>
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.4)",
              padding: "8px 14px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "999px",
            }}
          >
            {language.nativeName}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "56px" : "72px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            marginTop: "30px",
            background: "linear-gradient(135deg, #FFD54F 0%, #F5B700 50%, #D49F00 100%)",
            backgroundClip: "text",
            color: "transparent",
            zIndex: 10,
            maxWidth: "90%",
          }}
        >
          {title}
        </div>

        {/* Takeaway */}
        {takeaway && (
          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.8)",
              marginTop: "24px",
              fontStyle: "italic",
              borderLeft: "4px solid #F5B700",
              paddingLeft: "20px",
              zIndex: 10,
              maxWidth: "85%",
            }}
          >
            {takeaway}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.6)", fontSize: "20px" }}>
            <span>✨ Powered by Claude</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.4)", fontSize: "18px" }}>
            codenative-rosy.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
