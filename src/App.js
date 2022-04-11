import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from "./components/Header.js"

import HomePage from './routes/Home.js'
import SeriePage from './routes/Serie.js'
import NoMatchPage from './routes/NoMatch.js'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route exact path="/" element={<HomePage/>}/>
        <Route exact path="/:name" element={<SeriePage/>}/>
        <Route path="*" element={<NoMatchPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}