#!/usr/bin/env node

import 'dotenv/config'

import debug from 'debug'

import psList from 'ps-list'

import commander from 'commander'

import {
  readFile
} from 'fs/promises'

import P from './src/package.mjs'
import D from './src/depsrc.mjs'
import E from './src/eslintrc.mjs'

import getPackageName from './src/common/get-package-name.mjs'

import getPackageAuthor from './src/common/get-package-author.mjs'

import getPackageVersion from './src/common/get-package-version.mjs'

const {
  env: {
    DEBUG = 'housekeeping*'
  }
} = process

debug.enable(DEBUG)

const log = debug('housekeeping')

log('`housekeeping` is awake')

const NAME = 'housek'
process.title = NAME

async function app () {
  const PACKAGE = JSON.parse(await readFile('./package.json', 'utf8'))

  const name = getPackageName(PACKAGE)

  /**
   *  Permit only one instance of the application
   */
  try {
    const a = (await psList())
      .filter(({ name }) => name === NAME)

    if (a.length > 1) {
      const {
        pid: PID
      } = process

      const {
        pid
      } = a.find(({ pid }) => pid !== PID)

      const log = debug('housekeeping:process:log')

      log(`Killing application "${name}" in process ${pid}.`)

      process.kill(pid)
    }
  } catch ({ message }) {
    const error = debug('housekeeping:process:error')

    error(message)
    return
  }

  const log = debug('housekeeping:log')

  const {
    pid,
    argv,
    env: {
      DIR = '..',
      AUTHOR = getPackageAuthor(PACKAGE),
      VERSION = getPackageVersion(PACKAGE)
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Root directory path')
    .option('-a, --author [author]', 'Package author')
    .parse(argv)

  const {
    dir = DIR,
    author = AUTHOR
  } = commander.opts()

  await P(dir, author)

  await D(dir)

  await E(dir)
}

export default app()
