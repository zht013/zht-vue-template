export function moveArrayElement<T>(list: T[], from: number, to: number): Array<T> {
  const array = [...list]

  if (to >= 0 && to < array.length) {
    const element = array.splice(from, 1)[0]
    array.splice(to, 0, element)
  }

  return array
}
