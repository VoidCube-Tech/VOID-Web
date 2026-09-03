import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import HomePage from './pages/HomePage'
import './style/variables.css'
import './style/reset.css'
import './style/sections.css'
import './style/buttons.css'
import './i18n/copy'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function RouteFallback() {
  return <div className="route-loading" role="status"><span>VOIDCUBE</span><i /></div>
}

function App() {
  return <HashRouter><Routes><Route element={<SiteLayout/>}>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/blog" element={<Suspense fallback={<RouteFallback/>}><BlogPage/></Suspense>}/>
    <Route path="/blog/:slug" element={<Suspense fallback={<RouteFallback/>}><ArticlePage/></Suspense>}/>
    <Route path="/sobre" element={<Suspense fallback={<RouteFallback/>}><AboutPage/></Suspense>}/>
    <Route path="/contato" element={<Suspense fallback={<RouteFallback/>}><ContactPage/></Suspense>}/>
    <Route path="*" element={<Suspense fallback={<RouteFallback/>}><NotFoundPage/></Suspense>}/>
  </Route></Routes></HashRouter>
}

const rootElement = document.getElementById('root')
const root = import.meta.hot?.data.root || createRoot(rootElement)
if (import.meta.hot) import.meta.hot.data.root = root
root.render(<App />)
