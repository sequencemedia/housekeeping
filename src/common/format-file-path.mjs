import debug from '#housekeeping/debug'

import {
  platform,
  homedir
} from 'node:os'

const log = debug('housekeeping/common')

log('`housekeeping/common/format-filePath` is awake')

const PLATFORM = platform()
const HOMEDIR = homedir()
const PATTERN = new RegExp('^' + HOMEDIR)

/**
 *  @function formatFilePath
 *  @type {(filePath: string) => string}
 */
const formatFilePath = PLATFORM === 'win32'
  ? (filePath) => filePath
  : (filePath) => PATTERN.test(filePath) ? filePath.replace(PATTERN, '~') : filePath

export default formatFilePath
