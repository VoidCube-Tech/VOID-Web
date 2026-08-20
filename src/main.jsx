import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout'
import AboutPage from './pages/AboutPage'
import ArticlePage from './pages/ArticlePage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import './styles.css'

function App() {
  return <BrowserRouter><Routes><Route element={<SiteLayout/>}>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/blog" element={<BlogPage/>}/>
    <Route path="/blog/:slug" element={<ArticlePage/>}/>
    <Route path="/sobre" element={<AboutPage/>}/>
    <Route path="/contato" element={<ContactPage/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Route></Routes></BrowserRouter>
}

const rootElement = document.getElementById('root')
const root = import.meta.hot?.data.root || createRoot(rootElement)
if (import.meta.hot) import.meta.hot.data.root = root
root.render(<App />)
