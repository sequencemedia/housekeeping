import debug from '#housekeeping/debug'

import {
  resolve,
  dirname
} from 'node:path'

import formatDirectory from './common/format-directory.mjs'
import isBoolean from './common/is-boolean.mjs'
import byKey from './common/by-key.mjs'
import byItem from './common/by-item.mjs'
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/jsconfig')
const info = debug('housekeeping/jsconfig:info')

log('`housekeeping/jsconfig` is awake')

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
    ...(byKey(compilerOptions)),
    ...(jsx ? { jsx } : {}),
    ...(baseUrl ? { baseUrl } : {}),
    ...(paths ? { paths: byKey(paths) } : {})
  }
}

async function renderFile (filePath) {
  log('renderFile')

  try {
    info(formatDirectory(filePath))

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
      ...(Array.isArray(include) ? { include: byItem(include) } : {}),
      ...(Array.isArray(exclude) ? { exclude: byItem(exclude) } : {}),
      ...rest
    })
  } catch (e) {
    handleError(e)
  }
}

async function handlePackageDirectory (directory) {
  log('handlePackageDirectory')

  const d = resolve(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPatterns(d))
    for (const filePath of genFilePath(a)) await renderFile(filePath)
  } catch (e) {
    handleError(e)
  }
}

export default async function handleDirectory (directory) {
  log('handleDirectory')

  const d = resolve(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPackages(d))
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath))
  } catch (e) {
    handleError(e)
  }
}
