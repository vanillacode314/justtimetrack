import { Component, JSX, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'

interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  processing?: boolean
  processingLabel?: string
  icon?: string
  href?: string
}

export const Button: Component<Props> = (props) => {
  return (
    <Dynamic
      component={props.href ? 'a' : 'button'}
      onClick={props.onClick}
      {...props}
      class={`${props.class} btn flex gap-1 items-center`}
    >
      <Show
        when={props.processing}
        fallback={
          <>
            <Show when={props.icon}>
              <span class={`${props.icon} text-lg`} />
            </Show>
            {props.children}
          </>
        }
      >
        <div class="animate-spin preserve-3d">
          <span class="i-mdi:dots-circle" />
        </div>
        <Show
          when={props.processing}
          fallback={<span>{props.processingLabel}</span>}
        >
          {props.processing}
        </Show>
      </Show>
    </Dynamic>
  )
}

function test(props: Props) {}
