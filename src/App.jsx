import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features, { FeaturesPreview } from './components/Features';
import Docs from './components/Docs';
import Footer from './components/Footer';
import MockupApp from './mockup/App';
import Legal from './components/Legal';
import NotFound from './components/NotFound';

// A wrapper to handle the old state-based logic mapping to routes for Navbar and layout
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine 'currentPage' equivalent from pathname for styling and Navbar state
  let currentPage = 'home';
  if (location.pathname.startsWith('/features')) currentPage = 'features';
  if (location.pathname.startsWith('/docs')) currentPage = 'docs';
  if (location.pathname.startsWith('/mockup')) currentPage = 'mockup';
  if (location.pathname.startsWith('/legal')) currentPage = 'legal';

  const handleNavigate = (page) => {
    if (page === 'home') navigate('/');
    else if (page === 'docs') navigate('/docs/getting-started/intro'); // default doc route
    else navigate(`/${page}`);
    
    if (page !== 'mockup') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {currentPage !== 'mockup' && <Navbar currentPage={currentPage} onNavigate={handleNavigate} />}
      <main className={`main-content ${currentPage === 'docs' ? 'docs-page-layout' : ''} ${currentPage === 'mockup' ? 'mockup-fullscreen' : ''}`}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero onNavigate={handleNavigate} />
              <FeaturesPreview onSeeMore={() => handleNavigate('features')} />
            </>
          } />
          <Route path="/features" element={<Features />} />
          
          {/* Docs Routes: Nested structure /docs/:category/:page */}
          <Route path="/docs/:category/:page" element={<Docs />} />
          <Route path="/docs/:category" element={<Docs />} />
          <Route path="/docs" element={<Navigate to="/docs/getting-started/intro" replace />} />
          
          <Route path="/legal" element={<Legal />} />
          <Route path="/mockup" element={<MockupApp onExit={() => handleNavigate('home')} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {currentPage !== 'mockup' && <Footer />}
    </div>
  );
}

function App() {
  // NOTE: BrowserRouter requires server-side configuration to redirect all 404s to index.html 
  // to support deep linking on GitHub Pages.
  return (
    <Router basename="/GodSandboxFramework/">
      <AppContent />
    </Router>
  );
}

export default App;
