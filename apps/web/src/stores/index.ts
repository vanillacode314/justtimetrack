import { projectGroupSchema } from '~/types'
import { createStorageStore } from '~/utils/stores'
import z from 'zod'
import { uniqBy } from '~/utils'

const modesSchema = z.enum(['default', 'selection'])
export const actionSchema = z
  .object({
    id: z.string().optional(),
    icon: z
      .string()
      .transform((value) => () => value)
      .or(z.function().returns(z.string())),
    classes: z
      .string()
      .default('')
      .transform((value) => () => value)
      .or(z.function().returns(z.string())),
    label: z
      .string()
      .transform((value) => () => value)
      .or(z.function().returns(z.string())),
    mode: modesSchema.default('default'),
    action: z.function(),
    noClose: z.boolean().default(false),
    noFab: z.boolean().default(false),
  })
  .transform((action) => ({
    ...action,
    id:
      action.id ||
      action
        .label()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
  }))
export type TAction = z.infer<typeof actionSchema>

export const appStateSchema = z.object({
  actions: actionSchema.or(z.literal('spacer')).array().default([]),
  mode: modesSchema.default('default'),
  drawerVisible: z.boolean().default(false),
  selectedProjectGroupId: z.string().default(''),
})
export type TAppState = z.infer<typeof appStateSchema>
const [appState, setAppState] = createStore<TAppState>(appStateSchema.parse({}))

export const userStateSchema = z.object({
  projectGroups: projectGroupSchema
    .array()
    .default([])
    .transform((groups) => uniqBy(groups, 'id')),
  lastActiveGroup: projectGroupSchema.shape.id.default(''),
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
    { reset: () => setUserState(userStateSchema.parse({})) },
  ] as const

export const setActions = (
  actions: z.input<typeof appStateSchema>['actions']
) => {
  onMount(() => {
    setAppState({ actions: appStateSchema.shape.actions.parse(actions) })
    onCleanup(() => setAppState({ actions: [] }))
  })
}

export function removeProject(
  groupId: TProjectGroup['id'],
  projectId: TProject['id']
) {
  setUserState(
    'projectGroups',
    (group) => group.id === groupId,
    'projects',
    (projects) => projects.filter((project) => project.id !== projectId)
  )
}
