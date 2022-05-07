import { GestureDescription, Finger, FingerCurl, FingerDirection } from 'fingerpose';
  
const OneGesture   = new GestureDescription('one');    //  👆  
const TwoGesture   = new GestureDescription('two');    //  ✌️ 
const ThreeGesture = new GestureDescription('three');  //  3️⃣
const FourGesture  = new GestureDescription('four');   //  4️⃣
const FiveGesture  = new GestureDescription('five');    //  5️⃣

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

// *********************************************************
// FourGesture
// -----------------
FourGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
FourGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
FourGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
FourGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);

FourGesture.addCurl(Finger.Thumbs, FingerCurl.HalfCurl, 0.9);
FourGesture.addCurl(Finger.Thumbs, FingerCurl.FullCurl, 1.0);

// *********************************************************
// FiveGesture
// -----------------
// FiveGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
// FiveGesture.addCurl(Finger.Thumbs, Finger.NoCurl, 1.0);
// FiveGesture.addCurl(Finger.Ring, FingerCurl.NoCurl, 1.0);
// FiveGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 1.0);
// FiveGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);

// FiveGesture.addCurl(Finger.Thumbs, Finger.HalfCurl, 0.9);
// FiveGesture.addCurl(Finger.Thumbs, Finger.FullCurl, 1.0);
// FiveGesture.addCurl(Finger.Index, Finger.HalfCurl, 0.9);
// FiveGesture.addCurl(Finger.Index, Finger.FullCurl, 1.0);
// FiveGesture.addCurl(Finger.Ring, Finger.HalfCurl, 0.9);
// FiveGesture.addCurl(Finger.Ring, Finger.FullCurl, 1.0);
// FiveGesture.addCurl(Finger.Pinky, Finger.HalfCurl, 0.9);
// FiveGesture.addCurl(Finger.Pinky, Finger.FullCurl, 1.0);
// FiveGesture.addCurl(Finger.Middle, Finger.HalfCurl, 0.9);
// FiveGesture.addCurl(Finger.Middle, Finger.FullCurl, 1.0);

export {
    OneGesture, TwoGesture, ThreeGesture, FourGesture, FiveGesture
}