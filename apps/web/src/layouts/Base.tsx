import { Component, JSXElement } from 'solid-js'
import 'uno.css'
import { AlertModal } from '~/modals/AlertModal'
import { PromptModal } from '~/modals/PromptModal'

interface Props {
  children: JSXElement
}

export const BaseLayout: Component<Props> = (props) => {
  return (
    <>
      <Drawer>{props.children}</Drawer>
      <Toast />
      <AlertModal />
      <PromptModal />
    </>
  )
}

export default BaseLayout
