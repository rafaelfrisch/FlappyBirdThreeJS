import * as THREE from "three";

const createCamera = (scene, sizes) => {
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 10;
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);
  return camera;
};

export default createCamera;
