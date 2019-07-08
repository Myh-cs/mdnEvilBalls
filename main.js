// 设定画布
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// 设定画布长宽
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
let balls = [];
let evilCircleP1;
let stop = true;
let ballNumber = 100;
function init() {
  ctx.clearRect(0, 0, width, height);
  document.getElementsByTagName("h1")[0].innerText = `已经吃了${0}个，还剩${
    ballNumber
  }个存活`;
  balls = [];
  evilCircleP1 = new EvilCircle(300, 300, true, "#fff", 5);
  // const evilCircleP2 = new EvilCircle(
  //   width - 300,
  //   height - 300,
  //   true,
  //   "#0ff",
  //   15
  // );
  stop = true;
  evilCircleP1.setControls("w", "d", "s", "a");
  // evilCircleP2.setControls("up", "right", "down", "left");
  window.addEventListener("keypress", e => {
    if (e.keyCode === 32) {
      if (stop) {
        requestAnimationFrame(function() {
          loop();
        });
      }
      stop = !stop;
    }
  });
  loop();
}

// 生成随机数的函数
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
  return (
    "rgb(" +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ", " +
    random(0, 255) +
    ")"
  );
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, color, size, exists) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function() {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }
  if (this.x + this.size <= 0) {
    this.velX = -this.velX;
  }
  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }
  if (this.y + this.size <= 0) {
    this.velY = -this.velY;
  }
  this.x += this.velX;
  this.y += this.velY;
  this.collisionDetect();
};

Ball.prototype.collisionDetect = function() {
  for (let ball of balls) {
    if (ball.exists) {
      if (ball !== this) {
        let dx = this.x - ball.x;
        let dy = this.y - ball.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          balls.color = this.color = randomColor();
        }
      }
    }
  }
};

function EvilCircle(x, y, exists, color, size) {
  Shape.call(this, x, y, 5, 5, exists);
  this.color = color;
  this.size = size;
  this.eat = 0;
}

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};
EvilCircle.prototype.checkBounds = function() {
  if (this.x + this.size >= width) {
    this.x = width - this.size;
  }
  if (this.x <= this.size) {
    this.x = 0 + this.size;
  }
  if (this.y + this.size >= height) {
    this.y = height - this.size;
  }
  if (this.y <= this.size) {
    this.y = 0 + this.size;
  }
  this.collisionDetect();
};
EvilCircle.prototype.setControls = function(mode) {
    window.addEventListener("keydown", e => {
      if (!stop) {
        if (e.key === "a") {
          this.x -= Math.max(this.size/2,this.velX);
          // if (this.size > 10) {
          //   this.size -= 2;
          // }
        } else if (e.key === "d") {
          this.x += Math.max(this.size/2,this.velX);
          // if (this.size > 10) {
          //   this.size -= 2;
          // }
        } else if (e.key === "w") {
          this.y -= Math.max(this.size/2,this.velY);
          // if (this.size > 10) {
          //   this.size -= 2;
          // }
        } else if (e.key === "s") {
          this.y += Math.max(this.size/2,this.velY);
          // if (this.size > 10) {
          //   this.size -= 2;
          // }
        }
      }
    });
};
EvilCircle.prototype.collisionDetect = function() {
  for (let ball of balls) {
    if (ball.exists) {
      let dx = this.x - ball.x;
      let dy = this.y - ball.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + ball.size) {
        ball.exists = false;
        ball.recoverTime = new Date() - 0 + 5000;
        this.eat += 1;
        if (this.size < 300) {
          this.size += ball.size / 2;
        }
        document.getElementsByTagName("h1")[0].innerText = `已经吃了${
          this.eat
        }个，还剩${balls.length - this.eat}个存活`;
      }
    }
  }
};

function loop(ballLine = 4) {
  ctx.fillStyle = `rgba(0,0,0,${1 / ballLine})`;
  ctx.fillRect(0, 0, width, height);
  // evilCircleP2.draw();
  evilCircleP1.draw();

  while (balls.length < ballNumber) {
    var ball = new Ball(
      random(0, width),
      random(0, height),
      random(-7, 7),
      random(-7, 7),
      randomColor(),
      random(2, 5),
      true
    );
    balls.push(ball);
  }
  evilCircleP1.checkBounds();
  // evilCircleP2.checkBounds();
  for (let ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
    }
  }
  if (balls.some(ball => ball.exists)) {
    if (stop) {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, width, height);
      evilCircleP1.draw();
      // evilCircleP2.draw();
    } else {
      requestAnimationFrame(loop.bind(this, ballLine));
    }
  } else {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, width, height);
    evilCircleP1.draw();
    // evilCircleP2.draw();
  }
}

init();

const start = document.body.querySelector("#start");
const number = document.body.querySelector("#number");
const reset = document.body.querySelector("#reset");
start.addEventListener("click", () => {
  if (stop) {
    requestAnimationFrame(function() {
      loop();
    });
  }
  stop = !stop;
  start.style.display = "none";
  number.style.display = "none";
});
reset.addEventListener("click", () => {
  init();
  start.style.display = "inline-block";
  number.style.display = "block";
});
number.addEventListener("input", e => {
  console.log(e.target.value);
  if (e.target.value <= 100 && e.target.value >= 10) {
    ballNumber = e.target.value;
  } else if (e.target.value >= 100) {
    ballNumber = 100;
  } else {
    ballNumber = 10;
  }
  init();
});
