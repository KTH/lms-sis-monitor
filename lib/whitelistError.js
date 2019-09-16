/**
 * Functions that return "true" if the error is whitelisted
 */

function whitelistSection (err) {
  if (err.section_id) {
    return (/app.katalog3\.(\w+)?\.section5/).test(err.section_id) ||
      (/app\.katalog3\.(\w+)\.(\w+)?\.section5/).test(err.section_id)
  }
}

module.exports = function whitelistError (err) {
  return whitelistSection(err)
}
