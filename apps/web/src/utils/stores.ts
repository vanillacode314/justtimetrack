import type { Store } from 'solid-js/store'
import z from 'zod'

export async function getNextValue<T>(
  store: Store<T>,
  getKey?: (value: T) => unknown
): Promise<T> {
  return new Promise((resolve) => {
    let firstRun: boolean = true
    let _dispose!: () => void

    if (getKey) {
      let key = getKey(store)
      createRoot((dispose) => {
        _dispose = dispose
        createComputed(() => {
          if (key === getKey(store)) return
          dispose()
          resolve(store)
        })
      })
      return _dispose
    } else {
      createRoot((dispose) => {
        _dispose = dispose
        createComputed(() => {
          if (firstRun) {
            firstRun = false
            return
          }
          dispose()
          resolve(store)
        })
      })
      return _dispose
    }
  })
}

interface Storage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  onStorageChange(callback: () => void): void
}

interface StorageStoreOptions<
  TSchema extends z.ZodTypeAny,
  TData = z.input<TSchema>
> {
  schema: TSchema
  serializer: (input: TData) => string
  deserializer: (input: string) => TData
  storage: 'localStorage' | 'sessionStorage' | Storage
}

function serverSafeLocalStorage() {
  return {
    getItem: (key: string) => {
      return isServer ? null : localStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
      if (isServer) return
      localStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
      if (isServer) return
      localStorage.removeItem(key)
    },
    onStorageChange: (callback: () => void) => {
      if (isServer) return
      window.addEventListener('storage', callback)
    },
  }
}

function serverSafeSessionStorage() {
  return {
    getItem: (key: string) => {
      return isServer ? null : sessionStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
      if (isServer) return
      sessionStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
      if (isServer) return
      sessionStorage.removeItem(key)
    },
    onStorageChange: (callback: () => void) => {
      if (isServer) return
      window.addEventListener('storage', callback)
    },
  }
}

export const createStorageStore = <
  TSchema extends z.ZodTypeAny,
  TData extends Record<string, unknown> = z.input<TSchema>
>(
  storageKey: string,
  defaultValue: TData,
  {
    schema = z.any() as any,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    storage = 'localStorage',
  }: Partial<StorageStoreOptions<TSchema>> = {}
) => {
  const [store, setStore] = createStore<z.output<TSchema>>(defaultValue)
  const _storage =
    storage === 'localStorage'
      ? serverSafeLocalStorage()
      : storage === 'sessionStorage'
      ? serverSafeSessionStorage()
      : storage

  function getStorageValue() {
    const storedValue = _storage.getItem(storageKey)
    if (!storedValue) {
      _storage.setItem(storageKey, serializer(schema.parse(defaultValue)))
      return
    }

    try {
      setStore(schema.parse(deserializer(storedValue)))
    } catch (err) {
      console.error(err)
    }
  }

  if (!isServer) {
    getStorageValue()
    _storage.onStorageChange(() => getStorageValue())
  }

  createComputed(() =>
    _storage.setItem(storageKey, serializer(schema.parse(store)))
  )

  return [store, setStore] as const
}
