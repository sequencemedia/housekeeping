import debug from '#housekeeping/debug'

const log = debug('housekeeping/common')

log('`housekeeping/common/gen-file-path` is awake')

/**
 *  @param {string[]} alpha
 *  @returns {Generator<string | undefined, void, unknown>}
 */
export default function * genFilePath (alpha) {
  log('genFilePath')

  const omega = alpha.filter(Boolean)
  while (omega.length) yield omega.shift()
}
