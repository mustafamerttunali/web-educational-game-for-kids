import React, { useEffect, useState, useReducer } from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import HandModuleTest from '../hand-module/HandModuleTest';
import { GestureContext } from '../hand-module/GestureContext';
import SecretNav from '../secret-nav/SecretNav';
import MathQuestion from './MathQuestion';
import { sendAnswers } from '../../utils/SendAnswers';

const API = process.env.REACT_APP_API;

export default function MathGame() {
    const [user, setUser] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState(0);
    const [buttonText, setButtonText] = useState("Next Question");
    const [userAnswers, setUserAnswers] = useState("");
    const [infoHand, setInfoHand] = useState("");
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timer, setTimer] = useState(0);
    const [coldStart, setColdStart] = useState(false);

    // Hash-Maps
    const numberHash = { one: 1, two: 2, three: 3, four: 4, five: 5 };

    // Context
    const [gesture] = React.useContext(GestureContext);

    const splitImagePath = (imagePath) => {
        const split = imagePath.split("/");
        const imageName = split[split.length - 1];
        const finalPath =  `images/${imageName}`;
        return finalPath;
    }

    const getQuestions = async () => {
        try{
            const response = await fetch(API + '/math-game', {
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
        }
        catch(error){
            console.log(error);
        }
        setColdStart(true);
    }

    // get Questions at the beginning
    useEffect(() => {
        getQuestions()
    }, [])

    useEffect(() => {
        const userAnswer = numberHash[gesture];
        setIsAnswerCorrect(false);
        setIsAnswered(false);
        setTimer("");
        
        let count = 2;
        if(gesture === null || gesture === undefined){
            setInfoHand("Hand is not detected!");
            setIsAnswered(false);
            return;
        }
        else{
            setInfoHand("Getting your answer... Please hold your hand!");
        }

        const interval = setInterval(async () => {
            if(count === 0){
                clearInterval(interval);
                if(userAnswer === currentQuestionAnswer){
                    setIsAnswerCorrect(true);
                    setInfoHand("Congrats! Your answer is correct! Redirecting to next question...");
                    setUserAnswers(prevState => {
                        return {
                            ...prevState, [currentQuestionIndex]: {
                                "first_number": questions[currentQuestionIndex].first_number,
                                "second_number": questions[currentQuestionIndex].second_number,
                                "operator": questions[currentQuestionIndex].operator,
                                "correct_answer": questions[currentQuestionIndex].correct_answer,
                                "user_answer": userAnswer,
                                "result": true,
                            }
                        };
                    })
                    handleNextQuestion();
                }
                else{
                    setIsAnswerCorrect(false);
                    setInfoHand("Sorry! Your answer is incorrect! Redirecting to next question...");
                    setUserAnswers(prevState => {
                        return {
                            ...prevState, [currentQuestionIndex]: {
                                "first_number": questions[currentQuestionIndex].first_number,
                                "second_number": questions[currentQuestionIndex].second_number,
                                "operator": questions[currentQuestionIndex].operator,
                                "correct_answer": questions[currentQuestionIndex].correct_answer,
                                "user_answer": userAnswer,
                                "result": false,
                            }
                        };
                    })
                    handleNextQuestion()
                }
                setIsAnswered(true);
            }
            else{
                setTimer(count);
                count--;
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [gesture])

    useEffect(() => {
        console.log(userAnswers)
        if(currentQuestionIndex === questions.length){
            if(coldStart){
                sendAnswers(userAnswers, `/math-game`);
            }
        }else{
            try {
                setCurrentQuestionAnswer(questions[currentQuestionIndex].correct_answer);
            } catch (error) {
                
            }
        }
    }, [currentQuestionIndex])

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevState => prevState + 1)
        if(currentQuestionIndex === questions.length - 2 ){
            setButtonText("Finish");
        }
    }

  return (
    <div>
        <Container>
            <SecretNav user={user}/>
            <Row className='d-flex justify-content-left'>
                <Col md={12}>
                    <h1 className='text-center'>Counting Game</h1>
                    <hr></hr>
                </Col>
                <Col md={12}>
                    <Card className="text-center">
                        <Card.Header>Player: <strong>{user}</strong></Card.Header>
                        <Card.Body>
                                {

                                    isAnswered ?
                                        (
                                       isAnswerCorrect ?
                                            <Alert variant="success">
                                                {infoHand}
                                            </Alert>
                                        :
                                            <Alert variant="danger">
                                                {infoHand}
                                            </Alert>
                                        )
                                    :
                                        (
                                            gesture === null ? (
                                                <Alert  variant={"warning"}>
                                                    {infoHand}
                                                </Alert>
                                            ) : (
                                                <Alert  variant={"primary"}>
                                                    {infoHand}: {timer}
                                                </Alert>
                                            )
                                        )
                                }
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>

                {
                    questions.length > 0 && questions[currentQuestionIndex] !== undefined ? (
                        <MathQuestion  questions={questions} 
                                    currentQuestionIndex={currentQuestionIndex}
                                    />
                        ) : (
                        currentQuestionIndex === questions.length ? (
                            <div>
                                <br></br>
                                <Alert variant="info">
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
                <Col md={4} className="text-center">
                    <Card>
                        <Card.Body>
                            <HandModuleTest/>
                            <br></br>
                            <Button variant="outline-primary" size="lg" onClick={() => {
                                handleNextQuestion()
                            }}> {buttonText}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </div>
  )
}