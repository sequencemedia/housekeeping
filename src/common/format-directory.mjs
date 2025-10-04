import debug from '#housekeeping/debug'

import {
  platform,
  homedir
} from 'node:os'

const log = debug('housekeeping/common')

log('`housekeeping/common/format-directory` is awake')

const PLATFORM = platform()
const HOMEDIR = homedir()

/**
 *  @function formatDirectory
 *  @type {(directory: string) => string}
 */
const formatDirectory = PLATFORM === 'win32'
  ? (directory) => directory
  : (directory) => directory.includes(HOMEDIR) ? directory.replace(new RegExp('^' + HOMEDIR), '~') : directory

export default formatDirectory
