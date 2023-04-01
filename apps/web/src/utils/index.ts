import * as devalue from 'devalue'

export const sleep = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration))

export function round(input: number, precision: number = 2): number {
  const p = Math.pow(10, precision)
  return Math.round(input * p) / p
}
export function formatTimeToString(inputSeconds: number) {
  const { hours, minutes, seconds } = formatSeconds(inputSeconds)
  return `${hours}h ${minutes}m ${seconds}s`
}

export function formatSeconds(inputSeconds: number) {
  const hours = Math.floor(inputSeconds / 3600)
  const minutes = Math.floor((inputSeconds - hours * 3600) / 60)
  const seconds = Math.floor(inputSeconds - hours * 3600 - minutes * 60)
  return {
    hours,
    minutes,
    seconds,
  }
}

export function exportToJsonFile(jsonData: object, name = 'data.json') {
  const dataUri =
    'data:application/json;charset=utf-8,' +
    encodeURIComponent(devalue.stringify(jsonData))

  const a = document.createElement('a')
  a.setAttribute('href', dataUri)
  a.setAttribute('download', name)
  a.click()
}

export const getFile = (accept: string = '') =>
  new Promise<string | null>((resolve) => {
    const inp = document.createElement('input')
    inp.type = 'file'
    if (accept) inp.accept = accept

    inp.onchange = () => {
      const file = inp.files?.[0]
      if (!file) {
        resolve(null)
        return
      }

      file.text().then((text) => {
        resolve(text)
      })
    }

    inp.click()
  })

export const uniqBy = <T>(arr: T[], key: keyof T): T[] =>
  arr.filter(
    (value1, index) =>
      index === arr.findIndex((value2) => value2[key] === value1[key])
  )
