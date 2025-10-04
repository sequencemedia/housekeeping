import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/is-string` is awake')

export default function isString (value) {
  return (
    typeof value === 'string'
  )
}
