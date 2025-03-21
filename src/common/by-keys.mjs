function sortKeys ([alpha], [omega]) {
  return (
    alpha
      .localeCompare(omega)
  )
}

export default function byKeys (object) {
  return (
    Object.fromEntries(
      Object.entries(object)
        .sort(sortKeys)
    )
  )
}
