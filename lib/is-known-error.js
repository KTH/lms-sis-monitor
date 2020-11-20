const canvas = require('./canvas')
// Check if a person that "was missing" is no longer missing
async function isExistingPerson (err) {
  if (err.reason === 'missing_user') {
    return canvas.userExists(err.sis_user_id)
  }
}

function isKnownSection (err) {
  return (
    err.reason === 'missing_section' &&
    err.sis_section_id &&
    err.sis_section_id.startsWith('app.katalog3.')
  )
}

module.exports = async function isKnownError (err) {
  return isKnownSection(err) || isExistingPerson(err)
}
