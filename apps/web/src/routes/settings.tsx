import { Component } from 'solid-js'
import { toast } from '~/components/Toast'
import ConfirmModal from '~/modals/ConfirmModal'

export const SettingsPage: Component = () => {
  const [, , { reset: resetUserState }] = useUserState()

  return (
    <section class="mx-auto max-w-xl p-5 flex flex-col" aria-label="settings">
      <ConfirmModal
        title="Clear Data"
        message="Are you sure you want to clear all data?"
        icon="i-mdi-warning"
        onConfirm={() => {
          resetUserState()
          toast('Cleared Data Successfully', '', { type: 'success' })
        }}
      >
        <button class="btn btn-error">Clear Data</button>
      </ConfirmModal>
    </section>
  )
}

export default SettingsPage
