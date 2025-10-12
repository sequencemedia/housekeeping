/**
 *  @typedef {import('#housekeeping/types').JsonType} JsonType
 */

import debug from '#housekeeping/debug'

import {
  readFile
} from 'node:fs/promises'

const log = debug('housekeeping/common')

log('`housekeeping/common/from-file` is awake')

/**
 *  @param {string} filePath
 *  @returns {Promise<JsonType>}
 */
export default async function fromFile (filePath) {
  log('fromFile')

  const fileData = await readFile(filePath, 'utf8')

  return JSON.parse(fileData)
}
