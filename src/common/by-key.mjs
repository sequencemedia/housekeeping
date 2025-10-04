import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/by-key` is awake')

function sortEntriesByKey ([alpha], [omega]) {
  return (
    alpha
      .localeCompare(omega)
  )
}

export default function byKey (object) {
  // log('byKey')

  return (
    Object.fromEntries(
      Object.entries(object)
        .sort(sortEntriesByKey)
    )
  )
}
