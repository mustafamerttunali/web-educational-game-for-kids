import React from 'react'

import { Container, Nav, Navbar } from 'react-bootstrap'

export default function UnsecretNav() {
  return (
    <div>
        <Navbar collapseOnSelect expand="lg" bg="light">
            <Container>
            <Navbar.Brand href="/">Web Educational Game For Kids</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/about-us">About Us</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/register">Register</Nav.Link>
                    <Nav.Link href="/login">
                   Login
                </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}
