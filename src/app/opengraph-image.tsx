import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Joshua Nee, Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/assets/profile_photo.png"));
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 80px",
          background: "linear-gradient(135deg, #141414 55%, #3a0a0d 100%)",
          color: "#ffffff",
        }}
      >
        <img
          src={photoSrc}
          alt=""
          width={360}
          height={360}
          style={{ borderRadius: 9999, border: "6px solid #E50914", objectFit: "cover" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2, color: "#E50914" }}>
            JOSHUA NEE
          </div>
          <div style={{ fontSize: 44, fontWeight: 600 }}>Software Engineer</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 30, color: "#B3B3B3" }}>
            <div>MS Software Engineering · Carnegie Mellon</div>
            <div>DoorDash · Shopee · 8x Hackathon Winner</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
