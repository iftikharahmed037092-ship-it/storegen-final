"use client";

import type {
  DeviceType
} from "@/types/page";

interface Props {
  device: DeviceType;
  onChange: (
    device: DeviceType
  ) => void;
}

export default function DeviceSwitcher({
  device,
  onChange
}: Props) {
  const devices: {
    id: DeviceType;
    label: string;
  }[] = [
    {
      id: "desktop",
      label: "Desktop"
    },
    {
      id: "tablet",
      label: "Tablet"
    },
    {
      id: "mobile",
      label: "Mobile"
    }
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: 6,
        background: "#f3f4f6",
        borderRadius: 10
      }}
    >
      {devices.map(item => (
        <button
          key={item.id}
          type="button"
          onClick={() =>
            onChange(item.id)
          }
          style={{
            border: 0,
            borderRadius: 8,
            padding:
              "8px 12px",
            background:
              device === item.id
                ? "#111827"
                : "transparent",
            color:
              device === item.id
                ? "#ffffff"
                : "#374151",
            fontWeight: 600
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
