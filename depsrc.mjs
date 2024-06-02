#!/usr/bin/env node

import debug from 'debug'

import {
  Command
} from 'commander'

import getPackage from './src/common/get-package.mjs'
import getPackageName from './src/common/get-package-name.mjs'
import getPackageVersion from './src/common/get-package-version.mjs'
import normalise from './src/common/normalise.mjs'

import D from './src/depsrc.mjs'

const log = debug('housekeeping')

log('`housekeeping` is awake')

const commander = new Command()

async function app () {
  const PACKAGE = await getPackage()

  const name = getPackageName(PACKAGE)

  const {
    pid,
    argv,
    env: {
      DIR = '..',
      VERSION = getPackageVersion(PACKAGE),
      DEBUG = 'housekeeping*'
    }
  } = process

  debug.enable(DEBUG)

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Directory path')
    .parse(argv)

  const {
    dir = DIR
  } = commander.opts()

  const directory = normalise(dir)

  log({
    directory
  })

  return await D(directory)
}

export default app()
