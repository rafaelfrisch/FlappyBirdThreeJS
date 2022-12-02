const calculateNewVelocity = (initialVelocity, elapsedTime) => {
  const newVelocity = initialVelocity - 1.5 * elapsedTime;
  return newVelocity;
};

export default calculateNewVelocity;
