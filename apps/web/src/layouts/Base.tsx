import { Component, JSXElement } from 'solid-js'
import '@unocss/reset/tailwind.css'
import '@kidonng/daisyui/index.css'
import 'uno.css'

interface Props {
  children: JSXElement
}

export const BaseLayout: Component<Props> = (props) => {
  return (
    <>
      <Navbar />
      <Drawer>{props.children}</Drawer>
      <Toast />
    </>
  )
}

export default BaseLayout
