import { Component } from 'solid-js'
import { A } from 'solid-start'
import { LogCard } from '~/components/LogCard'
import { ProjectDashboard } from '~/components/ProjectDashboard'
import { ReactiveSet } from '@solid-primitives/set'

export const ProjectPage: Component = () => {
  const [userState, setUserState] = useUserState()
  const [appState, setAppState] = useAppState()

  const params = useParams()

  const [error, setError] = createSignal<string>('')

  // find group
  const groupIndex = userState.projectGroups.findIndex(
    (group) => group.id === params.group
  )
  const group = userState.projectGroups[groupIndex]
  if (groupIndex === -1) setError(`group with id ${params.group} not found`)

  // find project
  let project!: TProject
  let projectIndex: number

  if (group) {
    projectIndex = group.projects.findIndex(
      (project) => project.id === params.id
    )
    if (projectIndex === -1)
      setError(`project with id ${params.id} not found in group ${group.name}`)
    else project = group.projects[projectIndex]
  }

  const selectedLogs = new ReactiveSet<TActivityLog['id']>()
  createEffect(
    on(
      () => selectedLogs.size,
      (size) => setAppState('mode', size > 0 ? 'selection' : 'default')
    )
  )
  // check if a log is ongoing
  const runningIndex = () => project.logs.findIndex((log) => !log.done)
  const running = () => runningIndex() !== -1

  type Timer = ReturnType<typeof setInterval>
  let interval: Timer | undefined

  createEffect(() => {
    if (!running()) return
    clearInterval(interval)
    interval = setInterval(() => {
      if (!running()) {
        clearInterval(interval)
        interval = undefined
        return
      }
      setUserState(
        'projectGroups',
        groupIndex,
        'projects',
        projectIndex,
        'logs',
        runningIndex(),
        'endedAt',
        Date.now()
      )
    }, 1000)
  })

  return (
    <div class="flex flex-col gap-5 p-5">
      <nav class="flex">
        <A
          class="p-2 bg-stone-800 grid place-content-center rounded-full"
          href="/"
          aria-label="go back"
        >
          <span class="i-carbon-arrow-left text-xl" />
        </A>
      </nav>
      <main>
        <Show
          when={!error()}
          fallback={<div class="alert alert-error">{error}</div>}
        >
          <ProjectDashboard {...{ groupIndex, projectIndex, project, selectedLogs }} />

          {/* Logs */}
          <div class="py-5 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
            <For each={[...project.logs].reverse()}>
              {(log, index) => (
                <LogCard
                  onSelectChange={(selected) =>
                    selected
                      ? selectedLogs.add(log.id)
                      : selectedLogs.delete(log.id)
                  }
                  logIndex={() => project.logs.length - index()}
                  {...{ groupIndex, projectIndex, project, log }}
                />
              )}
            </For>
          </div>
        </Show>
      </main>
    </div>
  )
}

export default ProjectPage
