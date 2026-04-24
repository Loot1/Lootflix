import { Navbar, Container } from 'react-bootstrap';
import logo from '../../assets/images/lootflix.png'
import { NavLink } from 'react-router';

export function Header() {
    return (
        <header style={{height:"100px", backgroundColor:"#E50914"}}>
            <Navbar>
                <Container>
                    <NavLink to="/" className="mx-auto">
                        <Navbar.Brand>
                            <img
                                src={logo}
                                className=""
                                alt="Lootflix logo"
                            />
                        </Navbar.Brand>
                    </NavLink>
                    <a href="https://github.com/Loot1/Lootflix" target="_blank" rel="noreferrer">
                        <ion-icon name="logo-github" size="large" style={{color:"white"}}></ion-icon>
                    </a>
                </Container>
            </Navbar>
        </header>
    )
}