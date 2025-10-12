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

const log = debug('housekeeping/depsrc')
const info = debug('housekeeping/depsrc:info')

log('`housekeeping/depsrc` is awake')

/**
 *  @param {string} directory
 *  @returns {string[]}
 */
function toPatterns (directory) {
  return [
    `${directory}/.depsrc`,
    `${directory}/.depsrc.json`,
    `${directory}/**/.depsrc`,
    `${directory}/**/.depsrc.json`,
    `!${directory}/node_modules/.depsrc`,
    `!${directory}/node_modules/.depsrc.json`,
    `!${directory}/node_modules/**/.depsrc`,
    `!${directory}/node_modules/**/.depsrc.json`,
    `!${directory}/**/node_modules/.depsrc`,
    `!${directory}/**/node_modules/.depsrc.json`,
    `!${directory}/**/node_modules/**/.depsrc`,
    `!${directory}/**/node_modules/**/.depsrc.json`
  ]
}

/**
 *  @param {string} filePath
 *  @param {string} AUTHOR
 *  @returns {Promise<void>}
 */
async function renderFile (filePath, AUTHOR) {
  log('renderFile')

  const f = normaliseFilePath(filePath)
  try {
    info(formatFilePath(f))

    const {
      author,
      dependencies,
      devDependencies,
      optionalDependencies,
      bundleDependencies,
      peerDependencies,
      ...rest
    } = await fromFile(f)

    await toFile(f, {
      ...(author ? { author } : { author: AUTHOR }),
      ...(dependencies ? { dependencies } : {}),
      ...(devDependencies ? { devDependencies } : {}),
      ...(optionalDependencies ? { optionalDependencies } : {}),
      ...(bundleDependencies ? { bundleDependencies } : {}),
      ...(peerDependencies ? { peerDependencies } : {}),
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
 *  @param {string} author
 *  @returns {Promise<void>}
 */
async function handlePackageDirectory (directory, author) {
  log('handlePackageDirectory')

  const d = normaliseDirectory(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPatterns(d))
    if (a.length) {
      for (const f of genFilePath(a)) {
        if (f) {
          await renderFile(f, author)
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
 *  @param {string} author
 *  @returns {Promise<void>}
 */
export default async function handleDirectory (directory, author) {
  log('handleDirectory')

  const d = normaliseDirectory(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPackages(d))
    if (a.length) {
      for (const f of genFilePath(a)) {
        if (f) {
          await handlePackageDirectory(dirname(f), author)
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
