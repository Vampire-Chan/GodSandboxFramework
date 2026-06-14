/**
 * DialogueBox.jsx - Cinematic Subtitle and Choice UI
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - Used during dialogue sequences. Maps to an `SOverlay` with an `STextBlock` at the bottom center.
 * - The choices array maps to an `SVerticalBox` of `SButton` instances.
 * - The typewriter effect (if implemented) is typically handled via a C++ `NativeTick` that slowly increases the visible character count of the `STextBlock`.
 * - Event `onChoiceSelect` binds to the C++ ScriptVM or Mission Manager to advance the dialogue tree.
 */
import { useState, useEffect } from "react";
import "./components.css";

/**
 * DialogueBox Component
 * 
 * Usage:
 * <DialogueBox
 *   title="Confirm Action"
 *   message="Do you want to proceed with this action?"
 *   buttons={[
 *     { label: "Cancel", variant: "secondary", onClick: () => {} },
 *     { label: "Accept", variant: "success", onClick: () => {} }
 *   ]}
 * />
 * 
 * Button variants: "primary", "secondary", "success", "danger"
 */
export default function DialogueBox({ 
  title = "Dialogue", 
  subtitle = "",
  message = "",
  buttons = [
    { label: "OK", variant: "primary", onClick: () => {} }
  ],
  onClose = () => {}
}) {
  const [isClosing, setIsClosing] = useState(false);

  const getButtonClass = (variant) => {
    const map = {
      primary: "db-btn primary",
      secondary: "db-btn secondary",
      success: "db-btn success",
      danger: "db-btn danger",
    };
    return map[variant] || map.secondary;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleButtonClick = (button) => {
    if (button.onClick) {
      button.onClick();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="db-backdrop" onClick={handleClose} />
      
      {/* Dialogue Container */}
      <div className="db-overlay" style={{ opacity: isClosing ? 0 : 1, transition: "opacity 0.2s ease-out" }}>
        <div className="db-container">
          {/* Header */}
          <div className="db-header">
            <div className="db-title">{title}</div>
            {subtitle && <div className="db-subtitle">{subtitle}</div>}
          </div>

          {/* Body */}
          {message && (
            <div className="db-body">
              <div className="db-message">{message}</div>
            </div>
          )}

          {/* Footer with Buttons */}
          <div className="db-footer">
            {buttons.map((button, idx) => (
              <button
                key={idx}
                className={getButtonClass(button.variant || "secondary")}
                onClick={() => {
                  handleButtonClick(button);
                  handleClose();
                }}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
