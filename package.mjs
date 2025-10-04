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

import P from './src/package.mjs'

const log = debug('housekeeping')

log('`housekeeping/package` is awake')

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
      REGEXP = '^Jonathan Perry',
      VERSION = getPackageVersion(PACKAGE)
    }
  } = process

  log(`Starting application "${name}" in process ${pid}.`)

  commander
    .version(VERSION)
    .option('-d, --dir [dir]', 'Directory path')
    .option('-a, --author [author]', 'Package author')
    .option('-r, --regexp [regexp]', 'Package author Regular Expression')
    .parse(argv)

  const {
    dir = DIR,
    author = AUTHOR,
    regexp = REGEXP
  } = commander.opts()

  const directory = normaliseDirectory(dir)

  table({
    directory: formatDirectory(directory)
  })

  table(typeof author === 'string' ? { author } : author)

  table({
    regexp
  })

  await P(directory, author, regexp)
}

export default app()
