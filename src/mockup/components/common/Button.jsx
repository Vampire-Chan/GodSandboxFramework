/**
 * Button.jsx - Atomic UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps directly to a standard `SButton` in Slate or `UButton` in UMG.
 * - The `variant` prop (primary, secondary, etc.) maps to different FButtonStyle profiles (which can be loaded via DataManager).
 * - The `shape` prop (rect, rounded, trapezium, parallelogram) determines the base brush/image used for the button background. 
 *   For parallelograms, note the inner <span> counter-skew; in UMG this requires a Render Transform Skew applied to the parent and an inverse Skew on the text block.
 * - `className` is a web concept for applying CSS rules. In UE, styling should be handled via the UI theme registry or explicit style structs.
 */
import React from "react";

export function Button({ 
  children, 
  variant = "secondary", // primary, secondary, success, danger
  shape = "rect", // rect, rounded, trapezium, parallelogram
  size = "md", // sm, md, lg
  className = "", 
  disabled = false,
  onClick,
  ...props 
}) {
  const baseClass = "jl-btn";
  const variantClass = `jl-btn-${variant}`;
  const shapeClass = shape !== "rect" ? `jl-btn-${shape}` : "";
  const sizeClass = size !== "md" ? `jl-btn-${size}` : "";

  return (
    <button
      className={`${baseClass} ${variantClass} ${shapeClass} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {/* If parallelogram, we need to counter-skew the text content so it stays upright */}
      {shape === "parallelogram" ? <span>{children}</span> : children}
    </button>
  );
}
