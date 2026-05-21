import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Logo / brand asset generator.
 *
 * Query params:
 *   variant = "icon" | "square" | "banner"   (default "square")
 *   size    = number (px, applied to width — height scales for banner)
 *   bg      = "navy" | "transparent"         (default "navy")
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const variant = (searchParams.get("variant") ?? "square") as "icon" | "square" | "banner";
  const size = Math.min(2048, Math.max(128, Number(searchParams.get("size") ?? 1024)));
  const bg = (searchParams.get("bg") ?? "navy") as "navy" | "transparent";

  // Dimensions per variant
  const dims =
    variant === "banner"
      ? { width: size * 2, height: size }
      : variant === "icon"
        ? { width: size, height: size }
        : { width: size, height: size };

  const background =
    bg === "transparent"
      ? "transparent"
      : "linear-gradient(135deg, #0A0E27 0%, #141C3F 50%, #1E2954 100%)";

  const monogramSize = variant === "icon" ? size * 0.6 : variant === "banner" ? size * 0.5 : size * 0.32;
  const monogramRadius = monogramSize * 0.22;
  const cFontSize = monogramSize * 0.62;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: variant === "banner" ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: variant === "banner" ? "48px" : "32px",
          background,
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "white",
        }}
      >
        {/* Ambient glow behind monogram */}
        {bg === "navy" && (
          <div
            style={{
              position: "absolute",
              width: `${monogramSize * 1.8}px`,
              height: `${monogramSize * 1.8}px`,
              borderRadius: `${monogramSize * 1.8}px`,
              background: "radial-gradient(circle, rgba(245,183,0,0.35) 0%, rgba(245,183,0,0) 70%)",
              left: variant === "banner" ? `${size * 0.15}px` : "50%",
              top: variant === "banner" ? "50%" : variant === "icon" ? "50%" : "38%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Monogram "C" — gold gradient tile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${monogramSize}px`,
            height: `${monogramSize}px`,
            borderRadius: `${monogramRadius}px`,
            background: "linear-gradient(135deg, #FFD54F 0%, #F5B700 55%, #D49F00 100%)",
            boxShadow: "0 20px 60px rgba(245,183,0,0.45), inset 0 -8px 24px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: `${cFontSize}px`,
              fontWeight: 900,
              color: "#0A0E27",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              marginTop: `${-cFontSize * 0.04}px`,
            }}
          >
            C
          </div>
        </div>

        {/* Wordmark — only for square + banner */}
        {variant !== "icon" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: variant === "banner" ? "flex-start" : "center",
              gap: `${size * 0.012}px`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: `${size * (variant === "banner" ? 0.16 : 0.14)}px`,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              CodeNative
            </div>
            <div
              style={{
                fontSize: `${size * 0.032}px`,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              learn in your tongue
            </div>
          </div>
        )}
      </div>
    ),
    dims
  );
}
