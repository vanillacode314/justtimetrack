import { onCleanup } from 'solid-js'
import { createEffect } from 'solid-js'
import { Show, For, createSignal, Component } from 'solid-js'
import { produce } from 'solid-js/store'
import { useNavigate, useParams } from 'solid-start'
import { CommentLogModal } from '~/modals/CommentLogModal'
import ConfirmModal from '~/modals/ConfirmModal'
import { useUserState } from '~/stores'
import { IActivityLog, IProject } from '~/types'
import { formatSeconds, round } from '~/utils'

export const ProjectPage: Component = () => {
  const [userState, setUserState] = useUserState()

  const params = useParams()
  const navigate = useNavigate()

  const [selectedLog, setSelectedLog] = createSignal<IActivityLog>()

  const [error, setError] = createSignal<string>('')

  // find group
  const groupIndex = userState.projectGroups.findIndex(
    (group) => group.id === params.group
  )
  const group = userState.projectGroups[groupIndex]
  if (groupIndex === -1) setError(`group with id ${params.group} not found`)

  // find project
  let project!: IProject
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
    project.logs.reduce((sum, log) => sum + (log.endedAt - log.startedAt), 0) /
    1000

  const formatTime = (inputSeconds: number) => {
    const { hours, minutes, seconds } = formatSeconds(inputSeconds)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const removeLog = (id: IActivityLog['id']) =>
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
    <main class="p-5">
      <Show
        when={!error()}
        fallback={<div class="alert alert-error">{error}</div>}
      >
        <div class="bg-green-900 p-5 rounded-xl flex flex-col gap-3">
          <h2 class="flex justify-between uppercase font-bold items-baseline">
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
          <div class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] justify-between gap-3">
            <span class="flex flex-col px-5 py-3 border-l-3 border-amber-500">
              <span class="tracking-wider text-xs uppercase font-semibold">
                Total Logged Time
              </span>
              <span class="text-3xl flex gap-1">
                <span class="font-semibold">
                  {formatTime(totalLoggedTime())}
                </span>
              </span>
            </span>
            <Show when={project.paid}>
              <span class="flex flex-col px-5 py-3 border-l-3 border-amber-500">
                <span class="tracking-wider text-xs uppercase font-semibold">
                  Hourly Rate
                </span>
                <span class="text-3xl flex gap-1">
                  <span class="font-semibold">{project.hourlyRate}</span>
                  {project.currency}/hr
                </span>
              </span>
              <span class="flex flex-col px-5 py-3 border-l-3 border-amber-500">
                <span class="tracking-wider text-xs uppercase font-semibold">
                  Total Earnings
                </span>
                <span class="text-3xl flex gap-1">
                  <span class="font-semibold">
                    {round((totalLoggedTime() / 3600) * project.hourlyRate!, 2)}{' '}
                  </span>
                  <span>{project.currency}</span>
                </span>
              </span>
            </Show>
          </div>

          {/* Action Buttons */}
          <div class="flex flex-col md:flex-row items-end justify-end gap-3 mt-3">
            <button
              class="btn btn-accent btn-sm flex gap-1 items-center"
              onClick={() => toggle()}
            >
              {running() ? (
                <>
                  <div class="i-carbon-pause-filled"></div>
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <div class="i-carbon-play-filled-alt"></div>
                  <span>Start</span>
                </>
              )}
            </button>
            <button class="btn btn-ghost btn-sm flex gap-1 items-center">
              <div class="i-carbon-printer"></div>
              <span>Print</span>
            </button>
            <ConfirmModal
              id="delete-project-modal"
              title="Delete Project"
              message="Are you sure you would like to delete this project?"
              onConfirm={removeProject}
            >
              <label
                for="delete-project-modal"
                class="btn btn-ghost text-error btn-sm flex gap-1 items-center"
              >
                <div class="i-carbon-delete"></div>
                <span>Delete</span>
              </label>
            </ConfirmModal>
          </div>
        </div>

        {/* Logs */}
        <div class="py-5 grid grid-cols-[repeat(auto-fill,minmax(23rem,1fr))] gap-3">
          <For each={project.logs}>
            {(log, index) => (
              <div
                class="p-5 rounded"
                classList={{
                  'bg-base-300': log.done,
                  'bg-green-900': !log.done,
                }}
              >
                {/* Log Title */}
                <h3 class="flex justify-between items-baseline mb-3">
                  <div class="uppercase font-bold text-lg">
                    Log {index() + 1}
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
                <div class="grid grid-cols-[1fr_3fr] items-baseline gap-x-3 gap-y-3">
                  <span class="uppercase text-xs font-semibold tracking-wider text-right">
                    ID:
                  </span>
                  <span class="hyphens-auto break-all">{log.id}</span>
                  <span class="uppercase text-xs font-semibold tracking-wider text-right">
                    Start:
                  </span>
                  <span>
                    {new Date(log.startedAt).toLocaleString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      weekday: 'short',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </span>
                  <span class="uppercase text-xs font-semibold tracking-wider text-right">
                    End:
                  </span>
                  <span>
                    {new Date(log.endedAt).toLocaleString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      weekday: 'short',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </span>
                  <span class="uppercase text-xs font-semibold tracking-wider text-right">
                    Duration:
                  </span>
                  <span>
                    {formatTime((log.endedAt - log.startedAt) / 1000)}
                  </span>
                  <span class="uppercase text-xs font-semibold tracking-wider text-right">
                    Comment:
                  </span>
                  <span>{log.comment || 'None'}</span>
                </div>

                {/* Modals */}
                <CommentLogModal
                  comment={() => selectedLog()?.comment ?? ''}
                  setComment={(comment) => {
                    setUserState(
                      'projectGroups',
                      groupIndex,
                      'projects',
                      projectIndex,
                      'logs',
                      project.logs.indexOf(selectedLog()!),
                      'comment',
                      comment
                    )
                  }}
                />

                {/* Log Action Buttons */}
                {log.done && (
                  <div class="flex gap-3 justify-end mt-auto pt-5">
                    <label
                      class="btn btn-sm flex gap-1 items-center"
                      for="comment-log-modal"
                      onClick={() => setSelectedLog(log)}
                    >
                      <span class="i-carbon-edit"></span>
                      <span>Comment</span>
                    </label>
                    <button
                      class="btn btn-sm flex gap-1 items-center btn-ghost text-error"
                      onClick={() => removeLog(log.id)}
                    >
                      <span class="i-carbon-delete"></span>
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </For>
        </div>
      </Show>
    </main>
  )
}

export default ProjectPage
