import debug from '#housekeeping/debug'

import {
  platform,
  homedir
} from 'node:os'

import {
  normalize,
  resolve
} from 'node:path'

const log = debug('housekeeping/common')

log('`housekeeping/common/format-directory` is awake')

const PLATFORM = platform()
const HOMEDIR = homedir()

/**
 *  @function formatDirectory
 *  @type {(directory: string) => string}
 */
const formatDirectory = PLATFORM === 'win32'
  ? (directory) => resolve(normalize(directory)).trim()
  : (directory) => {
      const d = resolve(normalize(directory)).trim()
      if (d.startsWith(HOMEDIR)) return d.replace(new RegExp('^' + HOMEDIR), '~')
      return d
    }

export default formatDirectory
