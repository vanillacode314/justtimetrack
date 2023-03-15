import { projectGroupSchema } from '~/types'
import { createStorageStore } from '~/utils/stores'
import z from 'zod'

const appStateSchema = z.object({
  drawerVisible: z.boolean().default(false),
  selectedProjectGroupId: z.string().default(''),
})
export type TAppState = z.infer<typeof appStateSchema>
const [appState, setAppState] = createStore<TAppState>(appStateSchema.parse({}))

const userStateSchema = z.object({
  projectGroups: projectGroupSchema.array().default([]),
})
export type TUserState = z.infer<typeof userStateSchema>
const [userState, setUserState] = createStorageStore(
  'user-state',
  userStateSchema.parse({}),
  {
    schema: userStateSchema,
  }
)

export const useAppState = () => [appState, setAppState] as const
export const useUserState = () =>
  [
    userState,
    setUserState,
    () => setUserState(userStateSchema.parse({})),
  ] as const
