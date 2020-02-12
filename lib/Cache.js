const CACHE = {}

function updateSlaves (slaves) {
  CACHE.slaves = slaves
}

function resetSlaves () {
  delete CACHE.slaves
}

function getSlaves () {
  return CACHE.slaves
}

module.exports = {
  updateSlaves,
  getSlaves,
  resetSlaves
}
