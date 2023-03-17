import { Component, JSX } from 'solid-js'
import clsx from 'clsx'
import { mergeProps, createSignal, Show, Switch, Match } from 'solid-js'

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input: Component<InputProps> = (props) => {
  const merged = mergeProps({ type: 'text' }, props)
  const [showPassword, setShowPassword] = createSignal<boolean>(false)

  return (
    <div
      class="flex"
      classList={{
        'flex-col': !['checkbox', 'radio'].includes(merged.type),
        'gap-1': !['checkbox', 'radio'].includes(merged.type),
        'flex-row-reverse': ['checkbox', 'radio'].includes(merged.type),
        'gap-2': ['checkbox', 'radio'].includes(merged.type),
        'items-center': ['checkbox', 'radio'].includes(merged.type),
      }}
    >
      <Show when={props.label}>
        <label
          for={props.id}
          class="uppercase font-semibold text-gray-400 tracking-wider text-xs cursor-pointer"
        >
          {props.label}
        </label>
      </Show>
      <div
        classList={{
          contents: merged.type !== 'password',
          relative: merged.type === 'password',
        }}
      >
        <input
          {...props}
          class={clsx(
            props.class,
            merged.type === 'radio'
              ? 'radio'
              : merged.type === 'checkbox'
              ? 'checkbox'
              : 'input rounded-xl input-bordered w-full invalid:input-error'
          )}
          type={showPassword() ? 'text' : merged.type}
        />
        <Show when={merged.type === 'password'}>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword())}
            class="absolute btn-circle btn-sm btn-ghost inset-y-1/2 -translate-y-1/2 right-3 text-lg grid place-content-center"
          >
            <span
              classList={{
                'i-mdi-eye': !showPassword(),
                'i-mdi-eye-off': showPassword(),
              }}
            />
          </button>
        </Show>
      </div>
    </div>
  )
}

interface TextareaProps
  extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea: Component<TextareaProps> = (props) => {
  return (
    <div class="flex flex-col gap-1">
      <Show when={props.label}>
        <label
          for={props.id}
          class="uppercase font-semibold text-gray-400 tracking-wider text-xs cursor-pointer"
        >
          {props.label}
        </label>
      </Show>
      <textarea {...props} class="textarea textarea-bordered rounded-xl" />
    </div>
  )
}

export default Input
