import { Routes, Route } from 'react-router'
import { HomeRoute, SerieRoute, NoMatchRoute, LegalRoute, SeriesRoute, FilmRoute } from './routes'
import { Layout } from './components'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomeRoute />} />
                <Route path="/series" element={<SeriesRoute />} />
                <Route path="/film" element={<FilmRoute />} />
                <Route path="/mentions-legales" element={<LegalRoute />} />
                <Route path="/serie/:name" element={<SerieRoute />} />
                <Route path="*" element={<NoMatchRoute />} />
            </Routes>
        </Layout>
    )
}

export default App