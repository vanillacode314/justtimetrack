import { For, Show } from 'solid-js'
import { produce } from 'solid-js/store'
import { A } from 'solid-start'
import { Accordion } from '~/components/Accordion'
import { useUserState } from '~/stores'
import { IProject, IProjectGroup } from '~/types'

export default function HomePage() {
  const [userState, setUserState] = useUserState()

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

  function pauseProject(group: IProjectGroup, project: IProject) {
    const groupIndex = userState.projectGroups.findIndex(
      ({ id }) => id === group.id
    )
    const projectIndex = group.projects.findIndex(({ id }) => id === project.id)
    setUserState(
      'projectGroups',
      groupIndex,
      'projects',
      projectIndex,
      'logs',
      project.logs.length - 1,
      produce((log) => {
        log.endedAt = Date.now()
        log.done = true
      })
    )
  }

  return (
    <main class="p-5 h-full flex flex-col gap-5">
      <Show
        when={userState.projectGroups.length > 0}
        fallback={
          <div class="text-center grid justify-items-center place-content-center gap-5 h-full">
            <p class="uppercase font-bold text-4xl">You have no projects yet</p>
            <label
              for="add-new-project-modal"
              class="flex gap-1 items-center btn btn-primary"
            >
              <div class="i-carbon-add text-xl" />
              <span>Add new project</span>
            </label>
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
                  <div class="p-5 rounded bg-green-900 flex gap-5 items-center justify-between">
                    <h2 class="font-bold uppercase">
                      {group.name} / {project.name}
                    </h2>
                    <button
                      class="bg-stone-900 rounded-full aspect-square p-3 grid place-content-center hover:bg-stone-800 focus:bg-stone-800"
                      onClick={() => pauseProject(group, project)}
                    >
                      <span class="i-carbon-pause-filled"></span>
                    </button>
                  </div>
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
            items={userState.projectGroups.map((group) => ({
              title: group.name,
              data: group,
            }))}
          >
            {({ id: groupId, name: groupName, projects }) => (
              <Show
                when={projects.length > 0}
                fallback={
                  <div class="text-center flex flex-col items-center gap-5 h-full p-5">
                    <p class="uppercase font-bold">Empty Group</p>
                    <label
                      for="add-new-project-modal"
                      class="flex gap-1 items-center btn btn-primary"
                    >
                      <div class="i-carbon-add text-xl" />
                      <span>Add new project</span>
                    </label>
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
