#!/usr/bin/env node

import {
  Command
} from 'commander'

import debug from '#housekeeping/debug'

import toHomeDir from './src/common/to-home-dir.mjs'
import getPackage from './src/common/get-package.mjs'
import getPackageName from './src/common/get-package-name.mjs'
import getPackageVersion from './src/common/get-package-version.mjs'
import normalise from './src/common/normalise.mjs'

import J from './src/jsconfig.mjs'

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

  const directory = normalise(dir)

  log({
    directory: toHomeDir(directory)
  })

  await J(directory)
}

export default app()
