import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/is-boolean` is awake')

/**
 * @param {unknown} value
 * @returns {value is boolean}
 */
export default function isBoolean (value) {
  return (
    typeof value === 'boolean'
  )
}
