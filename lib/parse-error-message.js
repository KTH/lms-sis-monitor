/**
 * Collection of error parsers. All return an object with the "type" of the
 * error, its reason, and all relevant SIS IDs or integration IDs
 *
 * @typedef {object} SisError
 * @property {string} type
 * @property {string} reason
 * @property {string?} sis_course_id
 * @property {string?} sis_section_id
 * @property {string?} sis_user_id
 */

/** @return {SisError?} */
module.exports = function parseErrorMessage (message) {
  const pattern1 = /Neither course nor section existed for user enrollment \(Course ID: (.+)?, Section ID: (.+)?, User ID: (.+)?\)/
  const pattern2 = /User not found for enrollment \(User ID: (.+)?, Course ID: (.+)?, Section ID: (.+)?\)/
  const pattern3 = /An enrollment referenced a non-existent section (.+)?/
  const pattern4 = /Section (.+)? references course (.+)? which doesn't exist/
  const pattern5 = /A course did not pass validation \(course: (.+)? \/ (.+)?, error: (.+)?\)/

  const match1 = message.match(pattern1)
  const match2 = message.match(pattern2)
  const match3 = message.match(pattern3)
  const match4 = message.match(pattern4)
  const match5 = message.match(pattern5)

  if (match1 !== null) {
    return {
      type: 'failed_enrollment',
      reason: 'missing_section',
      sis_course_id: match1[1],
      sis_section_id: match1[2],
      sis_user_id: match1[3]
    }
  } else if (match2 !== null) {
    return {
      type: 'failed_enrollment',
      reason: 'missing_user',
      sis_course_id: match2[2],
      sis_section_id: match2[3],
      sis_user_id: match2[1]
    }
  } else if (match3 !== null) {
    return {
      type: 'failed_enrollment',
      reason: 'missing_section',
      sis_section_id: match3[1]
    }
  } else if (match4 !== null) {
    return {
      type: 'failed_section',
      reason: 'non_existent_course',
      sis_course_id: match4[2],
      sis_section_id: match4[1]
    }
  } else if (match5 !== null) {
    return {
      type: 'failed_course',
      sis_course_id: match5[1],
      ...parseReason(match5[3])
    }
  }
}

function parseReason (reason) {
  const pattern1 = /A course did not pass validation Conclude at End date cannot be before start date/
  const pattern2 = /A course did not pass validation Integration Integration ID "(.+)?" is already in use/

  const match1 = reason.match(pattern1)
  const match2 = reason.match(pattern2)

  if (match1 !== null) {
    return {
      reason: 'wrong_dates'
    }
  } else if (match2 !== null) {
    return {
      reason: 'wrong_integration_id',
      integration_id: match2[1]
    }
  }
}
