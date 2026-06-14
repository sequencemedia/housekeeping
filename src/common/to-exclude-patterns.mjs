export default function toExcludePatterns (directory) {
  return [
    `${directory}/node_modules`,
    `${directory}/**/node_modules`
  ]
}
