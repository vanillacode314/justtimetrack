import { Component } from 'solid-js'
import { TAction } from '~/stores'

interface Props {
  actions: TAction[]
}
export const Fab: Component<Props> = (props) => {
  const [appState, setAppState] = useAppState()
  const [fabOpen, setFabOpen] = createSignal<boolean>(false)
  // let actions: TAction[]
  // let fabOpen: boolean = false
  //
  // $: open = $appState.mode === 'selection' || fabOpen
  //
  // $: if ($navigating) {
  //   fabOpen = false
  // }

  return (
    <div class="fixed bottom-0 right-0 lg:hidden p-5 z-30">
      <div class="flex flex-col-reverse items-end gap-3">
        <button
          class="p-5 grid place-content-center bg-stone-800 shadow-lg rounded-xl transition hover:bg-stone-700 focus:bg-stone-700 preserve-3d"
          classList={{
            'rotate-90': fabOpen(),
            'bg-stone-700': fabOpen(),
            'bg-stone-800': !fabOpen(),
          }}
          onClick={() => {
            // if (appState.mode === 'selection') {
            // 	appState.selectedItems = appState.selectedItems.fill(false)
            // 	return
            // }
            setFabOpen(!fabOpen())
          }}
        >
          <span
            class={clsx(fabOpen() ? 'i-mdi-close' : 'i-mdi-menu', 'text-xl')}
          />
        </button>
        <div class="flex flex-col-reverse gap-3">
          <For each={fabOpen() ? props.actions : []}>
            {(action) => (
              <button
                type="button"
                class={clsx(
                  'btn shadow-lg rounded-xl transition-transform flex gap-3 items-center justify-start',
                  action.classes()
                )}
                onClick={() => {
                  action.action()
                  // if ($appState.mode === 'selection') return
                  if (!action.noClose) {
                    setFabOpen(false)
                  }
                }}
              >
                <span class={clsx(action.icon(), 'text-xl')} />
                <span>{action.label}</span>
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
export default Fab
