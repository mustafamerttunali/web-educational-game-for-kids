import React, { useRef, useState, useEffect } from "react";

import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import {Container, Row, Col} from "react-bootstrap";
import { drawHand } from "./utilities";

import * as fp from "fingerpose";
import two from "./two.png";
import one from "./one.png";
import three from "./three.png";

import { OneGesture, TwoGesture, ThreeGesture } from './NumberGestures';


export default function HandModule() {
        const webcamRef = useRef(null);
        const canvasRef = useRef(null);
        const [emoji, setEmoji] = useState(null);
        const images = { one: one, two: two, three:three };

        const runHandpose = async () => {
            const net = await handpose.load();
            console.log("Handpose model loaded.");
            setInterval(() => {
              detect(net);
            }, 10);
          };
        
        const detect = async (net) => {
            if (
              typeof webcamRef.current !== "undefined" &&
              webcamRef.current !== null &&
              webcamRef.current.video.readyState === 4
            ) {
              // Get Video Properties
              const video = webcamRef.current.video;
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
                  ThreeGesture
                ]);

                const MAX_THRESHOLD = 7;
                const gesture = await GE.estimate(hand[0].landmarks, MAX_THRESHOLD);

                if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
                    let decisionGestureName = undefined;
                    const maxConfidence = gesture.gestures.reduce(
                        (acc, curr) => (acc.score > curr.score ? acc : curr),
                        { confidence: 0 }
                    );
                    decisionGestureName = maxConfidence.name;
                    if (decisionGestureName !== undefined){
                        setEmoji(decisionGestureName) 
                    }
                }
              }
              const ctx = canvasRef.current.getContext("2d");
              drawHand(hand, ctx);
            }
          };
        
        useEffect(()=>{
            runHandpose()
        },[]);

        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <Webcam
                                ref={webcamRef}
                                style={{
                                    position: "absolute",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    left: 0,
                                    right: 0,
                                    textAlign: "center",
                                    zindex: 9,
                                    width: 640,
                                    height: 480,
                                }}
                            />

                            <canvas
                            ref={canvasRef}
                            style={{
                                position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: 0,
                                right: 0,
                                textAlign: "center",
                                zindex: 9,
                                width: 640,
                                height: 480,
                            }}
                            />
                            {emoji !== null ? (
                            <img
                                src={images[emoji]}
                                style={{
                                position: "absolute",
                                marginLeft: "auto",
                                marginRight: "auto",
                                left: 400,
                                bottom: 500,
                                right: 0,
                                textAlign: "center",
                                height: 100,
                                }}
                            />
                            ) : (
                            ""
                            )}
                        </Col>
                    </Row>
                </Container>
                Test
            </div>
        )
}