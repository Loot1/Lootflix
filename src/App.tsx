import { BrowserRouter, Routes, Route } from 'react-router'
import Header from './components/Header'
import HomePage from './routes/Home'
import NoMatchPage from './routes/NoMatch'
import SeriePage from './routes/Serie'

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:name" element={<SeriePage />} />
                <Route path="*" element={<NoMatchPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App