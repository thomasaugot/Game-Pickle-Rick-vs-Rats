let board = document.getElementById("board");
let lives = 1;

// Show spinner for 3 seconds before showing landing page
const loadingDiv = document.getElementById("loading");
const landingPageDiv = document.getElementById("landing-page");

setTimeout(() => {
  loadingDiv.style.display = "none";
  landingPageDiv.style.display = "block";
}, 3000);

// launching the game

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", (e) => {
  startGame();
});

function startGame() {
  const instructionsPage = document.getElementById("landing-page");
  instructionsPage.remove();
  displayScoreBar();
  createRick();
  createRat();
  initIntervals();
  printScore();
}

//creating my player

const rick = {
  positionX: 0,
  positionY: 47,
  width: 9,
  height: 19,
  speedY: 6,
};
const rickDomElement = document.createElement("div");

function createRick() {
  rickDomElement.id = "rick-player";
  rickDomElement.style.height = rick.height + "vh";
  rickDomElement.style.width = rick.width + "vw";
  rickDomElement.style.bottom = rick.positionY + "vh";
  rickDomElement.style.left = rick.positionX + "vw";
  const parentElm = document.getElementById("board");
  parentElm.appendChild(rickDomElement);
} // function is called at line 22

// adding event listeners

document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp" && rick.positionY <= 100 - rick.height) {
    rick.positionY += rick.speedY;
    rickDomElement.style.bottom = rick.positionY + "vh";
  } else if (e.key == "ArrowDown" && rick.positionY >= 0) {
    rick.positionY -= rick.speedY;
    rickDomElement.style.bottom = rick.positionY + "vh";
  } else if (e.key == " ") {
    shoot();
  }
});

// setting intervals
let elapsedTime = 0; // variable to keep track of the time elapsed since the game started
let currentLevel = 1;
let speedIncrease = 1; // setting the initial speed to one time

function initIntervals() {
  setInterval(() => {
    createRat();
  }, 600);

  setInterval(() => {
    elapsedTime += 200; // update the elapsed time every 200ms
    if (elapsedTime % 10000 === 0) {
      // if 10 seconds have passed
      ratsArray.forEach((rat) => {
        rat.speedX += speedIncrease * 1.5; // increase the speed increase factor by 20% after each level
      });
      currentLevel++;
      console.log(`level ${currentLevel}`);
      let levelMessage = document.createElement("div");
      levelMessage.id = "level-message";
      levelMessage.innerHTML = `Level ${currentLevel}`;
      document.getElementById("board").appendChild(levelMessage);

      setTimeout(() => {
        levelMessage.innerHTML = "";
      }, 2000);
    }
    printScore();
    ratsArray.forEach((ratObject) => {
      moveRats(ratObject);
      removeRats(ratObject);
      detectRatCollision(ratObject);
    });
  }, 200);
}

// creating rats

const ratsArray = [];

function createRat() {
  const ratDomElement = document.createElement("div");
  ratDomElement.className = "rats";

  const rat = {
    height: 10,
    width: 8,
    positionX: 100,
    positionY: Math.floor(Math.random() * 80),
    speedX: 2,
    domElement: ratDomElement,
  };

  ratDomElement.style.height = rat.height + "vh";
  ratDomElement.style.width = rat.width + "vw";
  ratDomElement.style.bottom = rat.positionY + "vh";
  ratDomElement.style.left = rat.positionX + "vw";

  const parentElm = document.getElementById("board");
  parentElm.appendChild(ratDomElement);

  ratsArray.push(rat);

  // function is called at line 23
}

function moveRats(ratInstance) {
  const currentSpeed = ratInstance.speedX + speedIncrease;
  ratInstance.positionX -= currentSpeed;
  ratInstance.domElement.style.left = ratInstance.positionX + "vw";
}

// removing escaped rats

function removeRats(ratInstance) {
  if (ratInstance.positionX <= 0 - ratInstance.width) {
    ratInstance.domElement.remove();
    ratsArray.shift();
    lives--;
    printScore();
    if (lives <= 0) {
      location.href = "./game-over.html";
    }
    return true;
  }
}

// detect collisions between rats and rick

function detectRatCollision(ratInstance) {
  if (
    rick.positionX < ratInstance.positionX + ratInstance.width &&
    rick.positionX + rick.width > ratInstance.positionX &&
    rick.positionY < ratInstance.positionY + ratInstance.height &&
    rick.height + rick.positionY > ratInstance.positionY
  ) {
    location.href = "./game-over.html";
  }
}

const bulletsArray = [];

function shoot() {
  // Remove the oldest bullet if the max number of bullets is reached
  const maxBullets = 10;

  if (bulletsArray.length >= maxBullets) {
    bulletsArray[0].domElement.remove();
    bulletsArray.shift();
  }

  // creating my bullets

  const bulletDomElement = document.createElement("div");
  bulletDomElement.className = "bullet";

  const bullet = {
    height: 10,
    width: 8,
    speedX: 10,
    positionY: rick.positionY + rick.width / 2,
    positionX: rick.positionX + rick.width / 2 + 3, //+3 so the bullet doesn't start in the middle of my player
    domElement: bulletDomElement,
  };

  bulletDomElement.style.height = bullet.height + "vh";
  bulletDomElement.style.width = bullet.width + "vw";
  bulletDomElement.style.bottom = bullet.positionY + "vh";
  bulletDomElement.style.left = bullet.positionX + "vw";

  const parentElm = document.getElementById("board");
  parentElm.appendChild(bulletDomElement);

  bulletsArray.push(bullet);
  // the function shoot() is called within the event listeners ' '
}

// removing bullets out of screen

setInterval(() => {
  bulletsArray.forEach((bulletObject, bulletIndex) => {
    bulletObject.positionX += bulletObject.speedX;
    bulletObject.domElement.style.left = bulletObject.positionX + "vw";
    removeBullets(bulletObject);
    ratsArray.forEach((ratObject, ratIndex) => {
      detectBulletCollision(bulletObject, ratObject, bulletIndex, ratIndex);
    });
  });
}, 50);

function removeBullets(bulletInstance) {
  if (bulletInstance.positionX >= 100 - bulletInstance.width) {
    bulletInstance.domElement.remove();
    bulletsArray.splice(bulletsArray.indexOf(bulletInstance), 1);
  }
}

// detecting bullets & rats collision

function detectBulletCollision(bulletInstance, ratInstance, bulletIndex, ratIndex) {
  if (
    ratInstance.positionX * 1.2 < bulletInstance.positionX + bulletInstance.width &&
    ratInstance.positionX * 1.2 + ratInstance.width > bulletInstance.positionX &&
    ratInstance.positionY < bulletInstance.positionY + bulletInstance.height &&
    ratInstance.height + ratInstance.positionY > bulletInstance.positionY
  ) {
    bulletInstance.domElement.remove();
    bulletsArray.splice(bulletIndex, 1);
    ratInstance.domElement.remove();
    ratsArray.splice(ratIndex, 1);
    ratInstance.domElement.remove();
    lives++;
    printScore();
    return true;
  }
}

// calculate score

function displayScoreBar() {
  const scoreBar = document.createElement("div");
  scoreBar.id = "scoreBar";
  scoreBar.style.height = 25 + "vh";
  scoreBar.style.width = 25 + "vw";
  scoreBar.style.bottom = 71 + "vh";
  scoreBar.style.left = 85 + "vw";
  scoreBar.style.color = "white";
  scoreBar.style.fontSize = 30 + "px";
  scoreBar.style.position = "absolute";
  const parentElement = document.getElementById("board");
  parentElement.appendChild(scoreBar);
}

function printScore() {
  let score = `
    <div style='position: absolute; left: 20px';>
      <p>Score</p>
      <p>${lives}</p>
    </div>
  `;
  document.getElementById("scoreBar").innerHTML = score;
}

// mute or unmute sound

function toggleMuted() {
  let sound = document.getElementById("sound");
  sound.muted = !sound.muted;
}
