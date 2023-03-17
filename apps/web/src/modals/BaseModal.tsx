import { Component, JSXElement } from 'solid-js'
import { fadeIn } from '~/utils/animations'

interface Props {
  open: boolean
  onOpen?: () => void
  onClose?: () => void
  children: JSXElement
}

export const BaseModal: Component<Props> = (props) => {
  let dialogElement!: HTMLDialogElement

  const { onOpen, onClose } = props
  const open = () => props.open
  const [mouseDown, setMouseDown] = createSignal<boolean>(false)
  const [openedOnce, setOpenedOnce] = createSignal<boolean>(false)

  createEffect(
    on(open, (open) => {
      if (openedOnce()) {
        open ? onOpen?.() : onClose?.()
      } else {
        setOpenedOnce(open)
      }
      open && queueMicrotask(() => fadeIn(dialogElement))
      open ? dialogElement.showModal() : dialogElement.close()
    })
  )

  return (
    <dialog
      ref={dialogElement!}
      onClose={onClose}
      class="bg-transparent backdrop:bg-white/10 w-full max-w-full h-full p-0 m-0"
    >
      <div
        class="h-full flex md:items-center md:justify-center items-end p-0 m-0"
        onMouseDown={(e) => {
          if (e.currentTarget !== e.target) return
          setMouseDown(true)
        }}
        onMouseUp={(e) => {
          if (e.currentTarget !== e.target) return
          if (!mouseDown()) return
          setMouseDown(false)
          dialogElement.close()
        }}
      >
        <div class="bg-stone-900 p-5 md:rounded-2xl shadow-lg w-full md:mx-auto md:max-w-xl">
          {props.children}
        </div>
      </div>
    </dialog>
  )
}

export default BaseModal
