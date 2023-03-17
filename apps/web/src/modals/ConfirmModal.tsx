import { Component, JSXElement } from 'solid-js'
import { Button } from 'ui'
import BaseModal from './BaseModal'

type ProcessConfirm = <T>(
  callback: () => Promise<T>,
  label?: string
) => Promise<T>

interface Props {
  title: string
  message: string
  icon?: string
  processingLabel?: string
  onConfirm: (processConfirm: ProcessConfirm) => void
  onCancel?: () => void
  children?: ((open: () => void) => JSXElement) | JSXElement
}

export const ConfirmModal: Component<Props> = (props) => {
  const [processing, setProcessing] = createSignal<string>('')
  const { onConfirm, onCancel } = props
  const [open, setOpen] = createSignal<boolean>(false)

  const processConfirm: ProcessConfirm = (
    callback,
    label = 'Working on it'
  ) => {
    setProcessing(label)
    return callback()
      .then((val) => {
        setOpen(true)
        return val
      })
      .finally(() => setProcessing(''))
  }

  return (
    <>
      <BaseModal
        open={open()}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <form
          method="dialog"
          class="flex flex-col gap-5"
          onSubmit={() => onConfirm(processConfirm)}
        >
          <h3 class="font-bold text-xl flex gap-5 items-center">
            <Show when={props.icon}>
              <span class={`${props.icon} text-2xl text-stone-400`} />
            </Show>
            <span>{props.title}</span>
          </h3>
          <p class="text-left">{props.message}</p>
          <div class="modal-action">
            <Button
              type="submit"
              class="btn-primary"
              processing={!!processing()}
              processingLabel={props.processingLabel}
              icon="i-mdi-check"
            >
              Confirm
            </Button>
            <Button
              type="button"
              onclick={() => {
                setOpen(false)
                onCancel?.()
              }}
              class="btn-ghost"
            >
              Cancel
            </Button>
          </div>
        </form>
      </BaseModal>
      <Show when={props.children}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
          class="contents"
        >
          {typeof props.children === 'function'
            ? props.children!(() => setOpen(true))
            : props.children}
        </form>
      </Show>
    </>
  )
}

export default ConfirmModal
