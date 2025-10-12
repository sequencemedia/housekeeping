import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/gen-file-path` is awake')

/**
 *  @param {string[]} filePaths
 *  @returns {Generator<string | undefined, void, unknown>}
 */
export default function * genFilePath (filePaths) {
  log('genFilePath')

  const a = filePaths.slice()
  while (a.length) yield a.shift()
}
