import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { DataProvider } from './context/DataContext.js';
import { FavoritesProvider } from './context/FavoritesContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { ErrorBoundary } from './components/common/ErrorBoundary.js';
import { Layout } from './components/layout/Layout.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { AllToolsPage } from './pages/AllToolsPage.js';
import { ToolDetailPage } from './pages/ToolDetailPage.js';
import { CategoryPage } from './pages/CategoryPage.js';
import { BlogListPage } from './pages/BlogListPage.js';
import { BlogDetailPage } from './pages/BlogDetailPage.js';
import { FavoritesPage } from './pages/FavoritesPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { PrivacyPolicyPage, TermsPage } from './pages/LegalPages.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <FavoritesProvider>
            <AuthProvider>
              <BrowserRouter>
                <Layout>
                  <Routes>
                    {/* Home */}
                    <Route path="/" element={<HomePage />} />

                    {/* Tools */}
                    <Route path="/tools" element={<AllToolsPage />} />
                    <Route path="/tools/:slug" element={<ToolDetailPage />} />

                    {/* Categories */}
                    <Route path="/category/:slug" element={<CategoryPage />} />

                    {/* Blog */}
                    <Route path="/blog" element={<BlogListPage />} />
                    <Route path="/blog/:slug" element={<BlogDetailPage />} />

                    {/* User Favorites */}
                    <Route path="/favorites" element={<FavoritesPage />} />

                    {/* Company & Legal */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />

                    {/* Admin CMS */}
                    <Route path="/admin" element={<AdminDashboard />} />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </AuthProvider>
          </FavoritesProvider>
        </DataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
