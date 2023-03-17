import { Component } from 'solid-js'
import { Button, Input } from 'ui'
import z from 'zod'
import BaseModal from './BaseModal'

const stateSchema = z.object({
  title: z.string().default(''),
  icon: z.string().default(''),
  initialValue: z.string().default(''),
  message: z.string().default(''),
  value: z.string().default(''),
  open: z.boolean().default(false),
})
type TOptions = z.infer<typeof stateSchema>

const [state, setState] = createStore<TOptions>(stateSchema.parse({}))
let resolve: ((value: string | undefined) => void) | undefined

export async function prompt(
  opts: Omit<z.input<typeof stateSchema>, 'value' | 'open'>
): Promise<string | undefined> {
  setState({ ...opts, open: true, value: opts.initialValue })
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
        inputElement.setSelectionRange(0, inputElement.value.length)
      }}
      onClose={() => {
        setState(stateSchema.parse({}))
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
          resolve(state.value)
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
          value={state.value}
          ref={inputElement}
          onInput={(e) => setState('value', e.currentTarget.value)}
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
