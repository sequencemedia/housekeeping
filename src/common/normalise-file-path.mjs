import debug from '#housekeeping/debug'

import {
  homedir
} from 'node:os'

import {
  resolve
} from 'node:path'

const log = debug('housekeeping/common')

log('`housekeeping/common/normalise-file-path` is awake')

const HOMEDIR = homedir()

/**
 *  @param {string} p
 *  @returns {string}
 */
export default function normaliseFilePath (p) {
  return resolve(p.trim().replace(/^~/, HOMEDIR))
}
