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
import isString from './common/is-string.mjs'

const log = debug('housekeeping/package')
const info = debug('housekeeping/package:info')

log('`housekeeping/package` is awake')

/**
 *  @param {string} directory
 *  @returns {string[]}
 */
function toPatterns (directory) {
  return [
    `${directory}/package.json`,
    `${directory}/**/package.json`
  ]
}

/**
 *  @param {string} filePath
 *  @param {string} AUTHOR
 *  @param {RegExp} REGEXP
 *  @returns {Promise<void>}
 */
async function renderFile (filePath, AUTHOR, REGEXP) {
  log('renderFile')

  const f = normaliseFilePath(filePath)
  try {
    info(formatFilePath(f))

    const {
      name,
      version,
      description,
      keywords,
      private: isPrivate,
      main,
      type,
      types,
      author,
      contributors,
      license,
      engines,
      repository,
      homepage,
      bugs,
      scripts,
      bin,
      dependencies,
      devDependencies,
      peerDependencies,
      overrides,
      imports,
      exports,
      _moduleAliases,
      husky,
      ...rest
    } = await fromFile(f)

    await toFile(f, {
      ...(name ? { name } : {}),
      ...(version ? { version } : {}),
      ...(description ? { description } : {}),
      ...(keywords ? { keywords } : {}),
      ...(isPrivate ? { private: isPrivate } : {}),
      ...(main ? { main } : {}),
      ...(type ? { type } : {}),
      ...(types ? { types } : {}),
      ...(author ? (isString(author) && REGEXP.test(author)) ? { author: AUTHOR } : { author } : {}),
      ...(contributors ? { contributors } : {}),
      ...(license ? { license } : {}),
      ...(engines ? { engines } : {}),
      ...(repository ? { repository } : {}),
      ...(homepage ? { homepage } : {}),
      ...(bugs ? { bugs } : {}),
      ...(scripts ? { scripts: byKey(scripts) } : {}),
      ...(bin ? { bin: byKey(bin) } : {}),
      ...(dependencies ? { dependencies: byKey(dependencies) } : {}),
      ...(devDependencies ? { devDependencies: byKey(devDependencies) } : {}),
      ...(peerDependencies ? { peerDependencies: byKey(peerDependencies) } : {}),
      ...(overrides ? { overrides: byKey(overrides) } : {}),
      ...(byKey(rest)),
      ...(imports ? { imports: byKey(imports) } : {}),
      ...(exports ? { exports: byKey(exports) } : {}),
      ...(_moduleAliases ? { _moduleAliases } : {}),
      ...(husky ? { husky } : {})
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
 *  @param {string} author
 *  @param {string} regExp
 *  @returns {Promise<void>}
 */
async function handlePackageDirectory (directory, author, regExp) {
  log('handlePackageDirectory')

  const d = normaliseDirectory(directory)
  try {
    info(formatDirectory(d))

    for await (const filePath of genFilePaths(toPatterns(d), toExcludePatterns(d))) {
      await renderFile(filePath, author, new RegExp(regExp))
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
 *  @param {string} author
 *  @param {string} regExp
 *  @returns {Promise<void>}
 */
export default async function handleDirectory (directory, author, regExp) {
  log('handleDirectory')

  const d = normaliseDirectory(directory)
  try {
    info(formatDirectory(d))

    for await (const filePath of genFilePaths(toPackages(d), toExcludePatterns(d))) {
      await handlePackageDirectory(dirname(filePath), author, regExp)
    }
  } catch (e) {
    if (e instanceof Error) handleError(e)
    else {
      throw e
    }
  }
}
