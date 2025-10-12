import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/get-package-version` is awake')

/**
 *  @param {{ version?: string }} PACKAGE
 *  @returns {string}
 */
export default function getPackageVersion (PACKAGE = {}) {
  log('getPackageVersion')

  const {
    version = '1.0.0'
  } = PACKAGE

  return version
}
