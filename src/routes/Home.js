import { Container, Row, Col } from 'react-bootstrap';
import first from "../assets/img/first.jpg"

export default function HomePage() {
    return (
        <main>
            <Container>
                {/* <Row className="mt-5">
                    {
                        [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((n) => (
                            <Col xs={12} md={6} xl={4} key={n}>
                                <Row>
                                    <Col xs={6}>
                                        <img src={first} className="img-fluid"></img>
                                    </Col>
                                    <Col xs={6}>
                                        <h2>Test</h2>
                                    </Col>
                                </Row>
                            </Col>
                        ))
                    }
                </Row> */}
                <h3 style={{fontFamily:"HelveticaNeue-SemiBold"}}>
                    Les meilleures séries
                </h3>
            </Container>
        </main>
    )
}