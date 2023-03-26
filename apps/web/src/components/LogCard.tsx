import { Component } from 'solid-js'
import { Button } from 'ui'
import { prompt } from '~/modals/PromptModal'
import { formatTimeToString } from '~/utils'

interface Props {
  log: TActivityLog
  project: TProject
  groupIndex: number
  projectIndex: number
  logIndex: () => number
  onSelectChange?: (selected: boolean) => void
}
export const LogCard: Component<Props> = (props) => {
  const [userState, setUserState] = useUserState()

  const removeLog = (id: TActivityLog['id']) =>
    setUserState(
      'projectGroups',
      props.groupIndex,
      'projects',
      props.projectIndex,
      'logs',
      (logs) => logs.filter((log) => log.id !== id)
    )

  return (
    <Selectable onChange={props.onSelectChange}>
      {() => (
        <article
          class="p-5 rounded-xl flex flex-col gap-3"
          classList={{
            'bg-stone-900': props.log.done,
            'bg-green-900': !props.log.done,
          }}
        >
          {/* Log Title */}
          <h3 class="flex justify-between items-baseline">
            <div class="uppercase font-bold text-lg">
              Log {props.logIndex()}
            </div>
            <div
              class="uppercase font-bold badge badge-sm"
              classList={{
                'badge-success': props.log.done,
              }}
            >
              {props.log.done ? 'Done' : 'Ongoing'}
            </div>
          </h3>

          {/* Log Data */}
          <div class="items-baseline flex flex-col gap-2">
            <For
              each={[
                {
                  title: 'Start',
                  content: () =>
                    new Date(props.log.startedAt).toLocaleString(undefined, {
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
                    new Date(props.log.endedAt).toLocaleString(undefined, {
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
                    formatTimeToString(
                      (props.log.endedAt - props.log.startedAt) / 1000
                    ),
                },
                {
                  title: 'Earnings',
                  condition: () => props.project.paid,
                  content: () => {
                    const amount = round(
                      ((props.log.endedAt - props.log.startedAt) /
                        (1000 * 3600)) *
                        props.project.hourlyRate,
                      2
                    )
                    return `${amount} ${props.project.currency}`
                  },
                },
                {
                  title: 'Comment',
                  content: () => props.log.comment || 'None',
                },
              ].filter(({ condition }) => condition?.() ?? true)}
            >
              {({ title, content }) => (
                <p class="flex gap-1 items-baseline">
                  <span>{title}:</span>
                  <span class="font-bold hyphens-auto break-words">
                    {content?.()}
                  </span>
                </p>
              )}
            </For>
          </div>

          <span class="grow"></span>

          {/* Log Action Buttons */}
          {props.log.done && (
            <div class="flex gap-3 justify-end mt-auto">
              <Button
                class="btn-sm btn-primary"
                icon="i-mdi-pencil"
                onClick={async () => {
                  const comment = await prompt({
                    title: 'Comment',
                    message: 'Enter a comment',
                    initialValue: props.log.comment,
                  })
                  if (!comment) return
                  setUserState(
                    'projectGroups',
                    props.groupIndex,
                    'projects',
                    props.projectIndex,
                    'logs',
                    props.project.logs.indexOf(props.log),
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
                onClick={() => removeLog(props.log.id)}
              >
                Delete
              </Button>
            </div>
          )}
        </article>
      )}
    </Selectable>
  )
}
