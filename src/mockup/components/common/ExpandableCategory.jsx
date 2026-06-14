/**
 * ExpandableCategory.jsx - Layout Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This maps to an `SExpandableArea` in Slate.
 * - In React, we use the `useState` hook to keep track of the `expanded` boolean. When clicked, React conditionally renders the `children`.
 * - In Slate, `SExpandableArea` handles the open/close state natively. You provide a HeaderContent (the category label/count) and BodyContent (the children).
 * - React's `children` prop conceptually maps to the `BodyContent` slot of the `SExpandableArea`.
 */
import React, { useState } from "react";

export function ExpandableCategory({ title, children, countInfo, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mods-category">
      <div
        className="mods-category-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="mods-category-icon">{expanded ? '▼' : '▶'}</span>
        <span className="mods-category-name">{title}</span>
        {countInfo && (
          <span className="mods-category-count">{countInfo}</span>
        )}
      </div>

      {expanded && (
        <div className="mods-category-items">
          {children}
        </div>
      )}
    </div>
  );
}
