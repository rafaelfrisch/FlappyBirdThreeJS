import * as THREE from "three";

export const createCube = (scene, zSize) => {
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, zSize),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(cube);
  return cube;
};
