import { Component, JSXElement } from 'solid-js'

interface Props {
  id: string
  open: boolean
  onOpen?: () => void
  onClose?: () => void
  children: JSXElement
}

export const BaseModal: Component<Props> = (props) => {
  let dialogElement!: HTMLDialogElement

  const { onOpen, onClose } = props
  const open = () => props.open

  createEffect(() => {
    open() ? dialogElement.showModal() : dialogElement.close()
  })

  return (
    <>
      <input
        type="checkbox"
        id={props.id}
        class="modal-toggle"
        checked={open()}
        onChange={(e) => (e.currentTarget.value ? onOpen?.() : onClose?.())}
      />
      <dialog
        ref={dialogElement}
        onClose={onClose}
        onClick={(e) => e.currentTarget === e.target && dialogElement.close()}
        class="p-5 bg-transparent w-full max-w-xl backdrop:bg-white/10"
      >
        {props.children}
      </dialog>
    </>
  )
}

export default BaseModal
