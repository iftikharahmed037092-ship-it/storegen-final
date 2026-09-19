"use client";

import type {
  BlockStyle
} from "@/types/page";

interface Props {
  style: BlockStyle;

  onChange: (
    style: BlockStyle
  ) => void;
}

export default function StyleSettings({
  style,
  onChange
}: Props) {
  function update(
    key: keyof BlockStyle,
    value: string | number
  ) {
    onChange({
      ...style,
      [key]: value
    });
  }

  return (
    <div>
      <h3>Section Style</h3>

      <label style={labelStyle}>
        Background Color

        <input
          type="color"
          value={
            style.backgroundColor ??
            "#ffffff"
          }
          onChange={e =>
            update(
              "backgroundColor",
              e.target.value
            )
          }
          style={colorInputStyle}
        />
      </label>

      <label style={labelStyle}>
        Text Color

        <input
          type="color"
          value={
            style.textColor ??
            "#111827"
          }
          onChange={e =>
            update(
              "textColor",
              e.target.value
            )
          }
          style={colorInputStyle}
        />
      </label>

      <label style={labelStyle}>
        Text Alignment

        <select
          value={
            style.textAlign ??
            "center"
          }
          onChange={e =>
            update(
              "textAlign",
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="left">
            Left
          </option>

          <option value="center">
            Center
          </option>

          <option value="right">
            Right
          </option>
        </select>
      </label>

      <div style={sectionTitle}>
        Padding
      </div>

      <NumberField
        label="Top"
        value={
          style.paddingTop ?? 40
        }
        onChange={value =>
          update(
            "paddingTop",
            value
          )
        }
      />

      <NumberField
        label="Right"
        value={
          style.paddingRight ?? 20
        }
        onChange={value =>
          update(
            "paddingRight",
            value
          )
        }
      />

      <NumberField
        label="Bottom"
        value={
          style.paddingBottom ?? 40
        }
        onChange={value =>
          update(
            "paddingBottom",
            value
          )
        }
      />

      <NumberField
        label="Left"
        value={
          style.paddingLeft ?? 20
        }
        onChange={value =>
          update(
            "paddingLeft",
            value
          )
        }
      />

      <div style={sectionTitle}>
        Spacing
      </div>

      <NumberField
        label="Margin Top"
        value={
          style.marginTop ?? 0
        }
        onChange={value =>
          update(
            "marginTop",
            value
          )
        }
      />

      <NumberField
        label="Margin Bottom"
        value={
          style.marginBottom ?? 0
        }
        onChange={value =>
          update(
            "marginBottom",
            value
          )
        }
      />

      <NumberField
        label="Container Width"
        value={
          style.maxWidth ?? 1200
        }
        onChange={value =>
          update(
            "maxWidth",
            value
          )
        }
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (
    value: number
  ) => void;
}) {
  return (
    <label style={labelStyle}>
      {label}

      <input
        type="number"
        min="0"
        value={value}
        onChange={e =>
          onChange(
            Number(
              e.target.value
            )
          )
        }
        style={inputStyle}
      />
    </label>
  );
}

const labelStyle:
  React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12
  };

const inputStyle:
  React.CSSProperties = {
    display: "block",
    width: "100%",
    marginTop: 5,
    padding: "9px 10px",
    border:
      "1px solid #d1d5db",
    borderRadius: 8,
    background: "#ffffff"
  };

const colorInputStyle:
  React.CSSProperties = {
    display: "block",
    width: "100%",
    height: 40,
    marginTop: 5,
    padding: 3,
    border:
      "1px solid #d1d5db",
    borderRadius: 8,
    background: "#ffffff"
  };

const sectionTitle:
  React.CSSProperties = {
    fontWeight: 800,
    margin:
      "20px 0 12px"
  };
