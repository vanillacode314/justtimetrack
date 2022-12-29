import { Component } from 'solid-js'
import { toast } from '~/components/Toast'
import ConfirmModal from '~/modals/ConfirmModal'
import { useUserState } from '~/stores'

export const SettingsPage: Component = () => {
  const [, , resetUserState] = useUserState()

  return (
    <section class="p-5 flex flex-col" aria-label="settings">
      <ConfirmModal
        id="clear-data-modal"
        title="Clear Data"
        message="Are you sure you want to clear all data?"
        onConfirm={() => {
          resetUserState()
          toast('Cleared Data Successfully', '', { type: 'success' })
        }}
      >
        <label for="clear-data-modal" class="btn btn-error">
          Clear Data
        </label>
      </ConfirmModal>
    </section>
  )
}

export default SettingsPage
