import { Component } from 'solid-js'
import { Button } from 'ui'
import ConfirmModal from '~/modals/ConfirmModal'
import { formatTimeToString } from '~/utils'

interface Props {
  groupIndex: number
  projectIndex: number
  project: TProject
}
export const ProjectDashboard: Component<Props> = (props) => {
  const navigate = useNavigate()
  const [_userState, setUserState] = useUserState()
  const runningIndex = () => props.project.logs.findIndex((log) => !log.done)
  const running = () => runningIndex() !== -1

  const totalLoggedTime = () =>
    props.project.logs.reduce(
      (sum, log) => sum + log.endedAt - log.startedAt,
      0
    ) / 1000


  function toggle() {
    if (running()) {
      setUserState(
        'projectGroups',
        props.groupIndex,
        'projects',
        props.projectIndex,
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
        props.groupIndex,
        'projects',
        props.projectIndex,
        'logs',
        props.project.logs.length,
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

  function removeProject() {
    navigate('/')
    setUserState('projectGroups', props.groupIndex, 'projects', (projects) =>
      projects.filter((project) => project.id !== props.project.id)
    )
  }

  return (
    <div class="bg-green-900 p-5 rounded-xl flex flex-col gap-3">
      <h2 class="flex text-xl justify-between font-bold items-baseline">
        {/* Project Details */}
        <span>{props.project.name}</span>
        <div
          class="badge-sm uppercase font-bold badge"
          classList={{
            'badge-error': !props.project.paid,
          }}
        >
          {props.project.paid ? 'Paid' : 'Unpaid'} Project
        </div>
      </h2>
      <p>{props.project.description}</p>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        <For
          each={[
            {
              title: 'Total Logged Time',
              content: () => (
                <span class="font-bold">{formatTimeToString(totalLoggedTime())}</span>
              ),
            },
            {
              title: 'Hourly Rate',
              condition: () => props.project.paid,
              content: () => (
                <>
                  <span class="font-bold">{props.project.hourlyRate}</span>
                  {props.project.currency}/hr
                </>
              ),
            },
            {
              title: 'Total Earnings',
              condition: () => props.project.paid,
              content: () => (
                <>
                  <span class="font-bold">
                    {round(
                      (totalLoggedTime() / 3600) * props.project.hourlyRate,
                      2
                    )}{' '}
                  </span>
                  <span>{props.project.currency}</span>
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
            running() ? 'i-carbon-pause-filled' : 'i-carbon-play-filled-alt'
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
          <Button icon="i-carbon-delete" class="btn-ghost text-error btn-sm">
            Delete
          </Button>
        </ConfirmModal>
      </div>
    </div>
  )
}
