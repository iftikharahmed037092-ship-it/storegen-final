"use client";

interface Props {
  index: number;
  total: number;

  hidden?: boolean;

  onUp: () => void;
  onDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

export default function BlockToolbar({
  index,
  total,
  hidden,
  onUp,
  onDown,
  onDuplicate,
  onDelete,
  onToggle
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        flexWrap: "wrap",
        padding: 8,
        background:
          "rgba(17,24,39,.95)",
        color: "#ffffff",
        borderRadius:
          "10px 10px 0 0"
      }}
    >
      <strong
        style={{
          marginRight: 6,
          fontSize: 12
        }}
      >
        Section {index + 1}
      </strong>

      <button
        type="button"
        disabled={index === 0}
        onClick={onUp}
        style={buttonStyle}
      >
        ↑
      </button>

      <button
        type="button"
        disabled={
          index === total - 1
        }
        onClick={onDown}
        style={buttonStyle}
      >
        ↓
      </button>

      <button
        type="button"
        onClick={onDuplicate}
        style={buttonStyle}
      >
        Duplicate
      </button>

      <button
        type="button"
        onClick={onToggle}
        style={buttonStyle}
      >
        {hidden
          ? "Show"
          : "Hide"}
      </button>

      <button
        type="button"
        onClick={onDelete}
        style={{
          ...buttonStyle,
          background:
            "#dc2626"
        }}
      >
        Delete
      </button>
    </div>
  );
}

const buttonStyle:
  React.CSSProperties = {
    border: 0,
    borderRadius: 6,
    padding:
      "6px 9px",
    background:
      "#374151",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 700
  };
