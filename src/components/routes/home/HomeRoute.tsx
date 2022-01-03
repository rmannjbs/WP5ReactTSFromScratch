import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

export const HomeRoute = () : React.ReactElement => {    
    return (
        <Container fluid className="gx-0">
            <Row>
                <Col xs={12}>
                    <h1 className="bg-primary text-center">Hello World!</h1>
                </Col>
            </Row>
        </Container>
    )
}