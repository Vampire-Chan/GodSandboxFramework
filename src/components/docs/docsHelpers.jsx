// docsHelpers.jsx
// Shared helper utilities used across category doc files.
import React, { useState } from 'react';

/** Returns the logo/icon <img> for a given tool id. Used by the Tools page (CatB). */
export const getToolIcon = (toolId) => {
  const styles = { width: '48px', height: '48px', objectFit: 'contain', flexShrink: 0, transition: 'transform 0.2s ease, filter 0.2s ease' };
  const inv    = { ...styles, filter: 'brightness(0) invert(1)' };
  
  const createLink = (href, imgElement) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', outline: 'none' }} title={`Visit ${href}`} onMouseEnter={(e) => e.currentTarget.firstChild.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.firstChild.style.transform = 'scale(1)'}>
      {imgElement}
    </a>
  );

  switch (toolId) {
    case 'ue':          return createLink("https://www.unrealengine.com/", <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Unreal_Engine_Logo.svg/3840px-Unreal_Engine_Logo.svg.png" alt="Unreal Engine" style={inv} />);
    case 'metahuman':   return createLink("https://www.unrealengine.com/metahuman", <img src="https://www.metahuman.com/cosmos/static/favicons/favicon.svg" alt="MetaHuman" style={styles} />);
    case 'fab':         return createLink("https://www.fab.com/", <img src="https://static.fab.com/static/builds/web/dist/frontend/assets/images/common/logo/e1e12dc6142410b391ce48e416261ad7-v1.svg" alt="Fab" style={styles} />);
    case 'blender':     return createLink("https://www.blender.org/", <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/blender.webp" alt="Blender" style={styles} />);
    case 'maya':        return createLink("https://www.autodesk.com/products/maya/", <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/autodesk-maya-icon.png" alt="Autodesk Maya" style={styles} />);
    case '3dsmax':      return createLink("https://www.autodesk.com/products/3ds-max/", <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/autodesk-3ds-max-icon.png" alt="Autodesk 3ds Max" style={styles} />);
    case 'photoshop':   return createLink("https://www.adobe.com/products/photoshop.html", <img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg" alt="Photoshop" style={styles} />);
    case 'gimp':        return createLink("https://www.gimp.org/", <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/The_GIMP_icon_-_gnome.svg/1280px-The_GIMP_icon_-_gnome.svg.png" alt="GIMP" style={styles} />);
    case 'paintnet':    return createLink("https://www.getpaint.net/", <img src="https://avatars.githubusercontent.com/u/11067286?s=280&v=4" alt="Paint.NET" style={styles} />);
    case 'audacity':    return createLink("https://www.audacityteam.org/", <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Audacity_Logo.svg/500px-Audacity_Logo.svg.png" alt="Audacity" style={styles} />);
    case 'visualstudio':return createLink("https://visualstudio.microsoft.com/", <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Visual_Studio_Icon_2026.svg/960px-Visual_Studio_Icon_2026.svg.png" alt="Visual Studio" style={styles} />);
    case 'vscode':      return createLink("https://code.visualstudio.com/", <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/3840px-Visual_Studio_Code_1.35_icon.svg.png" alt="VSCode" style={styles} />);
    case 'npp':         return createLink("https://notepad-plus-plus.org/", <img src="https://upload.wikimedia.org/wikipedia/commons/f/f5/Notepad_plus_plus.png" alt="Notepad++" style={styles} />);
    default:            return null;
  }
};

/**
 * WorkflowTabGroup: Renders a tabbed container specifically for the dual-paradigm documentation.
 * Expects props:
 *   xmlContent: ReactNode to render when the "XML Modding" tab is active.
 *   bpContent: ReactNode to render when the "Blueprint SDK" tab is active.
 */
export function WorkflowTabGroup({ xmlContent, bpContent }) {
  const [activeTab, setActiveTab] = useState('xml');

  return (
    <div className="workflow-tab-group" style={{ margin: '1.5rem 0', border: '1px solid var(--line-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div className="tab-header" style={{ display: 'flex', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--line-primary)' }}>
        <button 
          onClick={() => setActiveTab('xml')}
          style={{ flex: 1, padding: '0.75rem', cursor: 'pointer', background: activeTab === 'xml' ? 'var(--bg-panel)' : 'transparent', color: activeTab === 'xml' ? 'var(--accent)' : 'var(--text-dim)', border: 'none', borderBottom: activeTab === 'xml' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 'bold', transition: 'all 0.2s' }}
        >
          &lt;/&gt; Data-Driven (XML)
        </button>
        <button 
          onClick={() => setActiveTab('bp')}
          style={{ flex: 1, padding: '0.75rem', cursor: 'pointer', background: activeTab === 'bp' ? 'var(--bg-panel)' : 'transparent', color: activeTab === 'bp' ? 'var(--accent)' : 'var(--text-dim)', border: 'none', borderBottom: activeTab === 'bp' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 'bold', transition: 'all 0.2s' }}
        >
          &#123; &#125; Standalone SDK (Blueprint / C++)
        </button>
      </div>
      <div className="tab-content" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-panel)' }}>
        {activeTab === 'xml' ? xmlContent : bpContent}
      </div>
    </div>
  );
}

export function GodCodeBlock({ code, language }) {
  const highlight = (text, lang) => {
    if (!text) return '';
    // Escape standard HTML tags
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    let tokens = [];
    const pushToken = (cls, val) => {
      tokens.push(`<span class="${cls}">${val}</span>`);
      return `{{{TOK${tokens.length - 1}}}}`;
    };

    if (lang === 'xml') {
      // Comments: <!-- ... -->
      html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (m) => pushToken('comment', m));
      // Tags: &lt;(/)?(\w+)
      html = html.replace(/(&lt;\/?)(\w+)/g, (m, p1, p2) => p1 + pushToken('keyword', p2));
      // Attributes: (\s+)(\w+)=
      html = html.replace(/(\s+)(\w+)=/g, (m, p1, p2) => p1 + pushToken('type', p2) + '=');
      // Attribute values in double quotes
      html = html.replace(/("[^"]*")/g, (m) => pushToken('string', m));
    } else if (lang === 'cpp' || lang === 'sc') {
      // Comments: // ...
      html = html.replace(/(\/\/.*)/g, (m) => pushToken('comment', m));
      // String literals
      html = html.replace(/("[^"]*")/g, (m) => pushToken('string', m));
      // Standard pointer arrows: -> (escaped as -&gt;)
      html = html.replace(/-&gt;/g, (m) => pushToken('keyword', m));
      // Unreal macros and specifiers
      html = html.replace(/\b(UFUNCTION|USTRUCT|UPROPERTY|SNew|DECLARE_MULTICAST_DELEGATE_OneParam|NAME_None)\b/g, (m) => pushToken('macro', m));
      // Unreal Engine standard types and class groups
      html = html.replace(/\b(U[A-Z]\w+|A[A-Z]\w+|F[A-Z]\w+|S[A-Z]\w+|I[A-Z]\w+|TArray|TMap|TSharedPtr|TSharedRef|TWeakObjectPtr|TSoftObjectPtr|TSoftClassPtr|FString|FName|FText|FVector|FRotator|FTransform|FLinearColor|int32|float|bool|uint8|uint32|local|E[A-Z]\w+)\b/g, (m) => pushToken('type', m));
      // C++ core keywords
      html = html.replace(/\b(const|static|void|bool|int|double|char|struct|class|if|else|for|while|return|nullptr|new|delete|function|public|private|protected)\b/g, (m) => pushToken('keyword', m));
      // Function calls: word before opening parenthesis
      html = html.replace(/\b(\w+)(?=\()/g, (m) => pushToken('function', m));
      // Numerical literals
      html = html.replace(/\b(\d+(\.\d+)?f?)\b/g, (m) => pushToken('number', m));
    }

    // Restore all tokens safely
    html = html.replace(/\{\{\{TOK(\d+)\}\}\}/g, (m, idx) => tokens[idx]);
    
    return html;
  };

  const highlightedHtml = highlight(code, language);

  return (
    <pre className="code-block" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
  );
}

