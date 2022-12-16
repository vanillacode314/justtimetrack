import { For, createSignal, Show, JSXElement } from "solid-js";

interface IItem<T = any> {
  title: string;
  data: T;
}

interface Props<T> {
  items: IItem<T>[];
  children: (data: T) => JSXElement;
}

export const Accordion: <T>(props: Props<T>) => JSXElement = (props) => {
  const [activeIndex, setActiveIndex] = createSignal<number>(-1); // -1 indicates no item active

  function activate(n: number) {
    if (activeIndex() === n) {
      setActiveIndex(-1); // -1 indicates no item active
      return;
    }
    setActiveIndex(n);
  }

  return (
    <div class="flex flex-col gap-5">
      <For each={props.items}>
        {({ title, data }, index) => (
          <div class="rounded bg-stone-900 shadow">
            <button
              onClick={() => activate(index())}
              class="text-xl font-medium w-full text-left flex justify-between items-center p-5"
            >
              <span>{title}</span>
              <span
                classList={{
                  "i-carbon-add-alt": activeIndex() !== index(),
                  "i-carbon-subtract-alt": activeIndex() === index(),
                }}
              ></span>
            </button>
            <Show when={activeIndex() === index()}>
              <div class="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
                {props.children(data)}
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
};

export default Accordion;
