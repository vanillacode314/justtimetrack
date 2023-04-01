import { ReactiveSet } from '@solid-primitives/set'
import { Component } from 'solid-js'
import { formatTimeToString } from '~/utils'

interface Props {
  deleteProjectModalOpen?: () => boolean
  group: TProjectGroup
  groupIndex: number
  projectIndex: number
  project: TProject
  selectedLogs: ReactiveSet<TActivityLog['id']>
}
export const ProjectDashboard: Component<Props> = (props) => {
  const [_userState, _setUserState] = useUserState()
  const stats = () =>
    props.selectedLogs.size === 0
      ? [
          {
            title: 'Total Logged Time',
            content: () => (
              <span class="font-bold">
                {formatTimeToString(totalLoggedTime(props.project.logs))}
              </span>
            ),
          },
          {
            title: 'Hourly Rate',
            condition: props.project.paid,
            content: () => (
              <>
                <span class="font-bold">{props.project.hourlyRate}</span>
                {props.project.currency}/hr
              </>
            ),
          },
          {
            title: 'Total Earnings',
            condition: props.project.paid,
            content: () => (
              <>
                <span class="font-bold">
                  {round(
                    (totalLoggedTime(props.project.logs) / 3600) *
                      props.project.hourlyRate,
                    2
                  )}{' '}
                </span>
                <span>{props.project.currency}</span>
              </>
            ),
          },
        ]
      : [
          {
            title: 'Selected Logged Time',
            content: () => (
              <span class="font-bold">
                {formatTimeToString(
                  totalLoggedTime(
                    props.project.logs.filter((log) =>
                      props.selectedLogs.has(log.id)
                    )
                  )
                )}
              </span>
            ),
          },
          {
            title: 'Hourly Rate',
            condition: props.project.paid,
            content: () => (
              <>
                <span class="font-bold">{props.project.hourlyRate}</span>
                {props.project.currency}/hr
              </>
            ),
          },
          {
            title: 'Selected Earnings',
            condition: props.project.paid,
            content: () => (
              <>
                <span class="font-bold">
                  {round(
                    (totalLoggedTime(
                      props.project.logs.filter((log) =>
                        props.selectedLogs.has(log.id)
                      )
                    ) /
                      3600) *
                      props.project.hourlyRate,
                    2
                  )}{' '}
                </span>
                <span>{props.project.currency}</span>
              </>
            ),
          },
        ]

  const totalLoggedTime = (logs: TActivityLog[]) =>
    logs.reduce((sum, log) => sum + log.endedAt - log.startedAt, 0) / 1000

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
        <For each={stats().filter((stat) => stat.condition ?? true)}>
          {({ title, content }) => (
            <article class="flex flex-col p-5 gap-1 bg-black/10 rounded-xl w-full">
              <span class="font-medium uppercase tracking-wide text-xs">
                {title}
              </span>
              <span class="text-xl flex gap-1">{content()}</span>
            </article>
          )}
        </For>
      </div>
    </div>
  )
}
