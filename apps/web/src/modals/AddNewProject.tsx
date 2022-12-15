import { createSignal, Show, Component, For } from "solid-js";
import { createStore } from "solid-js/store";
import { useUserState } from "~/stores";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { IProject } from "~/types";
import { toast } from "~/components/Toast";
export const AddNewProjectModal: Component = () => {
  const [userState, setUserState] = useUserState();

  const [open, setOpen] = createSignal<boolean>(false);

  const formSchema = z.object({
    group: z.string().min(3),
    name: z.string().min(3),
    paid: z.boolean(),
    hourlyRate: z.number().min(1),
    currency: z.string(),
  });
  const getDefaultData = () => ({
    group: "",
    name: "",
    paid: false,
    hourlyRate: 1,
    currency: "USD",
  });
  const [formData, setFormData] = createStore<z.infer<typeof formSchema>>(
    getDefaultData()
  );

  return (
    <>
      <input
        type="checkbox"
        id="add-new-project-modal"
        class="modal-toggle"
        checked={open()}
        onChange={(e) => setOpen(e.currentTarget.checked)}
      />
      <label for="add-new-project-modal" class="modal">
        <label class="modal-box">
          <h3 class="font-bold text-lg">Add New Project</h3>
          <form
            class="py-5 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                formSchema.parse(formData);
              } catch (err) {
                if (err instanceof ZodError) {
                  const validationError = fromZodError(err);

                  let message = validationError.message;
                  message = message.slice(message.indexOf(":") + 1);
                  message = message.replaceAll(";", "\n").trim();

                  toast("Invalid Input", message, {
                    type: "error",
                  });
                }
                return;
              }

              const groupIndex = userState.projectGroups.findIndex(
                (g) => g.name === formData.group
              );
              if (groupIndex === -1) throw new Error("group not found");

              // check if project with same name already exists in the group

              if (
                userState.projectGroups[groupIndex].projects.some(
                  (project) => project.name === formData.name
                )
              ) {
                toast(
                  "Project Already Exists",
                  `Project with name ${formData.name} already exists in the group ${formData.group}`,
                  {
                    type: "error",
                  }
                );
                return;
              }

              setUserState(
                "projectGroups",
                groupIndex,
                "projects",
                userState.projectGroups[groupIndex].projects.length,
                (formData.paid
                  ? {
                      id: crypto.randomUUID(),
                      name: formData.name,
                      description: "",
                      paid: true,
                      logs: [],
                      hourlyRate: formData.hourlyRate,
                      currency: formData.currency,
                    }
                  : {
                      id: crypto.randomUUID(),
                      name: formData.name,
                      description: "",
                      logs: [],
                      paid: false,
                    }) as IProject
              );
              toast(
                "Successfully added new project",
                `Project ${formData.name} added under group ${formData.group}`,
                {
                  type: "success",
                }
              );
              setFormData(getDefaultData());
              setOpen(false);
            }}
          >
            <select
              value={formData.group}
              onChange={(e) => setFormData("group", e.currentTarget.value)}
              class="select select-bordered w-full"
            >
              <option value="" disabled>
                Select project group
              </option>
              <For each={userState.projectGroups}>
                {({ name }) => <option>{name}</option>}
              </For>
              <option
                value="new"
                onClick={() => {
                  const groupName = prompt("Enter group name");
                  if (groupName === null) {
                    toast(
                      "Invalid group name",
                      "Group name must be alphanumeric",
                      {
                        type: "error",
                      }
                    );
                    return;
                  }
                  if (
                    userState.projectGroups.some(
                      (group) => group.name === groupName
                    )
                  ) {
                    toast(
                      "Group Already Exists",
                      `Group with name ${groupName} already exists`,
                      {
                        type: "error",
                      }
                    );
                  }
                  setUserState("projectGroups", (_) => [
                    ..._,
                    {
                      id: crypto.randomUUID(),
                      name: groupName,
                      projects: [],
                    },
                  ]);
                  setFormData("group", groupName);
                }}
              >
                New Group
              </option>
            </select>
            <input
              type="text"
              placeholder="Project Name"
              class="input input-bordered w-full"
              value={formData.name}
              onInput={(e) => setFormData("name", e.currentTarget.value)}
            />
            <label class="label cursor-pointer">
              <span class="label-text">Paid</span>
              <input
                type="checkbox"
                class="toggle"
                checked={formData.paid}
                onChange={(e) => setFormData("paid", e.currentTarget.checked)}
              />
            </label>
            <Show when={formData.paid}>
              <>
                <input
                  type="number"
                  placeholder="Hourly Rate"
                  class="input input-bordered w-full"
                  value={formData.hourlyRate}
                  onInput={(e) =>
                    setFormData("hourlyRate", +e.currentTarget.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Currency"
                  class="input input-bordered w-full"
                  value={formData.currency}
                  onInput={(e) =>
                    setFormData("currency", e.currentTarget.value)
                  }
                />
              </>
            </Show>
            <div class="modal-action">
              <button class="btn uppercase flex gap-2 items-center">
                <div class="text-lg i-mdi-plus"></div> Add
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  );
};
