import React, { useState } from 'react'

// Boostrap
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'

import UnsecretNav from "../unsecret-nav/UnsecretNav";

// CSS
import './Register.css'

const API = process.env.REACT_APP_API;

export default function Register() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentSurname, setParentSurname] = useState("");
  const [childName, setChildName] = useState("");
  const [childSurname, setChildSurname] = useState("");

  const [email, setEmail] = useState("");

  const [passwordError, setpasswordError] = useState("");
  const [confirmPasswordError, setconfirmPasswordError] = useState("");
  const [parentNameError, setParentNameError] = useState("");
  const [parentSurnameError, setParentSurnameError] = useState("");
  const [childNameError, setChildNameError] = useState("");
  const [childSurnameError, setChildSurnameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [sameUserError] = useState("Cannot register more than once!");
  const [successRegister] = useState("Successfully registered! Redirecting to login page...");

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!parentName.match(/^[a-zA-Z]{3,22}$/)) {
      formIsValid = false;
      setParentNameError(
        "Only letters and length must best be min:3 and max:22 characters."
      );
      return false;
    }
    setParentNameError("");
  
    if (!parentSurname.match(/^[a-zA-Z]{3,22}$/)) {
      formIsValid = false;
      setParentSurnameError(
        "Only letters and length must best be min:3 and max:22 characters."
      );
      return false;
    }
    setParentSurnameError("");

    if (!childName.match(/^[a-zA-Z]{3,22}$/)) {
      formIsValid = false;
      setChildNameError(
        "Only letters and length must best be min:3 and max:22 characters."
      );
      return false;
    }
    setChildNameError("");

    if (!childSurname.match(/^[a-zA-Z]{3,22}$/)) {
      formIsValid = false;
      setChildSurnameError(
        "Only letters and length must best be min:3 and max:22 characters."
      );
      return false;
    }
    setChildSurnameError("");

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
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

  const registerSubmit = async (e) => {
    e.preventDefault();
    let isFormValid = handleValidation();

    if(isFormValid){
      
      const formData = {
        'parent_first_name': parentName,
        'parent_last_name': parentSurname,
        'child_first_name': childName,
        'child_last_name': childSurname,
        'email': email,
        'password': password
      }

      try{
        const response = await fetch(`${API}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
          },
          mode: 'cors',
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
        console.log(data)
        if(data['result'] === "-1"){
          // Get sameUserError id and display it
          document.getElementById('sameUserError').style.display = 'block'; 
          document.getElementById('successRegister').style.display = 'none';  
        }
        else{
          document.getElementById('sameUserError').style.display = 'none';
          document.getElementById('successRegister').style.display = 'block'; 
          
          // Redirect to login page
          setTimeout(() => {
            window.location.href = '/login';
          }
          , 2000);
        }

      }
      catch(err){
        console.log(err)
      }
    }
  }

  return (
    <div>
      <Container>
      <UnsecretNav />
        <Row className='d-flex justify-content-center'>
          <Col md={12}>
            <h1 className='text-center'>Register</h1>
            <hr></hr>
          </Col>
          <Col md={4}>
            <Form onSubmit={registerSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Parent Name:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" 
                                placeholder="Parent Name"
                                id="parent_first_name"
                                name="parent_first_name"
                                onChange={(event) => setParentName(event.target.value)} />
                </Col>
                <small id="parenterror" className="text-danger form-text">
                  {parentNameError}
                </small>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Parent Surname:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" 
                                placeholder="Parent Surname"
                                id="parent_last_name"
                                name="parent_last_name"
                                onChange={(event) => setParentSurname(event.target.value)} />
                </Col>
                <small id="parenterror" className="text-danger form-text">
                  {parentSurnameError}
                </small>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Child Name:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" 
                                placeholder="Child Name"
                                id="ChildName"
                                name="child_first_name"
                                onChange={(event) => setChildName(event.target.value)} />
                </Col>
                <small id="childerror" className="text-danger form-text">
                  {childNameError}
                </small>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Child Surname:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control type="text" 
                                placeholder="Child Surname"
                                id="ChildSurname"
                                name="child_last_name"
                                onChange={(event) => setChildSurname(event.target.value)} />
                </Col>
                <small id="childerror" className="text-danger form-text">
                  {childSurnameError}
                </small>
              </Form.Group>

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

              <Form.Group className="mb-3">
                <Form.Label>
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

              <Form.Group className="mb-3">
                <Form.Label>
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

              <Alert id="sameUserError" variant={"danger"}>
                {sameUserError}
              </Alert>

              <Alert id="successRegister" variant={"success"}>
                {successRegister}
              </Alert>

              <Col md={12} className='d-flex justify-content-left'>
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