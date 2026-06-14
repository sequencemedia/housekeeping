import debug from '#housekeeping/debug'

import {
  homedir
} from 'node:os'

import {
  normalize,
  resolve
} from 'node:path'

const log = debug('housekeeping/common')

log('`housekeeping/common/normalise-directory` is awake')

const HOMEDIR = homedir()

/**
 *  @param {string} directory
 *  @returns {string}
 */
export default function normaliseDirectory (directory) {
  return resolve(normalize(directory)).trim().replace(/^~/, HOMEDIR)
}
