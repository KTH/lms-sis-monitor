/**
 * Collection of error parsers. All return an object with the "type" of the
 * error, its reason, and all SIS IDs
 */

function nonExistentSection (err) {
  const prefix = 'Neither course nor section existed for user enrollment '
  if (!err.message.startsWith(prefix)) {
    return
  }

  const suffix = err.message.slice(prefix.length)
  const pattern = /\(Course ID: (.+)?, Section ID: (.+)?, User ID: (.+)?\)/
  const m = suffix.match(pattern)

  if (m !== null) {
    return {
      type: 'failed_enrollment',
      reason: 'missing_section',
      course_id: m[1],
      section_id: m[2],
      user_id: m[3]
    }
  }
}

function nonExistentSection2 (err) {
  const prefix = 'An enrollment referenced a non-existent section '
  if (!err.message.startsWith(prefix)) {
    return
  }

  const suffix = err.message.slice(prefix.length)

  return {
    type: 'failed_enrollment',
    reason: 'missing_section',
    section_id: suffix
  }
}

function nonExistentUser (err) {
  const prefix = 'User not found for enrollment '
  if (!err.message.startsWith(prefix)) {
    return
  }

  const suffix = err.message.slice(prefix.length)
  const pattern = /\(User ID: (.+)?, Course ID: (.+)?, Section ID: (.+)?\)/
  const m = suffix.match(pattern)

  if (m !== null) {
    return {
      type: 'failed_enrollment',
      reason: 'missing_user',
      course_id: m[2],
      section_id: m[3],
      user_id: m[1]
    }
  }
}

function wrongCourse (err) {
  const prefix = 'A course did not pass validation '
  if (!err.message.startsWith(prefix)) {
    return
  }

  const suffix = err.message.slice(prefix.length)
  const pattern = /\(course: (.+)? \/ (.+)?, error: (.+)?\)/
  const m = suffix.match(pattern)

  if (m === null) {
    return
  }

  const errorCause = m[3]

  if (
    m[3] ===
    'A course did not pass validation Conclude at End date cannot be before start date'
  ) {
    return {
      type: 'failed_course',
      course_id: m[1],
      reason: 'wrong_dates'
    }
  }

  const subPattern = /A course did not pass validation Integration Integration ID "(.+)?" is already in use/
  const m2 = errorCause.match(subPattern)

  if (m2 !== null) {
    return {
      type: 'failed_course',
      reason: 'wrong_integration_id',
      course_id: m[1],
      invalid_integration_id: m2[1]
    }
  }
}

function nonExistentCourse (err) {
  const pattern = /Section (.+)? references course (.+)? which doesn't exist/
  const m = err.message.match(pattern)

  if (m !== null) {
    return {
      type: 'failed_section',
      reason: 'non_existent_course',
      course_id: m[2],
      section_id: m[1]
    }
  }
}

module.exports = function parseError (err) {
  return (
    nonExistentSection(err) ||
    nonExistentSection2(err) ||
    nonExistentUser(err) ||
    wrongCourse(err) ||
    nonExistentCourse(err) ||
    null
  )
}
