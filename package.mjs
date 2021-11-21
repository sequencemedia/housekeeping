import debug from 'debug'

import {
  readFileSync
} from 'fs'

import app from './src/package.mjs'

import getPackageAuthor from './src/common/get-package-author.mjs'

const PACKAGE = JSON.parse(readFileSync('./package.json'))

const {
  env: {
    DIR = '..',
    AUTHOR = getPackageAuthor(PACKAGE),
    DEBUG = 'housekeeping*'
  }
} = process

debug.enable(DEBUG)

export default app(DIR, AUTHOR)
