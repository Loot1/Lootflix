import { useParams } from 'react-router';
import { items } from '../data.js';

export default function SeriePage() {
    const { name } = useParams()
    return (
        <div>
            <p>
                {name}
            </p>
        </div>
    )
}