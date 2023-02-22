import { Component, JSXElement } from 'solid-js'
import { A } from 'solid-start'

interface Props {
  children: JSXElement
}

type ILink = {
  label: string
  icon?: string
  url: string
  modal?: string
  sublinks?: Array<
    Omit<ILink, 'modal' | 'url' | 'sublinks'> &
      Xor<
        {
          modal: string
        },
        Xor<
          {
            action: () => void
          },
          {
            url: string
          }
        >
      >
  >
}

const navLinks: ILink[] = [
  {
    label: 'Projects',
    icon: 'i-mdi-user',
    url: '/',
    sublinks: [
      {
        label: 'Add New',
        icon: 'i-mdi-plus',
        modal: 'add-new-project-modal',
      },
    ],
  },
  {
    label: 'Settings',
    icon: 'i-mdi-cog',
    url: '/settings',
  },
]

export const Drawer: Component<Props> = (props) => {
  const [appState, setAppState] = useAppState()

  return (
    <div class="drawer drawer-mobile">
      <input
        id="main-drawer"
        type="checkbox"
        class="drawer-toggle"
        checked={appState.drawerVisible}
        onChange={(e) => setAppState('drawerVisible', e.currentTarget.checked)}
      />
      <div class="drawer-content">{props.children}</div>
      <div class="drawer-side border-r-2 border-stone-900">
        <label for="main-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 bg-base-100 text-base-content gap-2">
          {/*  Sidebar content here */}
          {/* Links */}
          <For each={navLinks}>
            {({ label, url, icon, sublinks }) => (
              <>
                <li class="text-sm">
                  {url ? (
                    <A href={url} end={true}>
                      {icon && <div class={icon}></div>}
                      {label}
                    </A>
                  ) : (
                    <div>
                      {icon && <div class={icon}></div>}
                      {label}
                    </div>
                  )}
                </li>
                <For each={sublinks}>
                  {({ label, modal, action, url, icon }) => (
                    <li class="text-sm">
                      {modal ? (
                        <label
                          for={modal}
                          onClick={() => setAppState('drawerVisible', false)}
                        >
                          &nbsp;
                          {icon && <div class={icon}></div>}
                          {label}
                        </label>
                      ) : url ? (
                        <A href={url} end={true}>
                          &nbsp;
                          {icon && <div class={icon}></div>}
                          {label}
                        </A>
                      ) : (
                        <button onClick={action}>
                          &nbsp;
                          {icon && <div class={icon}></div>}
                          {label}
                        </button>
                      )}
                    </li>
                  )}
                </For>
              </>
            )}
          </For>
        </ul>
      </div>
    </div>
  )
}

export default Drawer
