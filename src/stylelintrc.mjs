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
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/stylelintrc')
const info = debug('housekeeping/stylelintrc:info')

log('`housekeeping/stylelintrc` is awake')

/**
 *  @param {string} directory
 *  @returns {string[]}
 */
function toPatterns (directory) {
  return [
    `${directory}/.stylelintrc`,
    `${directory}/.stylelintrc.json`,
    `${directory}/**/.stylelintrc`,
    `${directory}/**/.stylelintrc.json`,
    `!${directory}/node_modules/.stylelintrc`,
    `!${directory}/node_modules/.stylelintrc.json`,
    `!${directory}/node_modules/**/.stylelintrc`,
    `!${directory}/node_modules/**/.stylelintrc.json`,
    `!${directory}/**/node_modules/.stylelintrc`,
    `!${directory}/**/node_modules/.stylelintrc.json`,
    `!${directory}/**/node_modules/**/.stylelintrc`,
    `!${directory}/**/node_modules/**/.stylelintrc.json`
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
      extends: doesExtend,
      plugins,
      rules,
      overrides,
      customSyntax,
      defaultSeverity,
      configurationComment,
      ignoreDisables,
      ignoreFiles,
      allowEmptyInput,
      cache,
      fix,
      ...rest
    } = await fromFile(f)

    await toFile(f, {
      ...(doesExtend ? { extends: doesExtend } : {}),
      ...(plugins ? { plugins } : {}),
      ...(rules ? { rules } : {}),
      ...(overrides ? { overrides } : {}),
      ...(customSyntax ? { customSyntax } : {}),
      ...(defaultSeverity ? { defaultSeverity } : {}),
      ...(configurationComment ? { configurationComment } : {}),
      ...(isBoolean(ignoreDisables) ? { ignoreDisables } : {}),
      ...(ignoreFiles ? { ignoreFiles } : {}),
      ...(isBoolean(allowEmptyInput) ? { allowEmptyInput } : {}),
      ...(isBoolean(cache) ? { cache } : {}),
      ...(isBoolean(fix) ? { fix } : {}),
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
