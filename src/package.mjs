import debug from '#housekeeping/debug'

import {
  resolve,
  dirname
} from 'node:path'

import formatDirectory from './common/format-directory.mjs'
import byKey from './common/by-key.mjs'
import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import toPackages from './common/to-packages.mjs'
import handleError from './common/handle-error.mjs'
import isString from './common/is-string.mjs'

const log = debug('housekeeping/package')
const info = debug('housekeeping/package:info')

log('`housekeeping/package` is awake')

function toPatterns (directory) {
  return [
    `${directory}/package.json`,
    `${directory}/**/package.json`,
    `!${directory}/node_modules/package.json`,
    `!${directory}/node_modules/**/package.json`,
    `!${directory}/**/node_modules/package.json`,
    `!${directory}/**/node_modules/**/package.json`
  ]
}

async function renderFile (filePath, AUTHOR, REGEXP) {
  log('renderFile')

  try {
    info(formatDirectory(filePath))

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
      imports,
      exports,
      _moduleAliases,
      husky,
      ...rest
    } = await fromFile(filePath)

    await toFile(filePath, {
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
      ...rest,
      ...(imports ? { imports: byKey(imports) } : {}),
      ...(exports ? { exports: byKey(exports) } : {}),
      ...(_moduleAliases ? { _moduleAliases } : {}),
      ...(husky ? { husky } : {})
    })
  } catch (e) {
    handleError(e)
  }
}

async function handlePackageDirectory (directory, author, regExp) {
  log('handlePackageDirectory')

  const d = resolve(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPatterns(d))
    for (const filePath of genFilePath(a)) await renderFile(filePath, author, new RegExp(regExp))
  } catch (e) {
    handleError(e)
  }
}

export default async function handleDirectory (directory, author, regExp) {
  log('handleDirectory')

  const d = resolve(directory)
  try {
    info(formatDirectory(d))

    const a = await getFilePaths(toPackages(d))
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath), author, regExp)
  } catch (e) {
    handleError(e)
  }
}
