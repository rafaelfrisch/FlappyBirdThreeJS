import "./style.css";
import * as THREE from "three";
import createCamera from "./camera";
import createControls from "./controls";
import { createCube } from "./shapes";
import createRenderer from "./renderer";
import calculateNewVelocity from "./jump";
import { initiateObstacles, updateObstaclesPosition } from "./obstacles";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");
let gameInitiated = false;
let gameOver = false;
// Scene
const scene = new THREE.Scene();

// creating background
const loader = new THREE.TextureLoader();
loader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/39222e18-80cb-4cf9-abf3-a86ee32917cd/d7bfdvl-8d7734fa-79d8-4513-850a-c9cc8d6a2e82.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM5MjIyZTE4LTgwY2ItNGNmOS1hYmYzLWE4NmVlMzI5MTdjZFwvZDdiZmR2bC04ZDc3MzRmYS03OWQ4LTQ1MTMtODUwYS1jOWNjOGQ2YTJlODIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.FaCwTn05XAAF6UDB3Wumpfm8RKJr04REgU0VsxG0ghA', function (texture) {
  scene.background = texture;
});


let gameScore = 0;

export const updateGameScore = () => {
  gameScore +=10;
  gameScoreMessage.innerHTML = `Score <br> ${gameScore}`;
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let isJumping = false;
let jumpStartedTime;

window.addEventListener("click", () => {
  if (!isJumping && gameInitiated) {
    isJumping = true;
    playerVelocity = initialVelocity;
    jumpStartedTime = lastElapsedTime
  }
  if (!gameInitiated) {
    gameInitiated = true;
    initialMessage.style.display = "none";
  }
  if (isJumping) {
    if (lastElapsedTime - jumpStartedTime > 10 * lastDeltaTime && player.position.y < 5) {
      playerVelocity = initialVelocity;
    }
  }
});

/**
 * Camera
 */
// Base camera
const camera = createCamera(scene, sizes);
// Controls
const controls = createControls(camera, canvas);

/**
 * Cube
 */
const player = createCube(scene);
const initialVelocity = 0.4;
let playerVelocity = initialVelocity;
let obstacleDistance = 10;

const obstaclesArray = initiateObstacles(scene, obstacleDistance);

/**
 * Renderer
 */
const renderer = createRenderer(canvas, sizes);

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;
let lastDeltaTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;
  lastDeltaTime = deltaTime;
  // Update controls

  if (gameInitiated && !gameOver) {
    controls.update();

    updateObstaclesPosition(obstaclesArray, obstacleDistance);

    if (isJumping) {
      playerVelocity = calculateNewVelocity(playerVelocity, deltaTime);
      player.translateY(playerVelocity);
    }

    if (player.position.y < 0) {
      isJumping = false;
      player.position.y = 0;
    }

    if (player.position.y > 5) {
      playerVelocity = 0;
    }

    for (
      var vertexIndex = 0;
      vertexIndex < player.geometry.attributes.position.array.length;
      vertexIndex++
    ) {
      var localVertex = new THREE.Vector3()
        .fromBufferAttribute(player.geometry.attributes.position, vertexIndex)
        .clone();
      var globalVertex = localVertex.applyMatrix4(player.matrix);
      var directionVector = globalVertex.sub(player.position);

      var ray = new THREE.Raycaster(
        player.position,
        directionVector.clone().normalize()
      );
      var collisionResults = ray.intersectObjects(obstaclesArray);
      if (
        collisionResults.length > 0 &&
        collisionResults[0].distance < directionVector.length()
      ) {
        gameOver = true;
        gameOverMessage.style.display = "block";
      }
    }
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const initialMessage = document.createElement("div");
initialMessage.style.position = "absolute";
initialMessage.style.width = "100%";
initialMessage.style.textAlign = "center";
initialMessage.style.color = "#fff";
initialMessage.style.fontSize = "50" + "px";
initialMessage.innerHTML = "Press anywhere to play";
initialMessage.style.top = 20 + "%";

const gameOverMessage = document.createElement("div");
gameOverMessage.style.position = "absolute";
gameOverMessage.style.width = "100%";
gameOverMessage.style.textAlign = "center";
gameOverMessage.style.color = "#f00";
gameOverMessage.style.fontSize = "50" + "px";
gameOverMessage.innerHTML = "Game Over! <br> Refresh page to play again";
gameOverMessage.style.top = 15 + "%";
gameOverMessage.style.display = "none";

const gameScoreMessage = document.createElement("div");
gameScoreMessage.style.position = "absolute";
gameScoreMessage.style.width = "25%";
gameScoreMessage.style.left = "75%";
gameScoreMessage.style.textAlign = "center";
gameScoreMessage.style.color = "#fff";
gameScoreMessage.style.fontSize = "50" + "px";
gameScoreMessage.innerHTML = `Score <br> ${gameScore}`;
gameScoreMessage.style.top = 2 + "%";

document.body.appendChild(initialMessage);
document.body.appendChild(gameOverMessage);
document.body.appendChild(gameScoreMessage);
