import { Component, JSXElement } from 'solid-js'
import { Drawer } from '~/components/Drawer'
import { Navbar } from '~/components/Navbar'
import Toast from '~/components/Toast'
import '@unocss/reset/tailwind.css'
import '@kidonng/daisyui/index.css'
import 'virtual:uno.css'

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
