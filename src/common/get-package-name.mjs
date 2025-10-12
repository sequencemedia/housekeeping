import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/get-package-name` is awake')

/**
 *  @param {{ name?: string }} PACKAGE
 *  @returns {string}
 */
export default function getPackageName (PACKAGE = {}) {
  log('getPackageName')

  const {
    name = 'housekeeping'
  } = PACKAGE

  return name
}
