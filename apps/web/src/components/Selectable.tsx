import { Component, JSXElement } from 'solid-js'
import { longpress } from '~/utils/use-longpress'

interface SelectableProps {
  onChange?: (selected: boolean) => void
  children: (selected: () => boolean) => JSXElement
}
export const Selectable: Component<SelectableProps> = (props) => {
  const [selected, setSelected] = createSignal<boolean>(false)
  const [appState, setAppState] = useAppState()

  createEffect(() => props.onChange?.(selected()))
  return (
    <div
      class="relative grid rounded-xl overflow-hidden"
      classList={{
        'user-select-none': appState.mode === 'selection',
      }}
      ref={(el) => {
        const dispose = longpress(el, {
          duration: () => (appState.mode === 'selection' ? 10 : 1000),
          vibrate: () => (appState.mode === 'selection' ? false : true),
          onUp: () => appState.mode === 'selection',
          callback() {
            setSelected(!selected())
          },
        })
        onCleanup(dispose)
      }}
    >
      <Show when={selected()}>
        <div class="absolute top-0 right-0 p-5 z-20">
          <span class="i-mdi-check-circle text-2xl" />
        </div>
        <div class="absolute inset-0 z-10 bg-black/50" />
      </Show>
      {props.children(selected)}
    </div>
  )
}
