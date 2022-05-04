import React from 'react'

import { Container, Nav, Navbar } from 'react-bootstrap'

export default function SecretNav(props) {
  return (
    <div>
        <Navbar collapseOnSelect expand="lg" bg="light">
            <Container>
            <Navbar.Brand href="/">Web Educational Game For Kids</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="#-">About Us</Nav.Link>
                    <Nav.Link href="#">Contact</Nav.Link>
                </Nav>
                <Nav>
                    <Navbar.Brand><small>Welcome, </small>  <strong> {props.user}</strong></Navbar.Brand>
                </Nav>
                <Nav>
                    <Nav.Link style={{color:"alphablue"}} href="/logout">Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}