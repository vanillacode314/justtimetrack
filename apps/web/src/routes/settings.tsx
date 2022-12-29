import { Component } from 'solid-js'
import { toast } from '~/components/Toast'
import { useUserState } from '~/stores'

export const SettingsPage: Component = () => {
  const [, , resetUserState] = useUserState()

  return (
    <section class="p-5 flex flex-col" aria-label="settings">
      <button
        type="button"
        class="btn btn-error"
        onClick={() => {
          resetUserState()
          toast('Cleared Data Successfully', '', { type: 'success' })
        }}
      >
        Clear Data
      </button>
    </section>
  )
}

export default SettingsPage
