import debug from 'debug'

import {
  resolve
} from 'path'

import {
  readFile,
  writeFile
} from 'fs/promises'

import getPackages from './common/get-packages.mjs'

const log = debug('housekeeping')
const info = debug('housekeeping:package')

log('`housekeeping:package` is awake')

const transform = (v) => resolve(v) // constrain to one arg

async function execute (p, AUTHOR, REGEXP, d) {
  log('execute')

  try {
    info(p)

    let s = await readFile(p, 'utf8')
    let o = JSON.parse(s)

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
    } = o

    o = {
      ...(name ? { name } : {}),
      ...(version ? { version } : {}),
      ...(description ? { description } : {}),
      ...(keywords ? { keywords } : {}),
      ...(isPrivate ? { private: isPrivate } : {}),
      ...(main ? { main } : {}),
      ...(type ? { type } : {}),
      ...(types ? { types } : {}),
      ...(author ? (typeof author === 'string' && author.startsWith('Jonathan Perry')) ? { author: AUTHOR } : { author } : {}),
      ...(contributors ? { contributors } : {}),
      ...(license ? { license } : {}),
      ...(engines ? { engines } : {}),
      ...(repository ? { repository } : {}),
      ...(homepage ? { homepage } : {}),
      ...(bugs ? { bugs } : {}),
      ...(scripts ? { scripts } : {}),
      ...(bin ? { bin } : {}),
      ...(dependencies ? { dependencies } : {}),
      ...(devDependencies ? { devDependencies } : {}),
      ...(peerDependencies ? { peerDependencies } : {}),
      ...rest,
      ...(imports ? { imports } : {}),
      ...(exports ? { exports } : {}),
      ...(_moduleAliases ? { _moduleAliases } : {}),
      ...(husky ? { husky } : {})
    }

    s = JSON.stringify(o, null, 2).concat('\n')
    await writeFile(p, s, 'utf8')
  } catch ({ message = 'No error message defined' }) {
    log(message)
  }
}

export default async function app (directory, author) {
  log('app', directory, author)

  const array = await getPackages(transform(directory))

  await Promise.all(array.map(transform).map((p) => execute(p, author)))
}
