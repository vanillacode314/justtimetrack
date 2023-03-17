import { Component } from 'solid-js'
import { Button } from 'ui'
import BaseModal from './BaseModal'

interface Options {
  title: string
  icon?: string
  message: string
}

const [state, setState] = createStore<Options & { open: boolean }>({
  open: false,
  title: '',
  message: '',
  icon: '',
})

export function alert(opts: Options) {
  setState({ ...opts, open: true })
}

interface AlertModalProps {}
export const AlertModal: Component<AlertModalProps> = () => {
  return (
    <BaseModal
      open={state.open}
      onOpen={() => setState('open', true)}
      onClose={() => setState('open', false)}
    >
      <form method="dialog" class="flex flex-col gap-5">
        <h3 class="font-bold text-xl flex gap-5 items-center">
          <Show when={state.icon}>
            <span class={`${state.icon} text-2xl text-stone-400`} />
          </Show>
          <span>{state.title}</span>
        </h3>
        <p class="whitespace-pre-wrap">{state.message}</p>
        <div class="modal-action">
          <Button type="submit" class="btn-primary" icon="i-mdi-check">
            Ok
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}
