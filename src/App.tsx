import { Routes, Route } from 'react-router'
import { HomeRoute, SerieRoute, NoMatchRoute } from './routes'
import { Layout } from './components'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomeRoute />} />
                <Route path="/:name" element={<SerieRoute />} />
                <Route path="*" element={<NoMatchRoute />} />
            </Routes>
        </Layout>
    )
}

export default App