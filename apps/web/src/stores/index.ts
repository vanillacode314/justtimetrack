import { createComputed } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";
import type { IProjectGroup } from "~/types";

const createLocalStorageStore = <T extends Record<string, any>>(
  localStorageKey: string,
  initialValue: T
) => {
  const [store, set] = createStore<T>(initialValue);

  if (!isServer) {
    const localStorageValue = localStorage.getItem(localStorageKey);
    localStorageValue
      ? set(JSON.parse(localStorageValue))
      : localStorage.setItem(localStorageKey, JSON.stringify(initialValue));
  }

  createComputed(
    () =>
      !isServer && localStorage.setItem(localStorageKey, JSON.stringify(store))
  );

  return [store, set] as const;
};

export interface IAppState {
  drawerVisible: boolean;
}

export interface IUserState {
  projectGroups: IProjectGroup[];
}

const [appState, setAppState] = createStore<IAppState>({
  drawerVisible: false,
});

const [userState, setUserState] = createLocalStorageStore<IUserState>(
  "user-state",
  {
    projectGroups: [],
  }
);

export const useAppState = () => [appState, setAppState] as const;
export const useUserState = () => [userState, setUserState] as const;
