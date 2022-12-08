let board = document.getElementById("board");
let lives = 1;

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

// launching the game

const startButton = document.getElementById("start-button")
startButton.addEventListener("click", (e) => {
  startGame();
});

function startGame() {
  const instructionsPage = document.getElementById("landing-page");
  instructionsPage.remove();
  displayScoreBar();
  createRick();
  createRat();
  intervalLevelOne();
  printScore()
}

//creating my player

const rickDomElement = document.createElement("div");

const rick = {
  positionX: 0,
  positionY: 47,
  width: 9,
  height: 19,
  speedY: 6,
};

function createRick() {
  rickDomElement.id = "rick-player";
  rickDomElement.style.height = rick.height + "vh";
  rickDomElement.style.width = rick.width + "vw";
  rickDomElement.style.bottom = rick.positionY + "vh";
  rickDomElement.style.left = rick.positionX + "vw";
  const parentElm = document.getElementById("board");
  parentElm.appendChild(rickDomElement);
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
}

function moveRats(ratInstance) {
  ratInstance.positionX -= ratInstance.speedX;
  ratInstance.domElement.style.left = ratInstance.positionX + "vw";
}

// removing escaped rats

function removeRats(ratInstance) {
  if (ratInstance.positionX <= 0 - ratInstance.width) {
    ratInstance.domElement.remove();
    ratsArray.shift();
    lives--;
    printScore()
    if(lives <=0){
      location.href = "./game-over.html";
    }
    return true;
  }
}

// setting intervals

function intervalLevelOne() {
  setInterval(() => {
    createRat();
  }, 600);

  setInterval(() => {
    printScore()
    ratsArray.forEach((ratObject) => {
      moveRats(ratObject);
      removeRats(ratObject);
      detectRatCollision(ratObject);
    });
  }, 200);
}

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

function removeBullets(bulletInstance) {
  if (bulletInstance.positionX >= 100 - bulletInstance.width) {
    bulletInstance.domElement.remove();
    bulletsArray.shift();
  }
}

setInterval(() => {
  bulletsArray.forEach((bulletObject, bulletIndex) => {
    bulletObject.positionX += bulletObject.speedX;
    bulletObject.domElement.style.left = bulletObject.positionX + "vw";
    removeBullets(bulletObject);
    ratsArray.forEach((ratObject, ratIndex) => {
      detectBulletCollision(bulletObject, ratObject, bulletIndex, ratIndex);
    });
  });
}, 100);

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
    ratsArray.splice(ratIndex, 1);
    ratInstance.domElement.remove();
    lives++;
    printScore()
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
  scoreBar.style.color = 'white';
  scoreBar.style.fontSize = 30 + 'px';
  scoreBar.style.position = 'absolute';
  const parentElement = document.getElementById("board");
  parentElement.appendChild(scoreBar);
}

function printScore(){ 
  const score = 
  `
    <div style='position: absolute; left: 20px';>
      <p>Score</p>
      <p>${lives}</p>
    </div>
  `;
  document.getElementById('scoreBar').innerHTML = score
}

// create levels

// function intervalLevelTwo() {
//   setInterval(() => {
//     createRat();
//   }, 100);

//   setInterval(() => {
//     ratsArray.forEach((ratObject) => {
//       moveRats(ratObject);
//       removeRats(ratObject);
//       detectRatCollision(ratObject);
//       removeLife(ratObject);
//     });
//   }, 200);
// }

// function increaseSpeed(){
//   setTimeout(() => {
//     intervalLevelTwo();
//     }, 10000); //run this after 30 seconds.
// }