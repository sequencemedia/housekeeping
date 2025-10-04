import debug from '#housekeeping/debug'

import {
  homedir
} from 'node:os'

import {
  resolve
} from 'node:path'

const log = debug('housekeeping/common')

log('`housekeeping/common/normalise-directory` is awake')

const HOMEDIR = homedir()

/**
 *  @param {string} p
 *  @returns {string}
 */
export default function normaliseDirectory (p) {
  return resolve(p.trim().replace(/^~/, HOMEDIR))
}
