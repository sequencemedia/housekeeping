import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/get-package-author` is awake')

/**
 *  @param {{ author?: string }} PACKAGE
 *  @returns {string}
 */
export default function getPackageAuthor (PACKAGE = {}) {
  log('getPackageAuthor')

  const {
    author = 'Jonathan Perry <jonathanperry@sequencemedia.net>'
  } = PACKAGE

  return author
}
