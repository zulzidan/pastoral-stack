import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1D4333",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
          padding: 5,
        }}
      >
        {/* Stacked server bars — top 3 in white */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: 3,
              background: "rgba(255,255,255,0.92)",
              borderRadius: 1,
            }}
          />
        ))}
        {/* Earth stripe in rust */}
        <div
          style={{
            width: "100%",
            height: 3,
            background: "#7A4C2E",
            borderRadius: 1,
            marginTop: 1,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
