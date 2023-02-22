import { Component, JSXElement } from 'solid-js'
import BaseModal from './BaseModal'

interface Props {
  id: string
  title: string
  message: string
  onConfirm: () => void
  onCancel?: () => void
  children: JSXElement
}

export const ConfirmModal: Component<Props> = (props) => {
  const { onConfirm, onCancel } = props
  const [open, setOpen] = createSignal<boolean>(false)

  return (
    <>
      <BaseModal
        id={props.id}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open()}
      >
        <label class="modal-box rounded-xl flex flex-col gap-3 text-white">
          <h3 class="font-bold text-lg">{props.title}</h3>
          <p>{props.message}</p>
          <div class="flex gap-3 justify-end mt-5">
            <button
              class="btn btn-ghost text-success flex gap-3 items-center"
              onClick={() => {
                setOpen(false)
                onConfirm()
              }}
            >
              <div class="i-carbon-checkmark-filled"></div>
              <span>OK</span>
            </button>
            <button
              class="btn"
              onClick={() => {
                setOpen(false)
                onCancel?.()
              }}
            >
              <span>Cancel</span>
            </button>
          </div>
        </label>
      </BaseModal>
      {props.children}
    </>
  )
}

export default ConfirmModal
