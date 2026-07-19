import debug from '#housekeeping/debug'

import {
  homedir
} from 'node:os'

import {
  resolve,
  normalize
} from 'node:path'

const log = debug('housekeeping/common')

log('`housekeeping/common/normalise-file-path` is awake')

const HOMEDIR = homedir()

/**
 *  @param {string} filePath
 *  @returns {string}
 */
export default function normaliseFilePath (filePath) {
  return resolve(normalize(filePath.trim().replace(/^~/, HOMEDIR)))
}
