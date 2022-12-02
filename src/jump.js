const calculateNewVelocity = (initialVelocity, elapsedTime) => {
  const newVelocity = initialVelocity - 1.8 * elapsedTime;
  return newVelocity;
};

export default calculateNewVelocity;
