import { Component, JSXElement } from 'solid-js'
import 'uno.css'

interface Props {
  children: JSXElement
}

export const BaseLayout: Component<Props> = (props) => {
  return (
    <>
      <Drawer>{props.children}</Drawer>
      <Toast />
    </>
  )
}

export default BaseLayout
