import { Component } from 'solid-js'
import { A } from 'solid-start'
import { LogCard } from '~/components/LogCard'
import { ProjectDashboard } from '~/components/ProjectDashboard'
import { ReactiveSet } from '@solid-primitives/set'
import { removeProject } from '~/stores'
import ConfirmModal from '~/modals/ConfirmModal'
import { exportsSchema } from '~/types'

export const ProjectPage: Component = () => {
  const [userState, setUserState] = useUserState()
  const [appState, setAppState] = useAppState()

  const navigate = useNavigate()
  const params = useParams()

  const [error, setError] = createSignal<string>('')
  const [deleteProjectModalOpen, setDeleteProjectModalOpen] =
    createSignal<boolean>(false)

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

  function toggle() {
    if (running()) {
      setUserState(
        'projectGroups',
        groupIndex,
        'projects',
        projectIndex,
        'logs',
        runningIndex(),
        produce((log) => {
          log.endedAt = Date.now()
          log.done = true
        })
      )
    } else {
      setUserState(
        'projectGroups',
        groupIndex,
        'projects',
        projectIndex,
        'logs',
        project.logs.length,
        {
          id: crypto.randomUUID(),
          startedAt: Date.now(),
          endedAt: Date.now(),
          done: false,
          comment: '',
        }
      )
    }
  }

  const [copyState, setCopyState] = createSignal<
    'neutral' | 'success' | 'error'
  >('neutral')
  setActions([
    {
      icon: 'i-mdi-arrow-left',
      label: 'Back',
      action: () => navigate('/'),
    },
    'spacer',
    {
      id: 'clipboard',
      icon: 'i-mdi-clipboard',
      label: () =>
        copyState() === 'neutral'
          ? 'Copy Project ID'
          : copyState() === 'success'
          ? 'Copy Success'
          : 'Copy Error',
      classes: () =>
        copyState() === 'neutral'
          ? ''
          : copyState() === 'success'
          ? 'btn-success'
          : 'btn-error',
      action: async () => {
        setCopyState('neutral')
        try {
          await navigator.clipboard.writeText(String(project.id))
          setCopyState('success')
        } catch {
          setCopyState('error')
        } finally {
          setTimeout(() => {
            setCopyState('neutral')
          }, 3000)
        }
      },
    },
    {
      icon: 'i-mdi-export',
      label: 'Export',
      action: () => {
        const dateString = new Date().toLocaleString(navigator.language, {
          dateStyle: 'short',
          timeStyle: 'short',
          hour12: false,
        })
        exportToJsonFile(
          exportsSchema.parse({
            projectGroups: [
              {
                ...group,
                projects: group.projects.filter(
                  ($project) => $project.id === project.id
                ),
              },
            ],
          }),
          `justtimetrack-${project.name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/ /g, '_')}-${dateString}.json`
        )
      },
    },
    {
      icon: 'i-mdi-trash',
      label: 'Delete',
      action: () => setDeleteProjectModalOpen(true),
    },
    {
      icon: () => (running() ? 'i-mdi-pause' : 'i-mdi-play'),
      classes: () => (running() ? 'btn-warning' : 'btn-primary'),
      label: () => (running() ? 'Pause' : 'Start'),
      action: toggle,
    },
  ])

  return (
    <div class="flex flex-col gap-5">
      <main>
        <Show
          when={!error()}
          fallback={<div class="alert alert-error">{error}</div>}
        >
          <ProjectDashboard
            {...{ group, groupIndex, projectIndex, project, selectedLogs }}
          />
          <ConfirmModal
            open={deleteProjectModalOpen}
            onClose={() => setDeleteProjectModalOpen(false)}
            title="Delete Project"
            message="Are you sure you would like to delete this project?"
            icon="i-mdi-warning"
            onConfirm={() => {
              navigate('/')
              removeProject(group.id, project.id)
            }}
          />
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
