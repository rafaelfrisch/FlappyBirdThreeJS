import * as THREE from "three";
import { yDelta } from "./script";

export const createCube = (scene, zSize) => {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, zSize),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(cube);
  cube.translateY(-yDelta);
  return cube;
};
