import React, { useState } from 'react'

// Boostrap
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

// CSS
import './Login.css'

export default function Login(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setemailError("Email is not valid.");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (!password.match(/^[a-zA-Z]{8,22}$/)) {
      formIsValid = false;
      setpasswordError(
        "Only letters and length must best be min:8 and max:22 characters."
      );
      return false;
    } else {
      setpasswordError("");
      formIsValid = true;
    }

    return formIsValid;
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    let isFormValid = handleValidation();
    if(isFormValid){
      console.log("Login Successful");
    }
  };

  return (
    <div>
      <Container>
        <Row className='d-flex justify-content-center'>
          <Col md={12}>
            <h1 className='text-center'>Web Educational Game For Kids</h1>
            <hr></hr>
          </Col>
        
          <Col md={5}>
            <h3>Login</h3>
            <Form onSubmit={loginSubmit}>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
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

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  Password
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="password" 
                                placeholder="Password"
                                id="InputPassword"
                                onChange={(event) => setPassword(event.target.value)} />
                </Col>
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
                <Form.Text className="text-muted">
                  Don't you have an account? <a href="/register">Register</a>
                </Form.Text>
              </Form.Group>

              <Col md={12} className='d-flex justify-content-center'>
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Col>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}