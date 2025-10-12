import debug from '#housekeeping/debug'

import getFilePaths from './get-file-paths.mjs'

const log = debug('housekeeping/common')

log('`housekeeping/common/get-packages` is awake')

/**
 *  @param {string} directory
 *  @returns {Promise<string[]>}
 */
export default function getPackages (directory = '.') {
  log('getPackages')

  return (
    getFilePaths([
      `${directory}/package.json`,
      `${directory}/*/package.json`
    ])
  )
}
