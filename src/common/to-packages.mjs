import debug from '#housekeeping/debug'

const log = debug('housekeeping/common/to-packages')

log('`housekeeping` is awake')

export default function toPackages (directory = '.') {
  log('toPackages')

  return [
    `${directory}/package.json`,
    `${directory}/*/package.json`
  ]
}
