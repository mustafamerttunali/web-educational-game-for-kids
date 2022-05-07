import { GestureDescription, Finger, FingerCurl } from 'fingerpose';
  
const OneGesture = new GestureDescription('one'); //  👆  
const TwoGesture = new GestureDescription('two'); //  ✌️ 
const ThreeGesture = new GestureDescription('three'); //  3️⃣

// OneGesture
// -----------------
//  Index Finger:
OneGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

// Middle, Ring and Pinky Finger:
OneGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9);
OneGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);

OneGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);
OneGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);

OneGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);
OneGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);

// *********************************************************

// TwoGesture
// -----------------
// Index and Middle Finger
TwoGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
TwoGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
  
// ring: curled
TwoGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
TwoGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky: curled
TwoGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
TwoGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

// *********************************************************
// ThreeGesture
// -----------------
ThreeGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
ThreeGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
ThreeGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);


// Index and Thumbs Finger
ThreeGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
ThreeGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.9);
ThreeGesture.addCurl(Finger.Thumbs, FingerCurl.FullCurl, 1.0);
ThreeGesture.addCurl(Finger.Thumbs, FingerCurl.HalfCurl, 0.9);


export {
    OneGesture, TwoGesture, ThreeGesture
}