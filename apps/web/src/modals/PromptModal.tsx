import { Component } from 'solid-js'
import { Button, Input } from 'ui'
import BaseModal from './BaseModal'

interface Options {
  title?: string
  icon?: string
  initialValue?: string
  message: string
}

const [state, setState] = createStore<
  Options & { open: boolean; input: string }
>({
  title: '',
  icon: '',
  initialValue: '',
  message: '',
  input: '',
  open: false,
})
let resolve: ((value: string | undefined) => void) | undefined

export async function prompt(opts: Options): Promise<string | undefined> {
  setState({ ...opts, open: true })
  console.log(state.open)
  return new Promise<string | undefined>((res) => (resolve = res))
}

interface PromptModalProps {}
export const PromptModal: Component<PromptModalProps> = (props) => {
  let inputElement!: HTMLInputElement

  return (
    <BaseModal
      open={state.open}
      onOpen={() => {
        setState('open', true)
        queueMicrotask(() =>
          inputElement.setSelectionRange(0, inputElement.value.length)
        )
      }}
      onClose={() => {
        setState('open', false)
        if (!resolve) return
        resolve(undefined)
        resolve = undefined
      }}
    >
      <form
        method="dialog"
        class="flex flex-col gap-5"
        onSubmit={() => {
          if (!resolve) return
          resolve(state.input)
          resolve = undefined
        }}
      >
        <h3 class="font-bold text-xl flex gap-5 items-center">
          <Show when={state.title}>
            <Show when={state.icon}>
              <span class={`${state.icon} text-2xl text-stone-400`} />
            </Show>
            <span>{state.title}</span>
          </Show>
        </h3>
        <Input
          id="prompt"
          label={state.message}
          value={state.input}
          ref={inputElement}
          onInput={(e) => setState('input', e.currentTarget.value)}
        />
        <div class="modal-action">
          <Button type="submit" class="btn-primary" icon="i-mdi-check">
            Ok
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}
