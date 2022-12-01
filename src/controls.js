import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const createControls = (camera, canvas) => {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enableRotate = false;
  controls.enableZoom = false; 
  return controls;
}

export default createControls;