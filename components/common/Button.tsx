import {ReactNode} from "react";

interface IButtonProps {
  id?: string;
  type: "primary" | "ghost" | "border-primary" | "white" | "danger";
  label: ReactNode;
  width?: string;
  height?: string;
  labelColor?: "white" | "grey" | "primary";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  id,
  type,
  label,
  height = "42px",
  width = "139px",
  labelColor = "white",
  onClick,
  disabled,
  className,
}: IButtonProps) {
  const renderBgAndColor = () => {
    if (disabled) {
      return "bg-gray-200 text-gray-300";
    } else {
      return type === "primary"
        ? "bg-primary"
        : type === "border-primary"
        ? "border border-primary"
        : type === "white"
        ? "bg-content"
        : type === "danger"
        ? "bg-danger"
        : "";
    }
  };

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        width,
        height,
        boxShadow:
          type === "primary"
            ? "0px 1px 3px 1px rgba(18, 23, 28, 0.08), 0px 1px 2px 0px rgba(18, 23, 28, 0.20)"
            : "",
      }}
      className={`${className} text-${labelColor} ${renderBgAndColor()} rounded-[4px] $`}
    >
      {label}
    </button>
  );
}
