const canvas = require('./canvas')

/**
 * Returns true if the error is about a missing person but that person actually
 * exists in Canvas.
 *
 * This error happens when a sync tries to enroll a user before he/she is
 * created. In such case, if the person exists, a sync in the future will
 * perform the enrollment properly
 */
async function isExistingPerson (err) {
  if (err.reason === 'missing_user') {
    return canvas.userExists(err.sis_user_id)
  }
}

/**
 * Returns true if the error is about a missing section and the section is
 * expected to be missing.
 *
 * Syncs will try to enroll employees to sections starting with `app.katalog3.`
 * which may or may not exist by design.
 */
function isKnownSection (err) {
  return (
    err.reason === 'missing_section' &&
    err.sis_section_id &&
    err.sis_section_id.startsWith('app.katalog3.')
  )
}

/**
 * Returns true if a SIS Import Error is known
 * @param err An "SIS Import Error" parsed
 */
module.exports = async function isKnownError (err) {
  return isKnownSection(err) || isExistingPerson(err)
}
