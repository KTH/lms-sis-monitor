let storage = new Map()

module.exports = {
  get () {
    return storage
  },

  set (newValue) {
    storage = newValue
  }
}
