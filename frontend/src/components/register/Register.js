import React, { useState } from 'react'

// Boostrap
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

// CSS
import './Register.css'

export default function Register() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [parentNameSurname, setParentNameSurname] = useState("");
  const [childNameSurname, setChildNameSurname] = useState("");
  const [email, setEmail] = useState("");

  const [passwordError, setpasswordError] = useState("");
  const [confirmPasswordError, setconfirmPasswordError] = useState("");
  const [parentNameSurnameError, setParentNameSurnameError] = useState("");
  const [childNameSurnameError, setChildNameSurnameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!parentNameSurname.match(/^[a-zA-Z]{3,22}$/)) {
      formIsValid = false;
      setParentNameSurnameError(
        "Only letters and length must best be min:3 and max:22 characters."
      );
      return false;
    }
    setParentNameSurnameError("");
    formIsValid = true;

    if (!childNameSurname.match(/^[a-zA-Z]{3,22}$/)) {
      formIsValid = false;
      setChildNameSurnameError(
        "Only letters and length must best be min:3 and max:22 characters."
      );
      return false;
    }
    setChildNameSurnameError("");
    formIsValid = true;

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email is not valid.");
      return false;
    } else {
      setEmailError("");
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
      if (password !== confirmPassword) {
        formIsValid = false;
        setconfirmPasswordError("Passwords do not match.");
        return formIsValid;
      }
      setconfirmPasswordError("")
      formIsValid = true;
    }

    return formIsValid;
  }

  const registerSubmit = (e) => {
    e.preventDefault();
    let isFormValid = handleValidation();
    if(isFormValid){
      console.log("Register Successful");
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
          <Col md={5}>
            <h3>Register</h3>
            <Form onSubmit={registerSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  Parents:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" 
                                placeholder="Parent name and surname"
                                id="ParentNameSurname"
                                onChange={(event) => setParentNameSurname(event.target.value)} />
                </Col>
                <small id="parenterror" className="text-danger form-text">
                  {parentNameSurnameError}
                </small>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  Child:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" 
                                placeholder="Child name and surname"
                                id="ChildNameSurname"
                                onChange={(event) => setChildNameSurname(event.target.value)} />
                </Col>
                <small id="childerror" className="text-danger form-text">
                  {childNameSurnameError}
                </small>
              </Form.Group>

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
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  Confirm Password
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="password" 
                                placeholder="Confirm your password"
                                id="ConfirmInputPassword"
                                onChange={(event) => setConfirmPassword(event.target.value)} />
                </Col>
                <small id="passworderror" className="text-danger form-text">
                  {confirmPasswordError}
                </small>
                <Form.Text className="text-muted">
                  Do you have an account? <a href="/login">Login</a>
                </Form.Text>
              </Form.Group>

              <Col md={12} className='d-flex justify-content-center'>
                <Button variant="primary" type="submit">
                  Register
                </Button>
              </Col>

            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}