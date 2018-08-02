const ctracker = new clm.tracker();
ctracker.init();

ctracker.start(videoElement);
let positions = ctracker.getCurrentPosition();
let drawCanvas = document.getElementsById('myCanvas');
ctracker.draw(drawCanvas);

export default drawCanvas;
