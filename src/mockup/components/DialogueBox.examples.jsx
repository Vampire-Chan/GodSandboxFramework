/**
 * DialogueBox Component - Usage Examples
 * 
 * A reusable dialogue/modal component that matches the JustLive UI design
 * with customizable title, message, and buttons.
 * 
 * Features:
 * - Blurred backdrop overlay
 * - Customizable title and subtitle
 * - Configurable button variants (primary, secondary, success, danger)
 * - Smooth animations
 * - Cyberpunk/Sci-fi aesthetic matching PauseMenu design
 */

// ============================================================================
// BASIC USAGE
// ============================================================================

import DialogueBox from "./components/DialogueBox";

function MyComponent() {
  const [showDialogue, setShowDialogue] = useState(false);

  return (
    <>
      <button onClick={() => setShowDialogue(true)}>Open Dialogue</button>

      {showDialogue && (
        <DialogueBox
          title="Confirm Action"
          subtitle="— SYSTEM PROMPT —"
          message="Do you want to proceed?"
          buttons={[
            { label: "Cancel", variant: "secondary", onClick: () => console.log("Cancelled") },
            { label: "OK", variant: "primary", onClick: () => console.log("Confirmed") }
          ]}
          onClose={() => setShowDialogue(false)}
        />
      )}
    </>
  );
}

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

/**
 * Available button variants:
 * - "primary"   - Orange/rust accent (main action)
 * - "secondary" - Default gray (neutral/cancel)
 * - "success"   - Green (confirm/accept)
 * - "danger"    - Red (destructive actions)
 */

// Example 1: Confirmation Dialog
<DialogueBox
  title="Delete File?"
  message="This action cannot be undone."
  buttons={[
    { label: "Cancel", variant: "secondary", onClick: handleCancel },
    { label: "Delete", variant: "danger", onClick: handleDelete }
  ]}
  onClose={() => setShowDialogue(false)}
/>

// Example 2: Save Changes Dialog
<DialogueBox
  title="Save Changes?"
  subtitle="— UNSAVED MODIFICATIONS —"
  message="You have unsaved changes. Would you like to save them before leaving?"
  buttons={[
    { label: "Discard", variant: "secondary", onClick: handleDiscard },
    { label: "Save", variant: "success", onClick: handleSave }
  ]}
  onClose={() => setShowDialogue(false)}
/>

// Example 3: Transaction Confirmation
<DialogueBox
  title="Confirm Purchase"
  subtitle="— CREDIT TRANSFER —"
  message="Purchase 1000 credits for $9.99? This will be billed to your registered payment method."
  buttons={[
    { label: "Cancel", variant: "secondary", onClick: handleCancel },
    { label: "Confirm", variant: "success", onClick: handleConfirm }
  ]}
  onClose={() => setShowDialogue(false)}
/>

// Example 4: Three-Option Dialog
<DialogueBox
  title="What would you like to do?"
  subtitle="— SYSTEM OPTIONS —"
  message="Select an option to proceed."
  buttons={[
    { label: "Cancel", variant: "secondary", onClick: handleCancel },
    { label: "Edit", variant: "primary", onClick: handleEdit },
    { label: "Delete", variant: "danger", onClick: handleDelete }
  ]}
  onClose={() => setShowDialogue(false)}
/>

// Example 5: Single OK Button
<DialogueBox
  title="Operation Complete"
  subtitle="— SUCCESS —"
  message="Your changes have been saved successfully."
  buttons={[
    { label: "OK", variant: "success", onClick: handleClose }
  ]}
  onClose={() => setShowDialogue(false)}
/>

// ============================================================================
// INTEGRATION WITH HUD
// ============================================================================

/**
 * Press "D" during gameplay to spawn a test dialogue box.
 * The key binding is defined in HUD.jsx and handled via the 
 * onDialogueTest callback passed from App.jsx
 */

// ============================================================================
// CUSTOMIZATION TIPS
// ============================================================================

/**
 * The DialogueBox component uses the same color palette and design
 * system as PauseMenu. To customize:
 * 
 * 1. Colors: Edit the "C" constant in DialogueBox.jsx
 * 2. Fonts: Edit the CSS @import statements
 * 3. Animations: Modify fadeIn and slideUp keyframes in CSS
 * 4. Button variants: Add new className rules in CSS
 * 
 * The component automatically handles:
 * - Click-outside-to-close (backdrop click)
 * - Closing animation before unmounting
 * - Button click handling and closing
 * - Proper z-index layering
 */

// ============================================================================
// IN REACT COMPONENTS
// ============================================================================

// Example from a settings menu
function SettingsMenu() {
  const [dialogueState, setDialogueState] = useState({
    show: false,
    type: null
  });

  const handleResetToDefaults = () => {
    setDialogueState({
      show: true,
      type: "reset_confirm"
    });
  };

  return (
    <>
      <button onClick={handleResetToDefaults}>Reset to Defaults</button>

      {dialogueState.show && dialogueState.type === "reset_confirm" && (
        <DialogueBox
          title="Reset Settings?"
          subtitle="— DANGER ZONE —"
          message="This will reset all settings to factory defaults. Are you sure?"
          buttons={[
            { label: "Keep Settings", variant: "secondary", onClick: () => setDialogueState({ show: false }) },
            { label: "Reset", variant: "danger", onClick: () => {
              // Do reset logic here
              setDialogueState({ show: false });
            }}
          ]}
          onClose={() => setDialogueState({ show: false })}
        />
      )}
    </>
  );
}

// ============================================================================
// PROP DOCUMENTATION
// ============================================================================

/**
 * @param {string} title - Main title of the dialogue (required)
 * @param {string} subtitle - Smaller subtitle text (optional)
 * @param {string} message - Main message body (optional)
 * @param {Array} buttons - Array of button objects:
 *   {
 *     label: string,           // Button text
 *     variant: string,         // "primary" | "secondary" | "success" | "danger"
 *     onClick: function        // Callback when button is clicked
 *   }
 * @param {function} onClose - Callback when dialogue closes
 */
