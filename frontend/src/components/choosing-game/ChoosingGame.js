import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import ChoosingGameHandModule from './ChoosingGameHandModule'

import { HandCoordinateContext } from "../hand-module/GestureContext"; 
import SecretNav from '../secret-nav/SecretNav';
import ChoosingGameQuestion from './ChoosingGameQuestion';
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
  }

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    if(handCoordinates !== null){
      const currentChoose = handCoordinates["coordinate"]["bottomRight"][0];
     
      if(handCoordinates["coordinate"]["select"]){
        // setInfoHand("Getting your answer... Please hold your hand!")
        // setVariant("info")
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
    else{
        // setInfoHand("Hand is not detected!")
        // setVariant("warning")
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
            setInfoHand("Correct!")
            setIsAnswerCorrect(true);
            setVariant("success")
            console.log("correct")
            // handleNextQuestion();
          }
          else{
            setInfoHand("Wrong!")
            setVariant("danger")
            console.log("wrong")
            setIsAnswerCorrect(false);
            // handleNextQuestion();
          }
          setIsAnswered(true);
        }
        else{
          setTimer(count);
          count--;
          console.log(userAnswer)
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [userAnswer]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevState => prevState + 1)
  }

  useEffect(() => {
    if(currentQuestionIndex === questions.length){
        // setTimer("");
        // if(coldStart){
        //     try {
        //         sendAnswers(userAnswers, "/math-game");   
        //     } catch (error) {
                
        //     }
        //     setIsGameOver(true);
        //     setInfoHand("Game is over! Redirecting to home page...");
        //     setVariant("info");
        // }
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
                                    {infoHand}{timer}
                          </Alert>
                          <ChoosingGameQuestion  questions={questions[currentQuestionIndex]} 
                            firstObjectImage={splitImagePath(questions[currentQuestionIndex].first_object_path)}
                            firstObjectBorder={firstObjectBorder}
                            secondObjectBorder={secondObjectBorder}
                            secondObjectImage={splitImagePath(questions[currentQuestionIndex].second_object_path)}/>
                          <ChoosingGameHandModule isChoosingGame={true} />
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
                        <h1>Loading...</h1> 
                        // TODO: Check if there are questions available
                        )
                    )
                }
                </Col>
            </Row>
      </Container>
    </div>
  )
}

{/* <Col md={4} className="text-center">
                    {isGameOver ? (
                        <div>
                            <p>Camera is closed.</p>
                        </div>
                        ) : questions.length > 0 ? ( 
                            <Card>
                                <Card.Body>
                                    <ChoosingGameHandModule isChoosingGame={true} />
                                    <br></br>
                                    <Button variant="outline-primary" size="lg" onClick={() => {
                                        // handleNextQuestion()
                                    }}> {buttonText}</Button>
                                </Card.Body>
                            </Card>
                        ) : (
                            <div>
                                <p>Camera is closed.</p>
                            </div>
                        )
                    }
                </Col> */}


{/* <Col md={12}>
                    {handCoordinates === null || handCoordinates === undefined ?
                        <div></div>
                        :
                        (
                    <Card className="text-center">
                        <Card.Header>Player: <strong>{user}</strong></Card.Header>
                        <Card.Body>
                                <Alert variant={variant}>
                                    {infoHand}{(handCoordinates === null || handCoordinates === undefined) && (isAnswered && isAnswerCorrect) && isGameOver? "" : " " + timer}
                                </Alert>
                        </Card.Body>
                    </Card>
                    )}
                </Col> */}
