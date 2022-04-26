import React, { useState } from 'react'

// Boostrap
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'

// CSS
import './ResetPassword.css'

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailSendFail] = useState("An error has occurred. Please try again.");
    const [emailSendSuccess] = useState("An email has been sent to your email address. Please check your email to see your password.");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === "") {
            setEmailError("Email is required");
        } else {
            setEmailError("");
        }
    }
  return (
    <div>
        <Container>
            <Row className='d-flex justify-content-center'>
                <Col md={12}>
                    <h1 className='text-center'>Web Educational Game For Kids</h1>
                    <hr></hr>
                </Col>
            
                <Col md={4}>
                    <h3>Reset your password</h3>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>
                            Email
                            </Form.Label>
                            <Col sm={10}>
                            <Form.Control type="email" 
                                            placeholder="Email"
                                            id="EmailInput"
                                            name="EmailInput"
                                            aria-describedby='emailHelp'
                                            onChange={(event) => setEmail(event.target.value)} />
                            </Col>
                            <small id="emailHelp" className="text-danger form-text">
                                {emailError}
                            </small>
                        </Form.Group>

                        <Col md={12} className='d-flex justify-content-left'>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Col>
                        <br></br>
                        <Alert id="emailSendSuccess" variant={"success"}>
                            {emailSendSuccess}
                        </Alert>
                        <Alert id="emailSendFail" variant={"danger"}>
                            {emailSendFail}
                        </Alert>
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>
  )
}