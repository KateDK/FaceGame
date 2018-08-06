const MS_IN_SECOND = 1000;

const INITIAL_TIME = 30 * MS_IN_SECOND;

const MOUTH_POINTS = [44, 50, 60, 57];

const ITEM_RADIUS = 30;

const FOOD_TIMER = 3 * MS_IN_SECOND;

const BOMB_TIMER_INITIAL = 15 * MS_IN_SECOND;

const BOMB_TIMER = 7 * MS_IN_SECOND;

const BOMB_EXPIRATION = 10 * MS_IN_SECOND;

const RED_EXPIRATION = 7 * MS_IN_SECOND;

const GREEN_EXPIRATION = 3 * MS_IN_SECOND;

const RED_POINTS = 5;

const GREEN_POINTS = 10;

const BOMB_POINTS = -20;

const INITIAL_STATE = {
  timeLeft: INITIAL_TIME,
  points: 0,
  foodItems: [],
  bombsEaten: 0,
  gameOver: false,
  timers: [],
  lives: 3,
  explosions: [],
};

const apple = new Image();
apple.src = 'AppleResized.png';
const kiwi = new Image();
kiwi.src = 'KiwiResized.png';
const bomb = new Image();
bomb.src = 'BombResized.png';
const life = new Image();
life.src = 'LifeResized.png';
const explosionSprites = new Image();
explosionSprites.src = 'explosion.png';
const boom = new sound('Canoon.mp3');
const chomp = new sound('Chomp.mp3');
const bite = new sound('Bite.mp3');
const loose = new sound('End.mp3');

const video = document.getElementById('video');
// Get access to the camera
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Not adding `{ audio: true }` since we only want video now
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.src = window.URL.createObjectURL(stream);
  });
}

const ctracker = new clm.tracker({ faceDetection: { useWebWorkers: true } });

ctracker.init();
ctracker.start(video);

const canvasInput = document.getElementById('canvas'); //
const cc = canvasInput.getContext('2d');

let state = {
  ...INITIAL_STATE,
};

const renderHTML = () => {
  document.getElementById('points').innerHTML = `Points:  ${state.points}`;
  if (state.gameOver) {
    document.getElementById('timer').innerHTML = 'GAME OVER!!!';
  } else {
    document.getElementById(
      'timer'
    ).innerHTML = `Time Remaining: ${state.timeLeft / MS_IN_SECOND}`;
  }
};
//food item: {x:0,y:0,points:0,color:""}

function drawLoop() {
  requestAnimationFrame(drawLoop);
  cc.clearRect(0, 0, canvasInput.width, canvasInput.height);

  checkEat();

  //draw explosion sprite animation
  state.explosions.forEach(explosion => {
    let explosionX = (explosion.frame % 8) * 60;
    let explosionY = Math.floor(explosion.frame / 8) * 60;
    let dx = explosion.x - ITEM_RADIUS;
    let dy = explosion.y - ITEM_RADIUS;
    cc.drawImage(
      explosionSprites,
      explosionX,
      explosionY,
      60,
      60,
      dx,
      dy,
      60,
      60
    );
  });

  //draw food and bomb items
  state.foodItems.forEach(item => {
    cc.drawImage(
      item.img,
      item.x - ITEM_RADIUS,
      item.y - ITEM_RADIUS,
      ITEM_RADIUS * 2,
      ITEM_RADIUS * 2
    );
  });

  //draw lives
  for (let i = 0; i < state.lives; i++) {
    cc.drawImage(life, 40 * i, 0);
  }
}

drawLoop();

function dist(x1, y1, x2, y2) {
  let x = Math.abs(x2 - x1);
  let y = Math.abs(y2 - y1);
  return Math.sqrt(x * x + y * y);
}

function checkEat() {
  let positions = ctracker.getCurrentPosition(); //
  if (!positions) {
    return;
  }
  let eat = false;
  state.foodItems.forEach(item => {
    for (let index of MOUTH_POINTS) {
      let distance = dist(
        positions[index][0],
        positions[index][1],
        item.x,
        item.y
      );
      if (distance < item.radius) {
        item.touchingMouth = true;
        eat = true;
      }
    }

    if (item.touchingMouth) {
      state = {
        ...state,
        points: state.points + item.points,
        timeLeft: state.timeLeft + item.points * MS_IN_SECOND,
      };
      if (item.isBomb) {
        state = {
          ...state,
          bombsEaten: state.bombsEaten + 1,
          lives: state.lives - 1,
          explosions: [...state.explosions, { frame: 0, x: item.x, y: item.y }],
        };

        if (state.bombsEaten >= 3) {
          gameOver();
        }
      }
      item.sound.play();
      renderHTML();
    }
  });
  if (eat) {
    clearItems();
  }
}

const createItem = (img, experationFromNow, points, sound, isBomb) => {
  let x =
    Math.floor(Math.random() * (canvas.width - ITEM_RADIUS * 2)) + ITEM_RADIUS;
  let y =
    Math.floor(Math.random() * (canvas.height - ITEM_RADIUS * 3)) +
    ITEM_RADIUS * 2;
  newItem = {
    x,
    y,
    touchingMouth: false,
    radius: ITEM_RADIUS,
    img,
    experation: Date.now() + experationFromNow,
    points,
    sound,
    isBomb,
  };
  state = { ...state, foodItems: [...state.foodItems, newItem] };
  startTimeOut(clearItems, experationFromNow);
};

const foodGenerator = () => {
  startTimeOut(foodGenerator, FOOD_TIMER);
  let color = Math.random() > 0.25 ? 'red' : 'green';
  let experation = color === 'red' ? RED_EXPIRATION : GREEN_EXPIRATION;
  let points = color === 'red' ? RED_POINTS : GREEN_POINTS;
  let img = color === 'red' ? apple : kiwi;
  let sound = color === 'red' ? bite : chomp;
  const isBomb = false;
  createItem(img, experation, points, sound, isBomb);
};

const bombGenerator = () => {
  startTimeOut(bombGenerator, BOMB_TIMER);
  const sound = boom;
  const isBomb = true;
  createItem(bomb, BOMB_EXPIRATION, BOMB_POINTS, sound, isBomb);
};

const clearItems = () => {
  let now = Date.now();
  let filteredItems = state.foodItems.filter(
    item => item.experation >= now && !item.touchingMouth
  );
  state = { ...state, foodItems: filteredItems };
};

function timerCountDown() {
  startTimeOut(timerCountDown, MS_IN_SECOND);
  state = { ...state, timeLeft: state.timeLeft - MS_IN_SECOND };
  renderHTML();
  if (state.timeLeft <= 0) {
    gameOver();
  }
}

function explosionTimer() {
  startTimeOut(explosionTimer, 20);
  let newExplosions = [...state.explosions];
  newExplosions.forEach(explosion => {
    explosion.frame = explosion.frame + 1;
  });
  newExplosions = newExplosions.filter(explosion => explosion.frame < 48);
  state = { ...state, explosions: newExplosions };
}

function gameOver() {
  state = { ...state, gameOver: true, foodItems: [], explosions: [] };
  clearTimers();
  renderHTML();
  loose.play();
}

const startGame = () => {
  clearTimers();
  state = { ...INITIAL_STATE };
  renderHTML();
  foodGenerator();
  startTimeOut(bombGenerator, BOMB_TIMER_INITIAL);
  startTimeOut(timerCountDown, MS_IN_SECOND);
  startTimeOut(explosionTimer, 100);
};

document.getElementById('startGame').addEventListener('click', startGame);

function startTimeOut(func, timeout) {
  let timerId = window.setTimeout(func, timeout);
  state = { ...state, timers: [...state.timers, timerId] };
}

function clearTimers() {
  state.timers.forEach(timerId => window.clearTimeout(timerId));
  state = { ...state, timers: [] };
}

function sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  };
  this.stop = function() {
    this.sound.pause();
  };
}
