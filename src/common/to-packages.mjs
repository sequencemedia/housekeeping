import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/to-package` is awake')

export default function toPackages (directory = '.') {
  log('toPackages')

  return [
    `${directory}/package.json`,
    `${directory}/*/package.json`
  ]
}
