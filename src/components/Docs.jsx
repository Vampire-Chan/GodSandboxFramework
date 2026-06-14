/**
 * Docs.jsx — Shell / Router
 *
 * This file is intentionally thin. All page content lives in:
 *   src/components/docs/Cat*.jsx  — one file per category
 *   src/components/docs/docMenu.js — navigation config
 *
 * To add a new page:
 *   1. Add its id + title to docMenu.js
 *   2. Add a `case 'my_new_id':` block in the matching Cat*.jsx file
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Docs.css';
import DocSearch from './docs/DocSearch';

import { docMenu, getCategoryTitle, getCategorySlug } from './docs/docMenu';

import { renderPage as renderCatA, getOutline as outlineCatA } from './docs/CatA_GettingStarted';
import { renderPage as renderCatB, getOutline as outlineCatB } from './docs/CatB_ModdingFoundations';
import { renderPage as renderCatC, getOutline as outlineCatC } from './docs/CatC_CoreSystems';
import { renderPage as renderCatD, getOutline as outlineCatD } from './docs/CatD_CombatAnimation';
import { renderPage as renderCatE, getOutline as outlineCatE } from './docs/CatE_ScriptingAI';
import { renderPage as renderCatF, getOutline as outlineCatF } from './docs/CatF_XMLDatabase';
import { renderPage as renderCatG, getOutline as outlineCatG } from './docs/CatG_PedSystem';
import { renderPage as renderCatH, getOutline as outlineCatH } from './docs/CatH_VFSAndDataInternals';
import { renderPage as renderCatI, getOutline as outlineCatI } from './docs/CatI_AdvancedScripting';
import { renderPage as renderCatJ, getOutline as outlineCatJ } from './docs/CatJ_VehiclePhysics';
import { renderPage as renderCatK, getOutline as outlineCatK } from './docs/CatK_EconomyProgression';
import { renderPage as renderCatL, getOutline as outlineCatL } from './docs/CatL_NetworkUI';

const CATEGORIES = [
  [renderCatA, outlineCatA],
  [renderCatB, outlineCatB],
  [renderCatC, outlineCatC],
  [renderCatD, outlineCatD],
  [renderCatE, outlineCatE],
  [renderCatF, outlineCatF],
  [renderCatG, outlineCatG],
  [renderCatH, outlineCatH],
  [renderCatI, outlineCatI],
  [renderCatJ, outlineCatJ],
  [renderCatK, outlineCatK],
  [renderCatL, outlineCatL],
];

export default function Docs() {
  const { category, page } = useParams();
  const navigate = useNavigate();

  const activeDoc = page || 'intro';

  // Auto-scroll to top when page content changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const reader = document.querySelector('.docs-reader');
    if (reader) reader.scrollTop = 0;
  }, [activeDoc, category]);

  // Handle missing or partial routes (e.g. just /docs/ or /docs/category-name)
  useEffect(() => {
    if (!category || !page) {
      // Find the first valid item
      let defaultCatSlug = 'getting-started';
      let defaultPageId = 'intro';
      
      if (category) {
        // Find default page for this category
        const catObj = docMenu.find(c => getCategorySlug(c.category) === category);
        if (catObj && catObj.items.length > 0) {
          defaultPageId = catObj.items[0].id;
          defaultCatSlug = category;
        }
      }
      
      navigate(`/docs/${defaultCatSlug}/${defaultPageId}`, { replace: true });
    }
  }, [category, page, navigate]);

  const renderContent = () => {
    for (const [render] of CATEGORIES) {
      const result = render(activeDoc);
      if (result !== null && result !== undefined) return result;
    }
    return (
      <article className="doc-article">
        <header className="doc-header">
          <h1 className="doc-main-title">Page Not Found</h1>
          <p className="doc-lead-para">No content registered for id: <code>{activeDoc}</code></p>
        </header>
      </article>
    );
  };

  const getActiveOutline = () => {
    for (const [, outline] of CATEGORIES) {
      const result = outline(activeDoc);
      if (result !== null && result !== undefined) return result;
    }
    return null;
  };

  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <div className="docs-search-box">
          <DocSearch />
        </div>

        <nav className="docs-nav">
          {docMenu.map((cat, i) => {
            const catSlug = getCategorySlug(cat.category);
            return (
              <div className="docs-menu-category" key={i}>
                <h5 className="category-title">{cat.category}</h5>
                <ul className="category-list">
                  {cat.items.map((item, j) => {
                    const isActive = activeDoc === item.id;
                    return (
                      <li key={j}>
                        {item.disabled ? (
                          <button className="doc-menu-item-btn disabled" disabled>
                            {item.title} <span className="disabled-lock-badge">LOCK</span>
                          </button>
                        ) : (
                          <Link
                            to={`/docs/${catSlug}/${item.id}`}
                            className={`doc-menu-item-btn ${isActive ? 'active' : ''}`}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            {item.title}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="docs-reader">
        <div className="docs-breadcrumbs">
          <span className="crumb">JustLive Platform SDK</span>
          <span className="divider">/</span>
          <span className="crumb active">{getCategoryTitle(activeDoc)}</span>
        </div>
        {renderContent()}
      </main>

      <aside className="docs-outline-aside">
        <div className="outline-sticky-box">
          <h5 className="outline-title">On This Page</h5>
          <ul className="outline-list">
            {getActiveOutline()}
          </ul>
          <div className="outline-footer">
            <a href="https://github.com/Vampire-Chan/JustLive" target="_blank" rel="noreferrer" className="outline-footer-link">
              Edit on GitHub
            </a>
            <a href="#download" className="outline-footer-link">
              Download Dev SDK
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
