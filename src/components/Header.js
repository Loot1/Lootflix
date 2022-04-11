import {Navbar, Container} from 'react-bootstrap';
import logo from '../assets/img/lootflix.png'
import { NavLink } from 'react-router-dom'

export default function Header() {
    return (
        <header style={{height:"100px", backgroundColor:"#E50914"}}>
            <Navbar>
                <Container>
                    <Navbar.Brand className="mx-auto">
                        <img
                            src={logo}
                            className=""
                            alt="Lootflix logo"
                        />
                    </Navbar.Brand>
                    <a href="https://github.com/loot1" target="_blank" rel="noreferrer">
                        <ion-icon name="logo-github" size="large" style={{color:"white"}}/>
                    </a>
                </Container>
            </Navbar>
        </header>
    )
}