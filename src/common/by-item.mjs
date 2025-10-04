import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/by-item` is awake')

export function sortItems (alpha, omega) {
  return (
    alpha
      .localeCompare(omega)
  )
}

export default function byItem (items) {
  // log('byItem')

  return items.sort(sortItems)
}
