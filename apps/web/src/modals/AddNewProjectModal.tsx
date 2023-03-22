import { Component } from 'solid-js'
import { Button, Input, Option, Select } from 'ui'
import { z, ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { toast } from '~/components/Toast'
import BaseModal from './BaseModal'
import { prompt } from './PromptModal'

export const [addNewProjectModalOpen, setAddNewProjectModalOpen] =
  createSignal<boolean>(false)

export const AddNewProjectModal: Component = () => {
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

  async function addNewGroup() {
    const groupName = await prompt({ message: 'Enter group name' })
    if (!groupName) {
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
    })
  )

  return (
    <BaseModal
      open={addNewProjectModalOpen()}
      onOpen={() => setAddNewProjectModalOpen(true)}
      onClose={() => setAddNewProjectModalOpen(false)}
    >
      <h3 class="font-bold text-lg">Add New Project</h3>
      <form
        class="py-5 flex flex-col gap-5"
        method="dialog"
        onSubmit={onSubmit}
      >
        <span class="grid grid-cols-[1fr_auto] gap-3 items-end">
          <Select
            label="Project Group"
            value={formData.group}
            onChange={(e) => setFormData('group', e.currentTarget.value)}
          >
            <Option value="null" disabled>
              Select project group
            </Option>
            <For each={userState.projectGroups}>
              {({ name }) => <Option>{name}</Option>}
            </For>
          </Select>
          <Button type="button" onClick={() => addNewGroup()}>
            New Group
          </Button>
        </span>
        <Input
          id="project-name"
          placeholder="Project Name"
          label="Project Name"
          value={formData.name === 'null' ? '' : formData.name}
          onInput={(e) =>
            setFormData(
              'name',
              e.currentTarget.value === '' ? 'null' : e.currentTarget.value
            )
          }
        />
        <div class="self-end">
          <Input
            id="project-paid"
            label="Paid"
            type="checkbox"
            checked={formData.paid}
            onChange={(e) => setFormData('paid', e.currentTarget.checked)}
          />
        </div>
        <Show when={formData.paid}>
          <>
            <Input
              id="project-hourly-rate"
              type="number"
              label="Hourly Rate"
              placeholder="Hourly Rate"
              class="input input-bordered w-full"
              value={formData.hourlyRate}
              onInput={(e) => setFormData('hourlyRate', +e.currentTarget.value)}
            />
            <Input
              id="project-currency"
              type="text"
              placeholder="Currency"
              label="Currency"
              class="input input-bordered w-full"
              value={formData.currency}
              onInput={(e) => setFormData('currency', e.currentTarget.value)}
            />
          </>
        </Show>
        <div class="modal-action">
          <Button class="btn-primary" icon="i-mdi-plus">
            Add
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}

export default AddNewProjectModal
