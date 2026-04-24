import { useParams } from 'react-router';
import { items } from '../data.js';

export function SerieRoute() {
    const { name } = useParams()
    return (
        <div>
            <p>
                {name}
            </p>
        </div>
    )
}