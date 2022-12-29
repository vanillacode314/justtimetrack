import { For, Show } from 'solid-js'
import { A } from 'solid-start'
import { Accordion } from '~/components/Accordion'
import { useUserState } from '~/stores'

export default function Home() {
  const [userState, _setUserState] = useUserState()

  return (
    <main class="p-5 h-full">
      <Show
        when={userState.projectGroups.length > 0}
        fallback={
          <div class="text-center grid justify-items-center place-content-center gap-5 h-full">
            <p class="uppercase font-bold text-4xl">You have no projects yet</p>
            <label
              for="add-new-project-modal"
              class="flex gap-1 items-center btn btn-primary"
            >
              <div class="i-carbon-add text-xl" />
              <span>Add new project</span>
            </label>
          </div>
        }
      >
        <Accordion
          items={userState.projectGroups.map((group) => ({
            title: group.name,
            data: group,
          }))}
        >
          {({ id: groupId, name: groupName, projects }) => (
            <Show
              when={projects.length > 0}
              fallback={
                <div class="text-center flex flex-col items-center gap-5 h-full p-5">
                  <p class="uppercase font-bold">Empty Group</p>
                  <label
                    for="add-new-project-modal"
                    class="flex gap-1 items-center btn btn-primary"
                  >
                    <div class="i-carbon-add text-xl" />
                    <span>Add new project</span>
                  </label>
                </div>
              }
            >
              <div class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-3 p-5">
                <For each={projects}>
                  {({ id: projectId, name: projectName, description }) => (
                    <A
                      href={`/project/${groupId}/${projectId}`}
                      class="px-5 py-3 gap-1 rounded bg-base-100 flex flex-col hover:bg-green-900 transition-colors"
                    >
                      <h2 class="font-bold uppercase flex gap-1 items-baseline justify-between">
                        {projectName}
                      </h2>
                      <p>{description}</p>
                    </A>
                  )}
                </For>
              </div>
            </Show>
          )}
        </Accordion>
      </Show>
    </main>
  )
}
