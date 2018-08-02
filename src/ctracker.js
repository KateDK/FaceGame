// const ctracker = new clm.tracker();
// ctracker.init();

// ctracker.start(videoElement);
// let positions = ctracker.getCurrentPosition();
// let drawCanvas = document.getElementsById('myCanvas');
// ctracker.draw(drawCanvas);

// export default drawCanvas;
var video = document.getElementById('video');

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    video.src = window.URL.createObjectURL(stream);
    //video.play();
  });
}

var canvas = document.getElementById('canvas');
var videoInput = document.getElementById('video');
const ctracker = new clm.tracker();

//const videoInput = document.getElementById('inputVideo'); // console.log("********", clm)


ctracker.init();
ctracker.start(videoInput);


function positionLoop() {
  requestAnimationFrame(positionLoop);
  var positions = ctracker.getCurrentPosition(); //
  // console.log("Position 44", positions[44])
  // console.log("Position 50", positions[50])
  const position44 = positions[44][0];
  const position50 = positions[50][0];
  //console.log(position44)
  // positions = [[x_0, y_0], [x_1,y_1], ... ] //
  // do something with the positions ... //
  //trackMouth(position44, position50)

  const trackMouth = (position44, position44) => {
    const canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.lineTo(position44, position44);
    requestAnimationFrame(trackMouth);
    cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
    ctracker.draw(position44, position50);
  }
  trackMouth();

}
positionLoop();



const canvasInput = document.getElementById('canvas'); //
const cc = canvasInput.getContext('2d');

function drawLoop() {
  requestAnimationFrame(drawLoop);
  cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
  ctracker.draw(canvasInput);
}
drawLoop();
