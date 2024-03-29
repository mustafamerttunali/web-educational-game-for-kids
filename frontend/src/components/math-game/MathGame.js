import React, { useEffect, useState, useReducer } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import HandModuleTest from "../hand-module/HandModuleTest";
import { GestureContext } from "../hand-module/GestureContext";
import SecretNav from "../secret-nav/SecretNav";
import MathQuestion from "./MathQuestion";
import { sendAnswers } from "../../utils/SendAnswers";

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
  const [isGameOver, setIsGameOver] = useState(false);
  const [variant, setVariant] = useState("warning");

  // Hash-Maps
  const numberHash = { one: 1, two: 2, three: 3, four: 4, five: 5 };
  const operatorHash = {
    "+": "plus.png",
    "-": "negative.png",
    "*": "cross.png",
    "/": "division.png",
  };
  const numberImageHash = {
    1: "one.png",
    2: "two.png",
    3: "three.png",
    4: "four.png",
    5: "five.png",
  };

  // Context
  const [gesture] = React.useContext(GestureContext);

  const setOperatorImage = (operator) => {
    return `assets/${operatorHash[operator]}`;
  };

  const setNumberImage = (number) => {
    return `assets/${numberImageHash[number]}`;
  };

  const getQuestions = async () => {
    try {
      const response = await fetch(API + "/math-game", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      console.log(data);
      setCurrentQuestionAnswer(data[currentQuestionIndex].correct_answer);
      setUser(data["player"]);
      const keys = Object.keys(data).filter(
        (key) => typeof data[key] === "object"
      );
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        setQuestions((prevState) => [...prevState, data[key]]);
        setUserAnswers((prevState) => {
          return {
            ...prevState,
            [key]: {
              first_number: data[key].first_number,
              second_number: data[key].second_number,
              operator: data[key].operator,
              correct_answer: data[key].correct_answer,
              user_answer: null,
              result: null,
            },
          };
        });
      }
      setInfoHand("");
      setVariant("");
    } catch (error) {
      console.log(error);
    }
    setColdStart(true);
  };

  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    const userAnswer = numberHash[gesture];
    setIsAnswerCorrect(false);
    setIsAnswered(false);
    setTimer("");

    let count = 2;
    if (gesture === null || gesture === undefined) {
      setInfoHand("El algılanmadı!");
      setVariant("warning");
      setIsAnswered(false);
      return;
    } else {
      setInfoHand("Cevabınız alınıyor... Elinizi sabit tutun! " + timer);
      setVariant("info");
    }

    const interval = setInterval(async () => {
      if (count === 0) {
        clearInterval(interval);
        if (userAnswer === currentQuestionAnswer) {
          setIsAnswerCorrect(true);
          setInfoHand(
            "Tebrikler! Doğru cevap. Diğer soruya yönlendiriliyorsunuz..."
          );
          setTimer("");
          setUserAnswers((prevState) => {
            return {
              ...prevState,
              [currentQuestionIndex]: {
                first_number: questions[currentQuestionIndex].first_number,
                second_number: questions[currentQuestionIndex].second_number,
                operator: questions[currentQuestionIndex].operator,
                correct_answer: questions[currentQuestionIndex].correct_answer,
                user_answer: userAnswer,
                result: true,
              },
            };
          });
          setVariant("success");
          setTimeout(() => {
            handleNextQuestion();
          }, 1500);
        } else {
          setInfoHand("Cevabınız alınıyor... Elinizi sabit tutun!" + timer);
          setIsAnswerCorrect(false);
          setTimer("");
          setInfoHand("Yanlış cevap! Sonraki soruya yönlendiriliyorsunuz...");
          setUserAnswers((prevState) => {
            return {
              ...prevState,
              [currentQuestionIndex]: {
                first_number: questions[currentQuestionIndex].first_number,
                second_number: questions[currentQuestionIndex].second_number,
                operator: questions[currentQuestionIndex].operator,
                correct_answer: questions[currentQuestionIndex].correct_answer,
                user_answer: userAnswer,
                result: false,
              },
            };
          });
          setVariant("danger");
          setTimeout(() => {
            handleNextQuestion();
          }, 1500);
        }
        setIsAnswered(true);
      } else {
        setTimer(count);
        count--;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gesture]);

  useEffect(() => {
    if (currentQuestionIndex === questions.length && userAnswers != "") {
      setTimer("");
      if (coldStart) {
        try {
          sendAnswers(userAnswers, "/math-game");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } catch (error) {}
        setIsGameOver(true);
        setInfoHand("Oyun bitti! Ana sayfaya yönlendiriliyorsunuz...");
        setVariant("info");
      }
    } else {
      try {
        setCurrentQuestionAnswer(
          questions[currentQuestionIndex].correct_answer
        );
      } catch (error) {}
    }
  }, [currentQuestionIndex]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevState) => prevState + 1);
    if (currentQuestionIndex === questions.length - 1 && userAnswers == "") {
      setInfoHand("Cevaplar bulunamadı! Ana sayfaya yönlendiriliyorsunuz...");
      setVariant("info");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    }
  };

  return (
    <div>
      <Container>
        <SecretNav user={user} />
        <Row className="d-flex justify-content-left">
          <Col md={12}>
            <h1 className="text-center">Math Game</h1>
            <hr></hr>
          </Col>
          <Col md={12}>
            {gesture === null || gesture === undefined ? (
              <div></div>
            ) : (
              <Card className="text-center">
                <Card.Header>
                  Player: <strong>{user}</strong>
                </Card.Header>
                <Card.Body>
                  <Alert variant={variant}>
                    {infoHand}
                    {(gesture === null || gesture === undefined) &&
                    isAnswered &&
                    isAnswerCorrect &&
                    isGameOver
                      ? ""
                      : " " + timer}
                  </Alert>
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col md={8}>
            {questions.length > 0 &&
            questions[currentQuestionIndex] !== undefined ? (
              <MathQuestion
                questions={questions}
                operator={setOperatorImage(
                  questions[currentQuestionIndex].operator
                )}
                firstNumber={setNumberImage(
                  questions[currentQuestionIndex].first_number
                )}
                secondNumber={setNumberImage(
                  questions[currentQuestionIndex].second_number
                )}
              />
            ) : currentQuestionIndex === questions.length ? (
              <div>
                <br></br>
                <Alert variant="light">
                  <Alert.Heading className="text-center">
                    {infoHand}
                  </Alert.Heading>
                </Alert>
              </div>
            ) : (
              <h1>Loading...</h1>
            )}
          </Col>
          <Col md={4} className="text-center">
            {isGameOver ? (
              <div>
                <p>Kamera kapalı..</p>
              </div>
            ) : questions.length > 0 ? (
              <Card>
                <Card.Body>
                  <HandModuleTest isChoosingGame={false} />
                  <br></br>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={() => {
                      handleNextQuestion();
                    }}
                  >
                    {" "}
                    {buttonText}
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <div>
                <p>Kamera kapalı. Sorular bulunamadı.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
