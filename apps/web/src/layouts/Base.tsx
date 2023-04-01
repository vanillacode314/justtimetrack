import { Component, JSXElement } from 'solid-js'
import { Button } from 'ui'
import 'uno.css'
import { AlertModal } from '~/modals/AlertModal'
import { PromptModal } from '~/modals/PromptModal'
import type { TAction } from '~/stores'

interface Props {
  children: JSXElement
}

export const BaseLayout: Component<Props> = (props) => {
  const [appState, setAppState] = useAppState()

  const actions = () =>
    appState.actions.filter(
      (action) => action === 'spacer' || action.mode === appState.mode
    )
  const fabActions = () =>
    appState.actions.filter(
      (action): action is TAction =>
        action !== 'spacer' && action.mode === appState.mode && !action.noFab
    )

  return (
    <>
      <Drawer class="relative">
        <div class="flex flex-col p-5 gap-5">
          {/* Desktop Actions */}
          <Show when={actions().length > 0}>
            <ul class="gap-3 items-center flex-wrap hidden lg:flex">
              <li class="contents">
                <For each={actions()}>
                  {(action) => (
                    <Show
                      when={action !== 'spacer'}
                      fallback={<span class="grow"></span>}
                    >
                      <Button
                        icon={action.icon()}
                        class={clsx('btn-sm', action.classes())}
                        onClick={action.action}
                      >
                        {action.label}
                      </Button>
                    </Show>
                  )}
                </For>
              </li>
            </ul>
          </Show>
          {/* Mobile Actions */}
          <Show when={fabActions().length > 0}>
            <Fab actions={fabActions()} />
          </Show>
          <div class="grow">{props.children}</div>
        </div>
      </Drawer>
      <ToastComp />
      <AlertModal />
      <PromptModal />
    </>
  )
}

export default BaseLayout
