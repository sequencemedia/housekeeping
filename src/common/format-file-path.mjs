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

log('`housekeeping/common/format-filePath` is awake')

const PLATFORM = platform()
const HOMEDIR = homedir()

/**
 *  @function formatFilePath
 *  @type {(filePath: string) => string}
 */
const formatFilePath = PLATFORM === 'win32'
  ? (filePath) => resolve(normalize(filePath)).trim()
  : (filePath) => {
      const f = resolve(normalize(filePath)).trim()
      if (f.startsWith(HOMEDIR)) return f.replace(new RegExp('^' + HOMEDIR), '~')
      return f
    }

export default formatFilePath
