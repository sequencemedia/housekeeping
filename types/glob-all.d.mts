declare module 'glob-all' {
  export default function (patterns: string | string[], callback: (e: Error | null, filePaths: string[]) => void): void
}
