/**
 *  @typedef {import('#housekeeping/types').JsonType} JsonType
 */

import debug from '#housekeeping/debug'

import {
  writeFile
} from 'node:fs/promises'

const log = debug('housekeeping/common')

log('`housekeeping/common/to-file` is awake')

/**
 *  @param {string} filePath
 *  @param {JsonType} o
 *  @returns {Promise<void>}
 */
export default async function toFile (filePath, o) {
  log('toFile')

  const fileData = JSON.stringify(o, null, 2).concat('\n')

  await writeFile(filePath, fileData, 'utf8')
}
