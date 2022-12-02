import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

window.addEventListener("click", () => {
  if (!isJumping && gameInitiated) {
    isJumping = true;
    playerVelocity = initialVelocity;
  }
  if (!gameInitiated) {
    gameInitiated = true;
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
const initialVelocity = 0.5;
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

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;
  // Update controls

  if (gameInitiated && !gameOver) {
    controls.update();

    updateObstaclesPosition(obstaclesArray, obstacleDistance);

    if (isJumping) {
      playerVelocity = calculateNewVelocity(playerVelocity, deltaTime);
      player.translateY(playerVelocity);
      if (player.position.y < 0) {
        isJumping = false;
        player.position.y = 0;
      }
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
      }
    }
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
