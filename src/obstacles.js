import { updateGameScore, ySize } from "./script";
import { createCube } from "./shapes";

const numObstacles = 4;

const addBottomObstacle = (scene, position) => {
  const obstacle = createCube(scene, 0.4);
  obstacle.translateZ(-position);
  return obstacle;
};

const addTopObstacle = (scene, position) => {
  const obstacle = createCube(scene, 0.4);
  obstacle.translateZ(-position);
  obstacle.translateY(ySize);
  return obstacle;
};

export const initiateObstacles = (scene, obstacleDistance) => {
  const obstaclesArray = [];

  for (let i = 1; i <= numObstacles; i++) {
    let bottomObstacle = addBottomObstacle(scene, i * obstacleDistance);
    let topObstacle = addTopObstacle(scene, i * obstacleDistance);
    obstaclesArray.push(bottomObstacle);
    obstaclesArray.push(topObstacle);
  }

  return obstaclesArray;
};

let updateGameBool = true;

export const updateObstaclesPosition = (obstaclesArray, obstacleDistance) => {
  obstaclesArray.forEach((obstacle) => {
    obstacle.translateZ(0.05);

    if (obstacle.position.z > 10) {
      obstacle.position.z = -numObstacles * obstacleDistance;
      updateGameBool = true;
    }
    if (obstacle.position.z > 0 && updateGameBool) {
      updateGameScore();
      updateGameBool = false;
    }
  });
};
