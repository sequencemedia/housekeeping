import debug from '#housekeeping/debug'

import {
  dirname
} from 'node:path'

import normaliseDirectory from './common/normalise-directory.mjs'
import formatDirectory from './common/format-directory.mjs'
import toExcludePatterns from './common/to-exclude-patterns.mjs'
import normaliseFilePath from './common/normalise-file-path.mjs'
import formatFilePath from './common/format-file-path.mjs'
import byKey from './common/by-key.mjs'
import genFilePaths from './common/gen-file-paths.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'
import isBoolean from './common/is-boolean.mjs'

const log = debug('housekeeping/babelrc')
const info = debug('housekeeping/babelrc:info')

log('`housekeeping/babelrc` is awake')

/**
 *  @param {string} directory
 *  @returns {string[]}
 */
function toPatterns (directory) {
  return [
    `${directory}/.babelrc`,
    `${directory}/.babelrc.json`,
    `${directory}/**/.babelrc`,
    `${directory}/**/.babelrc.json`
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
      root,
      rootMode,
      compact,
      comments,
      presets,
      plugins,
      ...rest
    } = await fromFile(f)

    await toFile(f, {
      ...(root ? { root } : {}),
      ...(rootMode ? { rootMode } : {}),
      ...(isBoolean(compact) ? { compact } : {}),
      ...(isBoolean(comments) ? { comments } : {}),
      ...(presets ? { presets } : {}),
      ...(plugins ? { plugins } : {}),
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

    for await (const filePath of genFilePaths(toPackages(d), toExcludePatterns(d))) {
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

    for await (const filePath of genFilePaths(toPatterns(d), toExcludePatterns(d))) {
      await handlePackageDirectory(dirname(filePath))
    }
  } catch (e) {
    if (e instanceof Error) handleError(e)
    else {
      throw e
    }
  }
}
