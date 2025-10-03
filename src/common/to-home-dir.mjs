import {
  platform,
  homedir
} from 'node:os'

const PLATFORM = platform()
const HOMEDIR = homedir()

/**
 *  @function toHomeDir
 *  @type {(directory: string) => string}
 */
const toHomeDir = PLATFORM === 'win32'
  ? (directory) => directory
  : (directory) => directory.includes(HOMEDIR) ? directory.replace(HOMEDIR, '~') : directory

export default toHomeDir
