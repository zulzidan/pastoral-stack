import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1D4333",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 10,
          padding: 28,
        }}
      >
        {/* Server rack bars */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: 14,
              background: "rgba(255,255,255,0.90)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 8,
              gap: 4,
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D4333" }} />
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D4333" }} />
          </div>
        ))}
        {/* Divider gap */}
        <div style={{ height: 6 }} />
        {/* Earth stripes */}
        <div
          style={{
            width: "100%",
            height: 10,
            background: "#4A7B62",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: "88%",
            height: 10,
            background: "#7A4C2E",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: "68%",
            height: 10,
            background: "#9B6040",
            borderRadius: 4,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
