import { Component } from 'solid-js'
import { A } from 'solid-start'
import { Button } from 'ui'
import {
  CommentLogModal,
  setCommentLogModalOpen,
} from '~/modals/CommentLogModal'
import ConfirmModal from '~/modals/ConfirmModal'
import { prompt } from '~/modals/PromptModal'

export const ProjectPage: Component = () => {
  const [userState, setUserState] = useUserState()

  const params = useParams()
  const navigate = useNavigate()

  const [selectedLog, setSelectedLog] = createSignal<TActivityLog>()

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
      (project) => project.id === params.name
    )
    if (projectIndex === -1)
      setError(
        `project with id ${params.name} not found in group ${group.name}`
      )
    else project = group.projects[projectIndex]
  }

  // check if a log is ongoing
  const runningIndex = () => project.logs.findIndex((log) => !log.done)
  const running = () => runningIndex() !== -1

  // utils
  const totalLoggedTime = () =>
    project.logs.reduce((sum, log) => sum + log.endedAt - log.startedAt, 0) /
    1000

  const formatTime = (inputSeconds: number) => {
    const { hours, minutes, seconds } = formatSeconds(inputSeconds)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const removeLog = (id: TActivityLog['id']) =>
    setUserState(
      'projectGroups',
      groupIndex,
      'projects',
      projectIndex,
      'logs',
      (logs) => logs.filter((log) => log.id !== id)
    )

  const removeProject = () => {
    navigate('/')
    setUserState('projectGroups', groupIndex, 'projects', (projects) =>
      projects.filter((project) => project.id !== params.name)
    )
  }

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

  const toggle = () => {
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
          <div class="bg-green-900 p-5 rounded-xl flex flex-col gap-3">
            <h2 class="flex text-xl justify-between font-bold items-baseline">
              {/* Project Details */}
              <span>{project.name}</span>
              <div
                class="badge-sm uppercase font-bold badge"
                classList={{
                  'badge-error': !project.paid,
                }}
              >
                {project.paid ? 'Paid' : 'Unpaid'} Project
              </div>
            </h2>
            <p>{project.description}</p>
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              <For
                each={[
                  {
                    title: 'Total Logged Time',
                    content: () => (
                      <span class="font-bold">
                        {formatTime(totalLoggedTime())}
                      </span>
                    ),
                  },
                  {
                    title: 'Hourly Rate',
                    condition: () => project.paid,
                    content: () => (
                      <>
                        <span class="font-bold">{project.hourlyRate}</span>
                        {project.currency}/hr
                      </>
                    ),
                  },
                  {
                    title: 'Total Earnings',
                    condition: () => project.paid,
                    content: () => (
                      <>
                        <span class="font-boldsemiboli">
                          {round(
                            (totalLoggedTime() / 3600) * project.hourlyRate,
                            2
                          )}{' '}
                        </span>
                        <span>{project.currency}</span>
                      </>
                    ),
                  },
                ]}
              >
                {({ title, content, condition }) => (
                  <Show when={condition?.() ?? true}>
                    <article class="flex flex-col p-5 gap-1 bg-black/10 rounded-xl w-full">
                      <span class="font-medium uppercase tracking-wide text-xs">
                        {title}
                      </span>
                      <span class="text-xl flex gap-1">{content()}</span>
                    </article>
                  </Show>
                )}
              </For>
            </div>

            {/* Action Buttons */}
            <div class="flex flex-col md:flex-row items-end justify-end gap-3 mt-3">
              <Button
                class="btn-accent btn-sm"
                icon={
                  running()
                    ? 'i-carbon-pause-filled'
                    : 'i-carbon-play-filled-alt'
                }
                onClick={() => toggle()}
              >
                {running() ? 'Stop' : 'Start'}
              </Button>
              {/* TODO: implement print */}
              {/* <Button class="btn-ghost btn-sm" icon="i-carbon-printer"> */}
              {/*   Print */}
              {/* </Button> */}
              <ConfirmModal
                title="Delete Project"
                message="Are you sure you would like to delete this project?"
                icon="i-mdi-warning"
                onConfirm={removeProject}
              >
                <Button
                  icon="i-carbon-delete"
                  class="btn-ghost text-error btn-sm"
                >
                  Delete
                </Button>
              </ConfirmModal>
            </div>
          </div>

          {/* Logs */}
          <div class="py-5 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
            <For each={[...project.logs].reverse()}>
              {(log, index) => (
                <article
                  class="p-5 rounded-xl"
                  classList={{
                    'bg-stone-900': log.done,
                    'bg-green-900': !log.done,
                  }}
                >
                  {/* Log Title */}
                  <h3 class="flex justify-between items-baseline mb-3">
                    <div class="uppercase font-bold text-lg">
                      Log {project.logs.length - index()}
                    </div>
                    <div
                      class="uppercase font-bold badge badge-sm"
                      classList={{
                        'badge-success': log.done,
                      }}
                    >
                      {log.done ? 'Done' : 'Ongoing'}
                    </div>
                  </h3>

                  {/* Log Data */}
                  <div class="items-baseline flex flex-col gap-3">
                    <For
                      each={[
                        // {
                        //   title: 'ID',
                        //   content: () => log.id,
                        // },
                        {
                          title: 'Start',
                          content: () =>
                            new Date(log.startedAt).toLocaleString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                            }),
                        },
                        {
                          title: 'End',
                          content: () =>
                            new Date(log.endedAt).toLocaleString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                            }),
                        },
                        {
                          title: 'Duration',
                          content: () =>
                            formatTime((log.endedAt - log.startedAt) / 1000),
                        },
                        {
                          title: 'Comment',
                          content: () => log.comment || 'None',
                        },
                      ]}
                    >
                      {({ title, content }) => (
                        <p class="flex gap-1 items-baseline">
                          <span>{title}:</span>
                          <span class="font-bold hyphens-auto break-all">
                            {content?.()}
                          </span>
                        </p>
                      )}
                    </For>
                  </div>

                  {/* Log Action Buttons */}
                  {log.done && (
                    <div class="flex gap-3 justify-end mt-auto pt-5">
                      <Button
                        class="btn-sm btn-primary"
                        icon="i-mdi-pencil"
                        onClick={async () => {
                          const comment = await prompt({
                            title: 'Comment',
                            message: 'Enter a comment',
                            initialValue: log.comment,
                          })
                          if (!comment) return
                          setUserState(
                            'projectGroups',
                            groupIndex,
                            'projects',
                            projectIndex,
                            'logs',
                            project.logs.indexOf(log),
                            'comment',
                            comment
                          )
                        }}
                      >
                        Comment
                      </Button>
                      <Button
                        class="btn-sm btn-ghost text-error"
                        icon="i-mdi-delete"
                        onClick={() => removeLog(log.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </article>
              )}
            </For>
          </div>
        </Show>
      </main>
    </div>
  )
}

export default ProjectPage
