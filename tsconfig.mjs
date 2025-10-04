#!/usr/bin/env node

import debug from '#housekeeping/debug'

import {
  Command
} from 'commander'

import formatDirectory from './src/common/format-directory.mjs'
import getPackage from './src/common/get-package.mjs'
import getPackageName from './src/common/get-package-name.mjs'
import getPackageVersion from './src/common/get-package-version.mjs'
import normaliseDirectory from './src/common/normalise-directory.mjs'

import T from './src/tsconfig.mjs'

const log = debug('housekeeping')

log('`housekeeping/tsconfig` is awake')

const {
  table
} = console

const commander = new Command()

async function app () {
  const PACKAGE = await getPackage()

  const name = getPackageName(PACKAGE)

  const {
    pid,
    argv,
    env: {
      DIR = '..',
      VERSION = getPackageVersion(PACKAGE)
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Directory path')
    .parse(argv)

  const {
    dir = DIR
  } = commander.opts()

  const directory = normaliseDirectory(dir)

  table({
    directory: formatDirectory(directory)
  })

  await T(directory)
}

export default app()
