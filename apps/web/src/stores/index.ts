import { createComputed } from 'solid-js'
import { createStore } from 'solid-js/store'
import { isServer } from 'solid-js/web'
import type { IProjectGroup } from '~/types'

interface LocalStorageStoreOptions<T = any> {
  serializer: (input: T) => string
  deserializer: (input: string) => T
}
const createLocalStorageStore = <T extends Record<string, any>>(
  localStorageKey: string,
  initialValue: T,
  {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
  }: Partial<LocalStorageStoreOptions<T>> = {}
) => {
  const [store, set] = createStore<T>(initialValue)

  function getLocalStorageValue() {
    const localStorageValue = localStorage.getItem(localStorageKey)
    localStorageValue
      ? set(deserializer(localStorageValue))
      : localStorage.setItem(localStorageKey, serializer(initialValue))
  }

  if (!isServer) {
    getLocalStorageValue()
    window.addEventListener('storage', () => getLocalStorageValue())
  }

  createComputed(
    () => !isServer && localStorage.setItem(localStorageKey, serializer(store))
  )

  return [store, set] as const
}

export interface IAppState {
  drawerVisible: boolean
}

export interface IUserState {
  projectGroups: IProjectGroup[]
}

const [appState, setAppState] = createStore<IAppState>({
  drawerVisible: false,
})

const [userState, setUserState] = createLocalStorageStore<IUserState>(
  'user-state',
  {
    projectGroups: [],
  }
)

export const useAppState = () => [appState, setAppState] as const
export const useUserState = () => [userState, setUserState] as const
