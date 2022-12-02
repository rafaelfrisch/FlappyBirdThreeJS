import { updateGameScore } from "./script";
import { createCube } from "./shapes";

export const addObstacle = (scene, position) => {
  const obstacle = createCube(scene);
  obstacle.translateZ(-position);
  return obstacle;
};

export const initiateObstacles = (scene, obstacleDistance) => {
  const obstacle_1 = addObstacle(scene, obstacleDistance);
  const obstacle_2 = addObstacle(scene, 2 * obstacleDistance);
  const obstacle_3 = addObstacle(scene, 3 * obstacleDistance);
  const obstacle_4 = addObstacle(scene, 4 * obstacleDistance);

  return [obstacle_1, obstacle_2, obstacle_3, obstacle_4];
};

export const updateObstaclesPosition = (obstaclesArray, obstacleDistance) => {
  obstaclesArray.forEach((obstacle) => {
    obstacle.translateZ(0.05);
    if (obstacle.position.z > 10) {
      obstacle.position.z = -4 * obstacleDistance;
      updateGameScore();
    }
  });
};
