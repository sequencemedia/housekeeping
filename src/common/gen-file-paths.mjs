import debug from '#housekeeping/debug'

import { glob } from 'node:fs/promises'

const log = debug('housekeeping/common')

log('`housekeeping/common/get-file-paths` is awake')

/**
 *  @param {string[]} patterns
 *  @param {string[]} exclude
 *  @returns {AsyncGenerator<any, any, unknown>}
 */
export default async function * genFilePaths (patterns = ['./*'], exclude = []) {
  log('genFilePaths')

  for await (const filePath of glob(patterns, { exclude })) yield filePath
}
