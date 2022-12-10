import { For, Component, JSXElement } from "solid-js";
import { A } from "solid-start";

interface Props {
  children: JSXElement;
}

type Not<T> = {
  [P in keyof T]?: never;
};

type Diff<
  T extends Record<PropertyKey, unknown>,
  U extends Record<PropertyKey, unknown>
> = T & Not<Omit<U, keyof T>>;

type Xor<
  T extends Record<PropertyKey, unknown>,
  U extends Record<PropertyKey, unknown>
> = Diff<T, U> | Diff<U, T>;

type ILink = {
  label: string;
  icon?: string;
} & Xor<{
  url?: string;
  sublinks?: Omit<ILink, "sublinks">[];
}>;

const navLinks: ILink[] = [
  {
    label: "Clients",
    icon: "i-mdi-user",
    url: "/",
  },
  {
    label: "Settings",
    icon: "i-mdi-cog",
    url: "/settings",
  },
];

export const Drawer: Component<Props> = (props) => {
  return (
    <div class="drawer drawer-mobile">
      <input
        id="main-drawer"
        type="checkbox"
        class="drawer-toggle"
        checked={true}
      />
      <div class="drawer-content flex flex-col items-center justify-center">
        {props.children}
        <label
          for="main-drawer"
          class="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div class="drawer-side">
        <label for="main-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 bg-base-100 text-base-content gap-2">
          {/*  Sidebar content here */}
          <For each={navLinks}>
            {({ label, url, icon, sublinks }) => (
              <li>
                <A href={url} end={true}>
                  {icon && <div class={icon}></div>}
                  {label}
                </A>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
};
