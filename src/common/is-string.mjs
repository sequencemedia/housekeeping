import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/is-string` is awake')

/**
 * @param {unknown} value
 * @returns {value is string}
 */
export default function isString (value) {
  return (
    typeof value === 'string'
  )
}
