import { For } from 'solid-js'
import { Component } from 'solid-js'
import { createStore } from 'solid-js/store'

const uid = () => crypto.randomUUID()

type MessageType = 'info' | 'success' | 'warning' | 'error'
interface IMessage {
  id: string
  title: string
  content: string
  icon?: string
  type: MessageType
  dismiss: () => void
}

const [messages, setMessages] = createStore<IMessage[]>([])

const defaultIconMap = {
  info: 'i-carbon-information-filled',
  warning: 'i-carbon-warning-alt-filled',
  error: 'i-carbon-error-filled',
  success: 'i-carbon-checkmark-filled',
} satisfies Record<MessageType, string>

interface ToastOptions {
  icon: string
  duration: number
  type: MessageType
}
export const toast = (
  title: string,
  content: string,
  { type = 'info', icon, duration = 5000 }: Partial<ToastOptions> = {}
) => {
  const id = uid()

  const dismiss = () =>
    setMessages((messages) => messages.filter((msg) => msg.id !== id))

  setMessages(messages.length, {
    id,
    title,
    content,
    icon: icon || defaultIconMap[type],
    type,
    dismiss,
  })

  setTimeout(dismiss, duration)
}

export const Toast: Component = () => {
  return () => (
    <div class="toast toast-end">
      <For each={messages}>
        {({ type, title, content, icon, dismiss }) => (
          <div class={`alert alert-${type} max-w-xs`} onClick={dismiss}>
            <div class="flex flex-col gap-1 items-start">
              <span class="font-bold uppercase text-xs flex gap-3 items-center">
                {icon && <div class={`${icon} text-base`}></div>}
                {title}
              </span>
              <span class="whitespace-pre-line">{content}</span>
            </div>
          </div>
        )}
      </For>
    </div>
  )
}

export default Toast
