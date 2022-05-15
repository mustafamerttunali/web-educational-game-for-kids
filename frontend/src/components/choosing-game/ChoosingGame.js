import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import ChoosingGameHandModule from './ChoosingGameHandModule'

import { HandCoordinateContext } from "../hand-module/GestureContext"; 
import SecretNav from '../secret-nav/SecretNav';
import ChoosingGameQuestion from './ChoosingGameQuestion';
import { sendAnswers } from '../../utils/SendAnswers';

import { split } from '@tensorflow/tfjs';

const API = process.env.REACT_APP_API;

export default function ChoosingGame() {
  const [handCoordinates] = React.useContext(HandCoordinateContext);
  const [user, setUser] = useState("");
  const [firstObjectBorder, setFirstObjectBorder] = useState("");
  const [secondObjectBorder, setSecondObjectBorder] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState(0);
  const [buttonText, setButtonText] = useState("Next Question");
  const [userAnswers, setUserAnswers] = useState("");
  const [infoHand, setInfoHand] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState("");
  const [coldStart, setColdStart] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [variant, setVariant] = useState("warning");
  const [userAnswer, setUserAnswer] = useState(false);

  
  const splitImagePath = (imagePath) => {
    const split = imagePath.split("/");
    const imageName = split[split.length - 1];
    const finalPath =  `images/${imageName}`;
    return finalPath;
  }

  const getQuestions = async () => {
    try{
        const response = await fetch(API + '/choose-game', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });
        const data = await response.json();
        console.log(data)
        setCurrentQuestionAnswer(data[currentQuestionIndex].correct_answer);
        setUser(data["player"]);
        const keys = Object.keys(data).filter(key => typeof data[key] === 'object');
        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            setQuestions(prevState => [...prevState, data[key]])
        }
        setInfoHand("")
        setVariant("")
    }
    catch(error){
        console.log(error);
    }
    setColdStart(true);
  }

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    if(handCoordinates !== null){
      try {
        const currentChoose = handCoordinates["coordinate"]["bottomRight"][0];
     
      if(handCoordinates["coordinate"]["select"]){
        if(currentChoose < 0){
            setFirstObjectBorder("6px dashed orange");
            setSecondObjectBorder("");
            setUserAnswer(questions[currentQuestionIndex].first_object);
        } 
        else{
          setFirstObjectBorder("");
          setSecondObjectBorder("6px dashed orange");
          setUserAnswer(questions[currentQuestionIndex].second_object);
        }
      }
      else{
          // setInfoHand("Select the object you want to choose");
          // setVariant("primary")
          if(currentChoose < 0){
            setFirstObjectBorder("3px solid #0d6efd");
            setSecondObjectBorder("");
          }
          else{
            setFirstObjectBorder("");
            setSecondObjectBorder("3px solid #0d6efd");
          }
          setUserAnswer(null)
        }
      }
      catch(error){
        console.log(error);
      }
    }
    else{
        setIsAnswered(false);
        setFirstObjectBorder("");
        setSecondObjectBorder("");
      }
    } , [handCoordinates]);

  useEffect(() => {
    setTimer("");
    if ((userAnswer !== null) && questions.length > 0){
      setIsAnswerCorrect(false);
      setIsAnswered(false);
      setInfoHand("");
      setVariant("");
      let count = 2;
      
      const interval = setInterval(async() => {
        if(count === 0){
          clearInterval(interval);
          if(userAnswer === questions[currentQuestionIndex].correct_object){
            setInfoHand("Correct! Redirecting to next question...");
            setIsAnswerCorrect(true);
            setVariant("success")
            setTimer("");
            setUserAnswers(prevState => {
              return {
                  ...prevState, [currentQuestionIndex]: {
                      "first_object": questions[currentQuestionIndex].first_object,
                      "second_object": questions[currentQuestionIndex].second_object,
                      "correct_object": questions[currentQuestionIndex].correct_object,
                      "user_answer": userAnswer,
                      "result": true,
                  }
              };
            });
            setTimeout(() => {
              handleNextQuestion();
            }, 1500);
          }
          else{
            setInfoHand("Wrong! Redirecting to next question...")
            setVariant("danger")
            setIsAnswerCorrect(false);
            setTimer("");
            setUserAnswers(prevState => {
              return {
                  ...prevState, [currentQuestionIndex]: {
                      "first_object": questions[currentQuestionIndex].first_object,
                      "second_object": questions[currentQuestionIndex].second_object,
                      "correct_object": questions[currentQuestionIndex].correct_object,
                      "user_answer": userAnswer,
                      "result": false,
                  }
              };
            });
             // Go to next question after 1.5 seconds
             setTimeout(() => {
              handleNextQuestion();
            }, 1500);
          }
          setIsAnswered(true);
        }
        else{
          setInfoHand("Getting your answer... Please hold your hand!")
          setVariant("info")
          setTimer(count);
          count--;
          console.log(userAnswer)
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    else{
      setIsAnswered(false);
      setFirstObjectBorder("");
      setSecondObjectBorder("");
      setInfoHand("")
      setVariant("")
    }
  }, [userAnswer]);

  const handleNextQuestion = () => {
    setVariant("")
    setInfoHand("")
    setCurrentQuestionIndex(prevState => prevState + 1)
  }

  useEffect(() => {
    console.log(userAnswers)
  }, [userAnswers]);

  useEffect(() => {
    if(currentQuestionIndex === questions.length){
      if(coldStart){
        setIsGameOver(true);
        setInfoHand("Game Over! Redirecting to home...")
        setVariant("info")
        try {
          sendAnswers(userAnswers, "/choose-game")
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);

        } catch (error) {
          
        }
      }
      
    }else{
        try {
            setCurrentQuestionAnswer(questions[currentQuestionIndex].correct_answer);
        } catch (error) {
            
        }
    }
}, [currentQuestionIndex])

  return (
    <div>
      <Container>
        <SecretNav user={user}/>
        <Row className='d-flex justify-content-center'>
                <Col md={12}>
                    <h1 className='text-center'>Choosing Game</h1>
                    <hr></hr>
                </Col>
                
                <Col md={10}>
                {
                    questions.length > 0 && questions[currentQuestionIndex] !== undefined ? (
                        <div>
                         <Alert variant={variant}>
                                    {infoHand} {timer}
                          </Alert>
                          <ChoosingGameQuestion  questions={questions[currentQuestionIndex]} 
                              firstObjectImage={splitImagePath(questions[currentQuestionIndex].first_object_path)}
                              firstObjectBorder={firstObjectBorder}
                              secondObjectBorder={secondObjectBorder}
                              secondObjectImage={splitImagePath(questions[currentQuestionIndex].second_object_path)}/>
                          <ChoosingGameHandModule isChoosingGame={true} />
                        </div>
                        
                        ) : (
                        isGameOver ? (
                            <div>
                                <br></br>
                                <Alert variant={variant}>
                                    <Alert.Heading className='text-center'>
                                        {infoHand}
                                    </Alert.Heading>
                                </Alert>
                            </div>
                    ) : (
                        currentQuestionIndex === questions.length ? (
                          <div>
                                <br></br>
                                <Alert variant="light">
                                    <Alert.Heading className='text-center'>
                                          There are no question available for that game.
                                    </Alert.Heading>
                                </Alert>
                            </div>
                        ) : (
                            <></>
                        )
                    ))
                }
                </Col>
            </Row>
      </Container>
    </div>
  )
}