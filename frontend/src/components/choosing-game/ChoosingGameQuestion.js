import React from "react";
import { Row, Col, Card } from "react-bootstrap";

export default function ChoosingGameQuestion(props) {
  const TR_OBJECTS = {
    car: "araba",
    banana: "muz",
    apple: "elma",
    boy: "erkek çocuk",
    bicycle: "bisiklet",
    cat: "kedi",
    chicken: "tavuk",
    cow: "inek",
    dog: "köpek",
    fish: "balık",
    girl: "kız çocuk",
    hat: "şapka",
    helicopter: "helikopter",
    kebab: "kebap",
    laptop: "dizüstü bilgisayar",
    meat: "et",
    plant: "bitki",
    plane: "uçak",
    robot: "robot",
    ship: "gemi",
    snake: "yılan",
    strawberry: "çilek",
    truck: "kamyon",
    tv: "televizyon",
    kebab: "kebap",
  };
  return (
    <div>
      <Col md={12}>
        <Card>
          <h1>
            Lütfen görüntüde{" "}
            <strong>"{TR_OBJECTS[props.questions.correct_object]}"</strong>{" "}
            seçin.
          </h1>
          <br></br>
          <Row>
            <Col md={6}>
              <Card.Img
                className="mx-auto d-block"
                variant="center"
                src={props.firstObjectImage}
                style={{
                  height: "160px",
                  width: "80%",
                  border: props.firstObjectBorder,
                }}
              />
            </Col>
            <Col md={6}>
              <Card.Img
                className="mx-auto d-block"
                variant="center"
                src={props.secondObjectImage}
                style={{
                  height: "160px",
                  width: "60%",
                  border: props.secondObjectBorder,
                }}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </div>
  );
}
