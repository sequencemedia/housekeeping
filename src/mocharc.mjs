import debug from '#housekeeping/debug'

import {
  dirname
} from 'node:path'

import normaliseDirectory from './common/normalise-directory.mjs'
import formatDirectory from './common/format-directory.mjs'
import toExcludePatterns from './common/to-exclude-patterns.mjs'
import byKey from './common/by-key.mjs'
import genFilePaths from './common/gen-file-paths.mjs'
import normaliseFilePath from './common/normalise-file-path.mjs'
import formatFilePath from './common/format-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/mocharc')
const info = debug('housekeeping/mocharc:info')

log('`housekeeping/mocharc` is awake')

/**
 *  @param {string} directory
 *  @returns {string[]}
 */
function toPatterns (directory) {
  return [
    `${directory}/.mocharc`,
    `${directory}/.mocharc.json`,
    `${directory}/**/.mocharc`,
    `${directory}/**/.mocharc.json`
  ]
}

/**
 *  @param {string} filePath
 *  @returns {Promise<void>}
 */
async function renderFile (filePath) {
  log('renderFile')

  const f = normaliseFilePath(filePath)
  try {
    info(formatFilePath(f))

    const {
      'node-option': nodeOption,
      extension,
      ...rest
    } = await fromFile(f)

    await toFile(f, {
      ...(nodeOption ? { 'node-option': nodeOption } : {}),
      ...(extension ? { extension } : {}),
      ...(byKey(rest))
    })
  } catch (e) {
    if (e instanceof Error) handleError(e)
    else {
      throw e
    }
  }
}

/**
 *  @param {string} directory
 *  @returns {Promise<void>}
 */
async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  const d = normaliseDirectory(directory)
  try {
    info(formatDirectory(d))

    for await (
      const filePath of (
        genFilePaths(
          toPatterns(d),
          toExcludePatterns(d)
        ))
    ) {
      await renderFile(filePath)
    }
  } catch (e) {
    if (e instanceof Error) handleError(e)
    else {
      throw e
    }
  }
}

/**
 *  @param {string} directory
 *  @returns {Promise<void>}
 */
export default async function handleDirectory (directory) {
  log('handleDirectory')

  const d = normaliseDirectory(directory)
  try {
    info(formatDirectory(d))

    for await (
      const filePath of (
        genFilePaths(
          toPackages(d),
          toExcludePatterns(d)
        ))
    ) {
      await handlePackageDirectory(dirname(filePath))
    }
  } catch (e) {
    if (e instanceof Error) handleError(e)
    else {
      throw e
    }
  }
}
