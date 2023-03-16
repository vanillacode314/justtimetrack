import { Component } from 'solid-js'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { toast } from '~/components/Toast'
import BaseModal from './BaseModal'

export const [addNewProjectModalOpen, setAddNewProjectModalOpen] =
  createSignal<boolean>(false)

export const AddNewProjectModal: Component = () => {
  let selectElement!: HTMLSelectElement

  const [userState, setUserState] = useUserState()
  const [appState, _setAppState] = useAppState()

  const formSchema = z.object({
    group: z.string().min(3).default('null'),
    name: z.string().min(3).default('null'),
    paid: z.boolean().default(false),
    hourlyRate: z.number().min(1).default(1),
    currency: z.string().default('USD'),
  })
  const [formData, setFormData] = createStore<z.infer<typeof formSchema>>(
    formSchema.parse({})
  )

  function addNewGroup() {
    const groupName = prompt('Enter group name')
    if (groupName === null) {
      toast('Invalid group name', 'Group name must be alphanumeric', {
        type: 'error',
      })
      return
    }
    if (userState.projectGroups.some((group) => group.name === groupName)) {
      toast(
        'Group Already Exists',
        `Group with name ${groupName} already exists`,
        {
          type: 'error',
        }
      )
      return
    }

    setUserState('projectGroups', ($projectGroups) => [
      ...$projectGroups,
      {
        id: groupName.toLowerCase().replaceAll(' ', '-'),
        name: groupName,
        projects: [],
      },
    ])
    setFormData('group', groupName)
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault()
    if (formData.group === 'null') {
      toast('Invalid group name', '', { type: 'error' })
      return
    }
    if (formData.name === 'null') {
      toast('Invalid project name', '', { type: 'error' })
    }
    try {
      formSchema.parse(formData)
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err)

        let message = validationError.message
        message = message.slice(message.indexOf(':') + 1)
        message = message.replaceAll(';', '\n').trim()

        toast('Invalid Input', message, {
          type: 'error',
        })
      }
      return
    }

    const groupIndex = userState.projectGroups.findIndex(
      (g) => g.name === formData.group
    )
    if (groupIndex === -1) throw new Error('group not found')

    // check if project with same name already exists in the group

    if (
      userState.projectGroups[groupIndex].projects.some(
        (project) => project.name === formData.name
      )
    ) {
      toast(
        'Project Already Exists',
        `Project with name ${formData.name} already exists in the group ${formData.group}`,
        {
          type: 'error',
        }
      )
      return
    }

    setUserState(
      'projectGroups',
      groupIndex,
      'projects',
      userState.projectGroups[groupIndex].projects.length,
      (formData.paid
        ? {
            id: formData.name.toLowerCase().replaceAll(' ', '-'),
            name: formData.name,
            description: '',
            paid: true,
            logs: [],
            hourlyRate: formData.hourlyRate,
            currency: formData.currency,
          }
        : {
            id: formData.name.toLowerCase().replaceAll(' ', '-'),
            name: formData.name,
            description: '',
            logs: [],
            paid: false,
          }) as TProject
    )
    toast(
      'Successfully added new project',
      `Project ${formData.name} added under group ${formData.group}`,
      {
        type: 'success',
      }
    )
    setFormData(formSchema.parse({}))
    setAddNewProjectModalOpen(false)
  }

  createEffect(
    on(addNewProjectModalOpen, (open) => {
      if (!open) return
      setFormData({
        group:
          userState.projectGroups.find(
            (group) => group.id === appState.selectedProjectGroupId
          )?.name ?? 'null',
      })
      selectElement.focus()
    })
  )

  return (
    <BaseModal
      id="add-new-project-modal"
      open={addNewProjectModalOpen()}
      onOpen={() => setAddNewProjectModalOpen(true)}
      onClose={() => setAddNewProjectModalOpen(false)}
    >
      <h3 class="font-bold text-lg">Add New Project</h3>
      <form
        class="py-5 flex flex-col gap-3"
        method="dialog"
        onSubmit={onSubmit}
      >
        <span class="grid grid-cols-[1fr_auto] gap-3">
          <select
            ref={selectElement}
            value={formData.group}
            onChange={(e) => setFormData('group', e.currentTarget.value)}
            class="select select-bordered w-full"
          >
            <option value="null" disabled>
              Select project group
            </option>
            <For each={userState.projectGroups}>
              {({ name }) => <option>{name}</option>}
            </For>
          </select>
          <button type="button" class="btn" onClick={() => addNewGroup()}>
            New Group
          </button>
        </span>
        <input
          type="text"
          placeholder="Project Name"
          class="input input-bordered w-full"
          value={formData.name === 'null' ? '' : formData.name}
          onInput={(e) =>
            setFormData(
              'name',
              e.currentTarget.value === '' ? 'null' : e.currentTarget.value
            )
          }
        />
        <label class="label cursor-pointer">
          <span class="label-text">Paid</span>
          <input
            type="checkbox"
            class="toggle"
            checked={formData.paid}
            onChange={(e) => setFormData('paid', e.currentTarget.checked)}
          />
        </label>
        <Show when={formData.paid}>
          <>
            <input
              type="number"
              placeholder="Hourly Rate"
              class="input input-bordered w-full"
              value={formData.hourlyRate}
              onInput={(e) => setFormData('hourlyRate', +e.currentTarget.value)}
            />
            <input
              type="text"
              placeholder="Currency"
              class="input input-bordered w-full"
              value={formData.currency}
              onInput={(e) => setFormData('currency', e.currentTarget.value)}
            />
          </>
        </Show>
        <div class="modal-action">
          <button class="btn btn-primary uppercase flex gap-2 items-center">
            <div class="text-lg i-mdi-plus"></div> Add
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default AddNewProjectModal
