import { Button } from 'ui'
import { setAddNewProjectModalOpen } from '~/modals/AddNewProjectModal'
import ConfirmModal from '~/modals/ConfirmModal'
import { setActions, userStateSchema } from '~/stores'
import * as devalue from 'devalue'
import { projectGroupSchema } from '~/types'

export default function HomePage() {
  const [userState, setUserState] = useUserState()
  const [appState, setAppState] = useAppState()

  const exportsSchema = z.object({
    projectGroups: projectGroupSchema.array(),
  })

  setActions([
    'spacer',
    {
      icon: 'i-mdi-import',
      label: 'Import Project(s)',
      action: async () => {
        const json = await getFile()
        if (!json) return
        const result = exportsSchema.safeParse(devalue.parse(json))
        if (!result.success) {
          toast('Error importing projects', 'Malformed data file', {
            type: 'error',
            duration: 5000,
          })
          return
        }
        const { projectGroups } = result.data
        setUserState('projectGroups', (groups) =>
          userStateSchema.shape.projectGroups.parse([
            ...groups,
            ...projectGroups,
          ])
        )
      },
    },
    {
      icon: 'i-mdi-export',
      label: 'Export All',
      action: () => {
        const dateString = new Date().toLocaleString(navigator.language, {
          dateStyle: 'short',
          timeStyle: 'short',
          hour12: false,
        })
        exportToJsonFile(
          exportsSchema.parse(userState),
          `justtimetrack-${dateString}.json`
        )
      },
    },
    {
      icon: 'i-carbon-add',
      label: 'Add',
      classes: 'btn-primary',
      action: () => setAddNewProjectModalOpen(true),
    },
  ])

  const runningProjects = () => {
    const retval = []
    for (const group of userState.projectGroups) {
      for (const project of group.projects) {
        if (project.logs.some((log) => !log.done))
          retval.push({ group, project })
      }
    }
    return retval
  }

  function pauseProject(group: TProjectGroup, project: TProject) {
    setUserState(
      'projectGroups',
      ({ id }) => id === group.id,
      'projects',
      ({ id }) => id === project.id,
      'logs',
      project.logs.length - 1,
      produce((log) => {
        log.endedAt = Date.now()
        log.done = true
      })
    )
  }

  return (
    <main class="h-full flex flex-col gap-5">
      <Show
        when={userState.projectGroups.length > 0}
        fallback={
          <div class="text-center grid justify-items-center place-content-center gap-5 h-full">
            <p class="uppercase font-bold text-4xl">No projects yet</p>
            <Button
              onClick={() => setAddNewProjectModalOpen(true)}
              icon="i-carbon-add"
              class="btn-primary"
            >
              Add new project
            </Button>
          </div>
        }
      >
        <Show when={runningProjects().length > 0}>
          <section>
            <h2 class="uppercase font-bold tracking-wider text-sm mb-2">
              Running Projects
            </h2>
            <div class="flex gap-5">
              <For each={runningProjects()}>
                {({ group, project }) => (
                  <A
                    class="p-5 rounded bg-green-900 flex gap-5 items-center justify-between cursor-pointer hover:bg-green-800 hover:shadow-none shadow"
                    href={`/project/${group.id}/${project.id}`}
                  >
                    <h2 class="font-bold uppercase">
                      {group.name} / {project.name}
                    </h2>
                    <button
                      class="bg-stone-900 rounded-full aspect-square p-3 grid place-content-center hover:bg-stone-800 focus:bg-stone-800"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        pauseProject(group, project)
                      }}
                    >
                      <span class="i-carbon-pause-filled"></span>
                    </button>
                  </A>
                )}
              </For>
            </div>
          </section>
        </Show>
        <section>
          <h2 class="uppercase font-bold tracking-wider text-sm mb-2">
            All Projects
          </h2>
          <Accordion
            onChange={(item) => setUserState('lastActiveGroup', item?.id ?? '')}
            activeIndex={userState.projectGroups.findIndex(
              (group) => group.id === userState.lastActiveGroup
            )}
            items={userState.projectGroups.map((group) => ({
              title: group.name,
              data: group,
            }))}
          >
            {({ id: groupId, name: _groupName, projects }) => (
              <Show
                when={projects.length > 0}
                fallback={
                  <div class="text-center flex flex-col items-center gap-5 h-full p-5">
                    <p class="uppercase font-bold">Empty Group</p>
                    <Button
                      onClick={() => {
                        setAppState('selectedProjectGroupId', groupId)
                        setAddNewProjectModalOpen(true)
                      }}
                      icon="i-carbon-add"
                      class="btn-primary"
                    >
                      Add new project
                    </Button>
                    <p class="uppercase font-bold">OR</p>
                    <ConfirmModal
                      title="Delete Group"
                      message="Are you sure you want to delete this group?"
                      icon="i-mdi-warning"
                      onConfirm={() => {
                        batch(() => {
                          setAppState('selectedProjectGroupId', '')
                          userState.lastActiveGroup === groupId &&
                            setUserState('lastActiveGroup', '')
                          setUserState(
                            'projectGroups',
                            userState.projectGroups.filter(
                              (group) => group.id !== groupId
                            )
                          )
                        })
                      }}
                    >
                      <Button icon="i-mdi-trash" class="btn-error">
                        Delete Group
                      </Button>
                    </ConfirmModal>
                  </div>
                }
              >
                <div class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-3 p-5">
                  <For each={projects}>
                    {({ id: projectId, name: projectName, description }) => (
                      <A
                        href={`/project/${groupId}/${projectId}`}
                        class="px-5 py-3 gap-1 rounded bg-base-100 flex flex-col hover:bg-green-900 transition-colors"
                      >
                        <h2 class="font-bold uppercase flex gap-1 items-baseline justify-between">
                          {projectName}
                        </h2>
                        <p>{description}</p>
                      </A>
                    )}
                  </For>
                </div>
              </Show>
            )}
          </Accordion>
        </section>
      </Show>
    </main>
  )
}
