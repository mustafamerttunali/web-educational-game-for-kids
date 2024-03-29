import React, { useEffect, useState } from "react";

import { Container, Row, Col, Card } from "react-bootstrap";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import SecretNav from "../secret-nav/SecretNav";

import Apple from "../../images/apple.png";
import Robot from "../../images/robot.png";
import Boy from "../../images/boy.png";

import "./Dashboard.css";

const API = process.env.REACT_APP_API;

export default function Dashboard() {
  const [user, setUser] = useState("");
  const [countGamePercentage, setCountGamePercentage] = useState(0);
  const [mathGamePercentage, setMathGamePercentage] = useState(0);
  const [choosingGamePercentage, setChoosingGamePercentage] = useState(0);
  const percentage = 66;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(API + "/dashboard", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data["status"] !== 200) {
            window.location.href = "/login";
          } else {
            console.log(data);
            setUser(data["child_first_name"]);
            let totalChooseGame = data["total_choose_game"];
            let totalMathGame = data["total_math_game"];
            let totalCountGame = data["total_count_game"];

            setCountGamePercentage(
              ((totalCountGame[1] / totalCountGame[0]) * 100).toFixed(0)
            );
            setMathGamePercentage(
              ((totalMathGame[1] / totalMathGame[0]) * 100).toFixed(0)
            );
            setChoosingGamePercentage(
              ((totalChooseGame[1] / totalChooseGame[0]) * 100).toFixed(0)
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div>
      <Container>
        <Row className="d-flex justify-content-center">
          <SecretNav user={user} />
          <Col md={12}>
            <h1 className="text-center">Panel</h1>
            <hr></hr>
          </Col>

          <Col md={12}>
            <Card className="text-center">
              <Card.Header>
                Çocuklar için Web Tabanlı Eğitim Oyununa Hoşgeldiniz!,{" "}
                <strong>{user}</strong>
              </Card.Header>
              <Card.Body>
                <Card.Title>
                  TEKNOFEST 2023 - Eğitim Teknolojileri Yarışması{" "}
                </Card.Title>
                <Card.Text>
                  Bilgisayarlı Görü ve Ses Tanıma teknolojileriyle çocuklara
                  oyunlar aracılığıyla eğitim veren bir platformdur.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img
                className="mx-auto d-block"
                variant="center"
                src={Apple}
                style={{ height: "120px", width: "30%" }}
              />
              <Card.Body className="text-center">
                <Card.Title className="text-center">Sayma Oyunu</Card.Title>
                <Card.Text className="text-justify">
                  Sayma Oyunu, hayatımızda sıklıkla kullandığımız nesneleri
                  kullanarak çocuklara saymayı öğretir
                  <br></br>
                  <br></br>
                </Card.Text>
                <a href="/count-game" className="btn btn-primary">
                  Oyna
                </a>
                <br></br>
                <br></br>
                <CircularProgressbar
                  value={countGamePercentage}
                  text={`${countGamePercentage}%`}
                  style={{ height: "100px" }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img
                className="mx-auto d-block"
                id="kidImage"
                variant="center"
                src={Robot}
                style={{ height: "120px", width: "30%" }}
              />
              <Card.Body className="text-center">
                <Card.Title className="text-center">Matematik Oyunu</Card.Title>
                <Card.Text className="text-justify">
                  Matematik Oyunu, çocuklara basit sayılarla toplama, çıkarma,
                  çarpma ve bölmeyi öğretmeyi amaçlar.
                </Card.Text>
                <a href="/math-game" className="btn btn-primary text-center">
                  Oyna
                </a>
                <br></br>
                <br></br>
                <CircularProgressbar
                  value={mathGamePercentage}
                  text={`${mathGamePercentage}%`}
                  style={{ height: "100px" }}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Img
                className="mx-auto d-block"
                variant="center"
                src={Boy}
                style={{ height: "120px", width: "20%" }}
              />
              <Card.Body className="text-center">
                <Card.Title className="text-center">Seçme Oyunu</Card.Title>
                <Card.Text>
                  Seçme oyunu, küçük çocuklara hayatımızda sıklıkla kullanılan
                  nesneleri öğretmeyi amaçlar.
                  <br></br>
                  <br></br>
                </Card.Text>
                <a
                  href="/choosing-game"
                  className="btn btn-primary text-center"
                >
                  Oyna
                </a>
                <br></br>
                <br></br>
                <CircularProgressbar
                  className="primary"
                  value={choosingGamePercentage}
                  text={`${choosingGamePercentage}%`}
                  style={{ height: "100px" }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
