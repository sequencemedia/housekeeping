#!/usr/bin/env node

import debug from '#housekeeping/debug'

import {
  Command
} from 'commander'

import formatDirectory from './src/common/format-directory.mjs'
import getPackage from './src/common/get-package.mjs'
import getPackageName from './src/common/get-package-name.mjs'
import getPackageAuthor from './src/common/get-package-author.mjs'
import getPackageVersion from './src/common/get-package-version.mjs'
import normaliseDirectory from './src/common/normalise-directory.mjs'

import D from './src/depsrc.mjs'

const log = debug('housekeeping')

log('`housekeeping/depsrc` is awake')

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
      AUTHOR = getPackageAuthor(PACKAGE),
      VERSION = getPackageVersion(PACKAGE)
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Directory path')
    .option('-a, --author [author]', 'Package author')
    .parse(argv)

  const {
    dir = DIR,
    author = AUTHOR
  } = commander.opts()

  const directory = normaliseDirectory(dir)

  table({
    directory: formatDirectory(directory)
  })

  table(author)

  await D(directory, author)
}

export default app()
