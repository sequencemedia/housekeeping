import {
  resolve,
  dirname
} from 'node:path'

import debug from '#housekeeping/debug'

import isBoolean from './common/is-boolean.mjs'
import byKeys from './common/by-keys.mjs'
import sortItems from './common/sort-items.mjs'
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/jsconfig')
const info = debug('housekeeping/jsconfig:info')

log('`housekeeping` is awake')

function toPatterns (directory) {
  return [
    `${directory}/jsconfig.json`,
    `${directory}/**/jsconfig.json`,
    `!${directory}/node_modules/jsconfig.json`,
    `!${directory}/node_modules/**/jsconfig.json`,
    `!${directory}/**/node_modules/jsconfig.json`,
    `!${directory}/**/node_modules/**/jsconfig.json`
  ]
}

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
    ...(byKeys(compilerOptions)),
    ...(jsx ? { jsx } : {}),
    ...(baseUrl ? { baseUrl } : {}),
    ...(paths ? { paths: byKeys(paths) } : {})
  }
}

async function renderFile (filePath) {
  log('renderFile')

  try {
    info(filePath)

    const {
      extends: doesExtend,
      compilerOptions,
      include,
      exclude,
      ...rest
    } = await fromFile(filePath)

    await toFile(filePath, {
      ...(doesExtend ? { extends: doesExtend } : {}),
      ...(compilerOptions ? { compilerOptions: renderCompilerOptions(compilerOptions) } : {}),
      ...(Array.isArray(include) ? { include: include.sort(sortItems) } : {}),
      ...(Array.isArray(exclude) ? { exclude: exclude.sort(sortItems) } : {}),
      ...rest
    })
  } catch (e) {
    handleError(e)
  }
}

async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  try {
    info(directory)

    const a = await getFilePaths(toPatterns(directory))
    for (const filePath of genFilePath(a)) await renderFile(filePath)
  } catch (e) {
    handleError(e)
  }
}

export default async function handleDirectory (directory) {
  log('handleDirectory')

  const d = resolve(directory)
  try {
    info(d)

    const a = await getFilePaths(toPackages(d))
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath))
  } catch (e) {
    handleError(e)
  }
}
