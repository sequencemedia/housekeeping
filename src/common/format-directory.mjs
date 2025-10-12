import debug from '#housekeeping/debug'

import {
  platform,
  homedir
} from 'node:os'

const log = debug('housekeeping/common')

log('`housekeeping/common/format-directory` is awake')

const PLATFORM = platform()
const HOMEDIR = homedir()
const PATTERN = new RegExp('^' + HOMEDIR)

/**
 *  @function formatDirectory
 *  @type {(directory: string) => string}
 */
const formatDirectory = PLATFORM === 'win32'
  ? (directory) => directory
  : (directory) => PATTERN.test(directory) ? directory.replace(PATTERN, '~') : directory

export default formatDirectory
