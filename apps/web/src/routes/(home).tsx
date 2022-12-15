import { For, Show } from "solid-js";
import { A } from "solid-start";
import { Accordion } from "~/components/Accordion";
import { useUserState } from "~/stores";

export default function Home() {
  const [userState, setUserState] = useUserState();

  return (
    <main class="p-5">
      <Accordion
        items={userState.projectGroups.map((group) => ({
          title: group.name,
          data: group,
        }))}
      >
        {({ name: groupName, projects }) => (
          <Show
            when={projects.length > 0}
            fallback={<div class="p-5">No projects in this group yet.</div>}
          >
            <div class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-3 p-5">
              <For each={projects}>
                {({ name: projectName, description }) => (
                  <A
                    href={`/project/${groupName}/${projectName}`}
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
    </main>
  );
}
