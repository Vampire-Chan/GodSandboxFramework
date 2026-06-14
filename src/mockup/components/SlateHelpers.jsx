import React from 'react';

// ============================================================================
// SLATE HELPERS (Web-Only)
// ============================================================================
// These components are used ONLY in the browser to mimic Unreal Engine's 
// Slate widgets. The Transpiler sees these tags (e.g. <SListView>) and maps 
// them directly to the native Engine XML nodes (e.g. <listview>).
// This eliminates the need for JSX .map() calls which cannot be transpiled
// easily to the game's C-like UI scripts.

export function SListView({ dataSource, template, className, style }) {
  // In the web browser, dataSource is the actual array.
  // In the Engine, dataSource is just a string binding name (e.g. "MENU_ITEMS").
  
  if (!dataSource || !Array.isArray(dataSource)) {
    return null;
  }

  return (
    <div className={className} style={style}>
      {dataSource.map((item, index) => (
        <React.Fragment key={index}>
          {template(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}
