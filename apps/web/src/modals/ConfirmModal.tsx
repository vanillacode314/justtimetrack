import { createSignal, Component, JSXElement } from 'solid-js'

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
      <input
        type="checkbox"
        id={props.id}
        class="modal-toggle"
        checked={open()}
        onChange={(e) => setOpen(e.currentTarget.checked)}
      />
      <label for="add-new-project-modal" class="modal">
        <label class="modal-box rounded-xl flex flex-col gap-3">
          <h3 class="font-bold text-lg">{props.title}</h3>
          <p>{props.message}</p>
          <div class="flex gap-3 justify-end">
            <label
              class="btn btn-ghost text-success flex gap-3 items-center"
              onClick={() => {
                setOpen(false)
                onConfirm()
              }}
            >
              <div class="i-carbon-checkmark-filled"></div>
              <span>OK</span>
            </label>
            <label
              class="btn"
              onClick={() => {
                setOpen(false)
                onCancel?.()
              }}
            >
              <span>Cancel</span>
            </label>
          </div>
        </label>
      </label>
      {props.children}
    </>
  )
}

export default ConfirmModal
