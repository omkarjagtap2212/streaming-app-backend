
const userVideo = document.getElementById("userVideo")
const startBtn = document.getElementById("startBtn")


const state = { media: null }

const socket = io()
startBtn.addEventListener("click", () => {
    const mediaReacorder = new MediaRecorder(state.media, {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        framerate: 25
    })
    mediaReacorder.ondataavailable = ev => {
        console.log("binary stream ready", ev.data)
        socket.emit('binaryStream',ev.data)

    }
    mediaReacorder.start(25)

})
window.addEventListener("load", async (e) => {

    const media = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,

    })
    state.media = media

    userVideo.srcObject = media
    // userVideo.play()
})