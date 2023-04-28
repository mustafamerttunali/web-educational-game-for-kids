import React, { useRef, useState, useEffect } from "react";
import { GestureContext } from "./GestureContext";

import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { Container, Row, Col, Card } from "react-bootstrap";
import { drawHand } from "./utilities";

import * as fp from "fingerpose";
import two from "./assets/two.png";
import three from "./assets/three.png";
import one from "./assets/one.png";
import four from "./assets/four.png";
import five from "./assets/five.png";

import {
  OneGesture,
  TwoGesture,
  ThreeGesture,
  FourGesture,
  FiveGesture,
} from "./NumberGestures";

export default function HandModuleTest(props) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [emoji, setEmoji] = React.useContext(GestureContext);
  const images = {
    one: one,
    two: two,
    three: three,
    four: four,
    five: five,
    undefined: null,
  };

  const runHandpose = async () => {
    try {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      setInterval(() => {
        detect(net);
      }, 10);
    } catch {
      console.log("Error");
    }
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      video.style.transform = "scale(-1, 1)";

      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video, true);

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          OneGesture,
          TwoGesture,
          ThreeGesture,
          FourGesture,
          FiveGesture,
        ]);

        const MAX_THRESHOLD = 9;
        const gesture = await GE.estimate(hand[0].landmarks, MAX_THRESHOLD);

        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          let decisionGestureName = undefined;
          // console.log(gesture.gestures)
          // console.log(arr)
          const maxConfidence = gesture.gestures.reduce(
            (acc, curr) => (acc.score > curr.score ? acc : curr),
            { confidence: 0 }
          );
          decisionGestureName = maxConfidence.name;
          if (decisionGestureName !== undefined) {
            setEmoji(decisionGestureName);
          } else {
            setEmoji(undefined);
          }
        }

        if (props.isChoosingGame) {
          for (let i = 0; i < hand.length; i++) {
            const keypoints = hand[i].boundingBox;
            console.log(
              "Top left:",
              keypoints["topLeft"],
              "Bottom right:",
              keypoints["bottomRight"]
            );
          }
        }
      } else {
        setEmoji(null);
      }
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    try {
      runHandpose();
    } catch {
      console.log("Handpose error.");
    }
  }, []);

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Row className="d-flex justify-content-center">
              <Webcam
                ref={webcamRef}
                style={{
                  textAlign: "center",
                  zindex: 9,
                  width: 320,
                  height: 240,
                }}
              />
            </Row>

            <canvas
              ref={canvasRef}
              style={{
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 320,
                height: 240,
              }}
            />
            {emoji !== null ? (
              <Row className="d-flex justify-content-center">
                <Card.Img
                  src={images[emoji]}
                  style={{
                    textAlign: "center",
                    height: 100,
                    width: "50%",
                  }}
                />
              </Row>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
