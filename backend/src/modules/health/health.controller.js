function getHealthStatus() {
  return {
    success: true,
    message: "KERNO API is running",
  };
}

function getHealth(req, res) {
  res.status(200).json(getHealthStatus());
}

module.exports = {
  getHealthStatus,
  getHealth,
};
