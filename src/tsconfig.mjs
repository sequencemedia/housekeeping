import debug from 'debug'

import {
  resolve,
  dirname
} from 'node:path'

import getFilePaths from './common/get-file-paths.mjs'
import genFilePath from './common/gen-file-path.mjs'
import fromFile from './common/from-file.mjs'
import toFile from './common/to-file.mjs'
import getPackages from './common/get-packages.mjs'
import handleError from './common/handle-error.mjs'

const log = debug('housekeeping/tsconfig')
const info = debug('housekeeping/tsconfig:info')

log('`housekeeping` is awake')

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
      ...(compilerOptions ? { compilerOptions } : {}),
      ...(include ? { include } : {}),
      ...(exclude ? { exclude } : {}),
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
    info(d)

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
    info(d)

    const a = await getPackages(d)
    for (const filePath of genFilePath(a)) await handlePackageDirectory(dirname(filePath))
  } catch (e) {
    handleError(e)
  }
}
