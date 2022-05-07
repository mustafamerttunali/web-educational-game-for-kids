// TODO: Solve OOP problem with this component

class HandModule   {
    constructor(webcam, canvas) {
        this.state = {
            emoji: null
        }
        this.webcam = webcam
        this.canvas = canvas
    }

    componentDidMount() {
        console.log("HandModule mounted.", this.webcam, this.canvas)
    }
}