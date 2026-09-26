import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Go Rob Lacy — Growth Systems For Car Dealerships";

export default async function Image() {
  const logo = await readFile(path.join(process.cwd(), "public", "brand", "logo-lockup.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#020814",
          backgroundImage:
            "radial-gradient(circle at 80% 25%, rgba(214,162,50,0.28), transparent 50%), radial-gradient(circle at 15% 90%, rgba(47,127,224,0.3), transparent 55%)",
        }}
      >
        <img src={logoSrc} alt="" width={450} height={60} style={{ marginBottom: 40 }} />
        <div
          style={{
            fontSize: 60,
            fontWeight: 600,
            color: "#f5f2ea",
            lineHeight: 1.12,
            maxWidth: 1000,
          }}
        >
          {site.headline}
        </div>
        <div style={{ fontSize: 26, color: "#a2adc0", marginTop: 28, maxWidth: 900 }}>
          {site.mission}
        </div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#d6a232",
            marginTop: 36,
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
