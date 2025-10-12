import debug from '#housekeeping/debug'

import {
  dirname
} from 'node:path'

import normaliseDirectory from './common/normalise-directory.mjs'
import formatDirectory from './common/format-directory.mjs'
import normaliseFilePath from './common/normalise-file-path.mjs'
import formatFilePath from './common/format-file-path.mjs'
import isBoolean from './common/is-boolean.mjs'
import byKey from './common/by-key.mjs'
import byItem from './common/by-item.mjs'
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/tsconfig')
const info = debug('housekeeping/tsconfig:info')

log('`housekeeping/tsconfig` is awake')

/**
 *  @param {string} directory
 *  @returns {string[]}
 */
function toPatterns (directory) {
  return [
    `${directory}/tsconfig.json`,
    `${directory}/**/tsconfig.json`,
    `!${directory}/node_modules/tsconfig.json`,
    `!${directory}/node_modules/**/tsconfig.json`,
    `!${directory}/**/node_modules/tsconfig.json`,
    `!${directory}/**/node_modules/**/tsconfig.json`
  ]
}

/**
 * @param {JsonType} compilerOptions
 * @returns {JsonType}
 */
function renderCompilerOptions ({
  module,
  target,
  allowJs,
  checkJs,
  noEmit,
  strict,
  jsx,
  baseUrl,
  paths,
  ...compilerOptions
}) {
  return {
    ...(module ? { module } : {}),
    ...(target ? { target } : {}),
    ...(isBoolean(allowJs) ? { allowJs } : {}),
    ...(isBoolean(checkJs) ? { checkJs } : {}),
    ...(isBoolean(noEmit) ? { noEmit } : {}),
    ...(isBoolean(strict) ? { strict } : {}),
    ...(byKey(compilerOptions)),
    ...(jsx ? { jsx } : {}),
    ...(baseUrl ? { baseUrl } : {}),
    ...(paths ? { paths: byKey(paths) } : {})
  }
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

    /**
   *  @typedef {{
   *    compilerOptions?: JsonType
   *  } & JsonType} CompilerOptionsType
   *  @type {CompilerOptionsType}
   */
    const {
      extends: doesExtend,
      compilerOptions,
      include,
      exclude,
      ...rest
    } = await fromFile(f)

    await toFile(f, {
      ...(doesExtend ? { extends: doesExtend } : {}),
      ...(compilerOptions ? { compilerOptions: renderCompilerOptions(compilerOptions) } : {}),
      ...(Array.isArray(include) ? { include: byItem(include) } : {}),
      ...(Array.isArray(exclude) ? { exclude: byItem(exclude) } : {}),
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
