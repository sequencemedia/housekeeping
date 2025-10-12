import debug from '#housekeeping/debug'

import {
  dirname
} from 'node:path'

import normaliseDirectory from './common/normalise-directory.mjs'
import formatDirectory from './common/format-directory.mjs'
import normaliseFilePath from './common/normalise-file-path.mjs'
import formatFilePath from './common/format-file-path.mjs'
import byKey from './common/by-key.mjs'
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/eslintrc')
const info = debug('housekeeping/eslintrc:info')

log('`housekeeping/eslintrc` is awake')

/**
 *  @param {string} directory
 *  @returns {string[]}
 */
function toPatterns (directory) {
  return [
    `${directory}/.eslintrc`,
    `${directory}/.eslintrc.json`,
    `${directory}/**/.eslintrc`,
    `${directory}/**/.eslintrc.json`,
    `!${directory}/node_modules/.eslintrc`,
    `!${directory}/node_modules/.eslintrc.json`,
    `!${directory}/node_modules/**/.eslintrc`,
    `!${directory}/node_modules/**/.eslintrc.json`,
    `!${directory}/**/node_modules/.eslintrc`,
    `!${directory}/**/node_modules/.eslintrc.json`,
    `!${directory}/**/node_modules/**/.eslintrc`,
    `!${directory}/**/node_modules/**/.eslintrc.json`
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
      extends: doesExtend,
      env,
      parser,
      parserOptions,
      plugins,
      rules,
      overrides,
      settings,
      ...rest
    } = await fromFile(f)

    await toFile(f, {
      ...(root ? { root } : {}),
      ...(doesExtend ? { extends: doesExtend } : {}),
      ...(env ? { env } : {}),
      ...(parser ? { parser } : {}),
      ...(parserOptions ? { parserOptions } : {}),
      ...(plugins ? { plugins } : {}),
      ...(rules ? { rules } : {}),
      ...(overrides ? { overrides } : {}),
      ...(settings ? { settings } : {}),
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

    const a = await getFilePaths(toPatterns(d))
    if (a.length) {
      for (const f of genFilePath(a)) {
        if (f) {
          await renderFile(f)
        }
      }
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

    const a = await getFilePaths(toPackages(d))
    if (a.length) {
      for (const f of genFilePath(a)) {
        if (f) {
          await handlePackageDirectory(dirname(f))
        }
      }
    }
  } catch (e) {
    if (e instanceof Error) handleError(e)
    else {
      throw e
    }
  }
}
