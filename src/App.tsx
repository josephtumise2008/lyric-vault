import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RootLayout } from './layouts/RootLayout'

import Home from './pages/Home'

/**
 * Route table.
 *
 * The homepage ships with the layout; every other page is code-split so the
 * first paint stays small. `RootLayout` owns the loading state, so no page
 * needs to handle it.
 */
const Music = lazy(() => import('./pages/Music'))
const Lyrics = lazy(() => import('./pages/Lyrics'))
const LyricDetail = lazy(() => import('./pages/LyricDetail'))
const Press = lazy(() => import('./pages/Press'))
const Shows = lazy(() => import('./pages/Shows'))
const About = lazy(() => import('./pages/About'))
const Book = lazy(() => import('./pages/Book'))
const Links = lazy(() => import('./pages/Links'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="music" element={<Music />} />
          <Route path="lyrics" element={<Lyrics />} />
          <Route path="lyrics/:slug" element={<LyricDetail />} />
          <Route path="press" element={<Press />} />
          <Route path="shows" element={<Shows />} />
          <Route path="about" element={<About />} />
          <Route path="book" element={<Book />} />
          <Route path="links" element={<Links />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
