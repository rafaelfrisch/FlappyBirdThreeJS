import * as THREE from "three";
import { yDelta } from "./script";

export const createCube = (scene, zSize, isPlayer) => {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, zSize),
    new THREE.MeshBasicMaterial({ color: isPlayer ? 0xff0000 : 0x0000ff })
  );
  scene.add(cube);
  cube.translateY(-yDelta);
  return cube;
};
