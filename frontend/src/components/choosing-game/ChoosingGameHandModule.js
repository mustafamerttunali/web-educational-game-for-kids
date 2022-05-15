import React, { useRef, useState, useEffect } from "react";
import { HandCoordinateContext } from "../hand-module/GestureContext"; 

import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import {Container, Row, Col, Card } from "react-bootstrap";
import { drawHand } from "./utilities";

import * as fp from "fingerpose";
import two from "../hand-module/assets/two.png";
import three from "../hand-module/assets/three.png";
import one from "../hand-module/assets/one.png";
import four from "../hand-module/assets/four.png";
import five from "../hand-module/assets/five.png";

import { OneGesture, TwoGesture, ThreeGesture, FourGesture, FiveGesture } from '../hand-module/NumberGestures';

export default function ChoosingGameHandModule(props) {
        const webcamRef = useRef(null);
        const canvasRef = useRef(null);
        const [emoji, setEmoji] = React.useContext(HandCoordinateContext);
        const images = { one: one, two: two, three:three, four: four, five: five, undefined: null };
        let keyPoints = [];

        const style = {
            "correct": "1px solid limegreen",
            "incorrect": "1px solid red",
            "selected": "1px solid blue",
        }
    
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
                  TwoGesture,
                  FiveGesture
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

                    if (decisionGestureName !== undefined){
                        if(decisionGestureName === "five"){
                            if(props.isChoosingGame){
                                for (let i = 0; i < hand.length; i++) {
                                    keyPoints= hand[i].boundingBox;
                                    setEmoji({
                                        coordinate:{
                                            select: false,
                                            topLeft: keyPoints["topLeft"],
                                            bottomRight: keyPoints["bottomRight"]
                                        },
                                    });
                                }
                            }
                        }
                        else if(decisionGestureName === "two"){
                            let lastTakenPoint = keyPoints
                            // console.log("Last taken point:", lastTakenPoint["topLeft"], "Bottom right:", lastTakenPoint["bottomRight"]);
                            setEmoji({
                                coordinate:{
                                    select: true,
                                    topLeft: lastTakenPoint["topLeft"],
                                    bottomRight: lastTakenPoint["bottomRight"]
                                },
                            });
                        }
                        else{
                            setEmoji(null)
                        }
                    } else{
                        setEmoji(undefined)
                    }
                }

              }
              else
                {
                    setEmoji(null)
                }
              const ctx = canvasRef.current.getContext("2d");
              drawHand(hand, ctx);
            }
          };
        
        useEffect(()=>{
            runHandpose()
        },[]);

        useEffect(()=>{
            if(emoji !== null){
                // console.log(emoji["coordinate"]["select"])
            }
        },[emoji])


        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <canvas
                                ref={canvasRef}
                                style={{
                                    left: 0,
                                    right: 0,
                                    textAlign: "center",
                                    zindex: 9,
                                    width: "100%",
                                    height: 120,
                                }}
                            />
                             <Row className='d-flex justify-content-center'>
                                <Webcam
                                    ref={webcamRef}
                                    style={{
                                        textAlign: "center",
                                        zindex: 9999999,
                                        width: 240,
                                        height: 240,
                                    }}
                                />
                            </Row>
                        </Col>

                    </Row>
                </Container>
            </div>
        )
}