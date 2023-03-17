import clsx from 'clsx'
import { children, Component, For, JSX, JSXElement, mergeProps } from 'solid-js'
import z from 'zod'

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  value: string
  children: JSX.Element
}

const optionsSchema = z.object({
  label: z.function().returns(z.string()),
  value: z.string().trim().optional(),
  disabled: z.boolean().default(false).optional(),
  selected: z.boolean().default(false).optional(),
})
type TOption = z.infer<typeof optionsSchema>

export const Select: Component<SelectProps> = (props) => {
  const options = children(() => props.children)
  const evaluatedOptions = () => options.toArray() as unknown as OptionProps[]

  return (
    <div class="flex flex-col gap-1">
      <label
        for={props.id}
        class="uppercase font-semibold text-gray-400 tracking-wider text-xs"
      >
        {props.label}
      </label>

      <select
        {...props}
        class={clsx(
          props.class,
          'select rounded-xl select-bordered w-full invalid:select-error'
        )}
      >
        <For each={optionsSchema.array().parse(evaluatedOptions())}>
          {({ selected, disabled, label, value }) => (
            <option
              selected={selected}
              disabled={disabled}
              value={value ?? label()}
            >
              {label}
            </option>
          )}
        </For>
      </select>
    </div>
  )
}

interface OptionProps extends Partial<TOption> {
  children: JSXElement
}
export const Option: Component<OptionProps> = (props) => {
  return mergeProps({
    label: children(() => props.children),
  }) as unknown as JSX.Element
}
