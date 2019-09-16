
function getKey (raw, parsed) {
  if (parsed.type === 'failed_enrollment' && parsed.reason === 'missing_section') {
    return `Failed enrollments due to missing section "${parsed.section_id}"`
  } else if (parsed.reason === 'missing_user') {
    return `Failed enrollments due to missing user ${parsed.user_id}`
  } else if (parsed.type === 'failed_course') {
    return `Failed course ${parsed.course_id} due to "${parsed.reason}"`
  } else if (parsed.type === 'failed_section') {
    return `Failed section ${parsed.section_id} due to "${parsed.reason}"`
  }
}

module.exports = function errorGroup () {
  const groups = new Map()

  return {
    add ({ raw, parsed }) {
      if (!getKey(raw, parsed)) {
        process.exit()
      }
      const key = getKey(raw, parsed)

      if (!groups.has(key)) {
        groups.set(key, [])
      }

      groups.get(key).push({ raw, parsed })
    },

    list () {
      return groups
    }
  }
}
