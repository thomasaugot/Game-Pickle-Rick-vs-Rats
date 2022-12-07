let board = document.getElementById("board");

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

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", (e) => {
  startGame();
});

function startGame() {
  const instructionsPage = document.getElementById("landing-page");
  instructionsPage.remove();
  createRick();
  createRat();
  intervalLevelOne();
}

//creating my player

const rickDomElement = document.createElement("div");

const rick = {
  positionX: 0,
  width: 9,
  positionY: 47,
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

let ratsArray = [];

function createRat() {
  const ratDomElement = document.createElement("div");
  ratDomElement.className = "rats";

  const rat = {
    height: 16,
    width: 12,
    positionX: 100,
    positionY: Math.floor(Math.random() * 90),
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
    // removeLife();
  }
}

// setting intervals

function intervalLevelOne() {
  setInterval(() => {
    createRat();
  }, 700);
  setInterval(() => {
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
    location.href = "../game-over.html";
  }
} 

// function gameOverRestart() {
//   const restartButton = document.getElementById("try-again-button");
//   restartButton.addEventListener("click", (e) => {
//     location.href ="../index.html"
//   });
// }

//adding shoot functionnality to my player

let bulletsArray = [];

function shoot() {
  // creating my bullets

  const bulletDomElement = document.createElement("div");
  bulletDomElement.className = "bullet";

  const bullet = {
    height: 10,
    width: 8,
    speedX: 15,
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

  // move the bullets

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
    })
  });
}, 100);

// detecting bullets & rats collision

function detectBulletCollision(bulletInstance, ratInstance, bulletIndex, ratIndex) {
  if (
    ratInstance.positionX < bulletInstance.positionX + bulletInstance.width &&
    ratInstance.positionX + ratInstance.width > bulletInstance.positionX &&
    ratInstance.positionY < bulletInstance.positionY + bulletInstance.height &&
    ratInstance.height + ratInstance.positionY > bulletInstance.positionY
  ) {
    bulletInstance.domElement.remove();
    bulletsArray.splice(bulletIndex, 1);
    ratsArray.splice(ratIndex, 1);
    ratInstance.domElement.remove();
  }
}

// calculate score

let lives = [];

// function addLife() {

// }

// function removeLife() {

// }

// game over & reset
