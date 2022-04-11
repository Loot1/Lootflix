import { items } from '../data.js';
import {useParams} from "react-router-dom";

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