import React from 'react'

import { Card } from 'react-bootstrap'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Profile(props) {
  return (
    <Card>
        <Card.Img className='mx-auto d-block' variant="center" src={props.image} style={{height:"165px", width:"40%"}}/>
        <Card.Body className='text-center'>
            <Card.Title className="text-center">{props.name}</Card.Title>
            <Card.Text>
               {props.text}
            </Card.Text>
            <a target="_blank" href={props.github}><FontAwesomeIcon icon={faGithub} style={{color:'black', fontSize:"30px"}}/></a>{' '}
            <a target="_blank" href={props.linkedin}><FontAwesomeIcon icon={faLinkedin} style={{fontSize:"30px"}}/></a>
        </Card.Body>
    </Card>
  )
}
