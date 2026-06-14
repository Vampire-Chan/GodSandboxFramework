/**
 * Tabs.jsx - Atomic UI Component
 * 
 * PORTING NOTES FOR UNREAL ENGINE / SLATE:
 * - This is structurally a sidebar list view used for navigation. 
 * - React dynamically re-renders the right-side content based on `activeTab`. 
 * - In Slate, this corresponds to an `SListView` on the left and an `SWidgetSwitcher` on the right.
 * - When `OnSelectionChanged` triggers on the `SListView`, call `SetActiveWidgetIndex()` on the `SWidgetSwitcher` to change the active settings panel.
 * - The `template` prop in React maps to `OnGenerateRow` in Slate `SListView`.
 */
import React from "react";
import { SListView } from "../SlateHelpers";

export function Tabs({ title, tabs, activeTab, onTabChange, className = "" }) {
  return (
    <div className={`settings-tabs-sidebar ${className}`}>
      {title && <h2 className="mm-settings-title">{title}</h2>}
      <SListView 
        dataSource={tabs}
        template={(tab) => (
          <div
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="mm-settings-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        )}
      />
    </div>
  );
}
