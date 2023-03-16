import { Component, JSXElement } from 'solid-js'
import { A } from 'solid-start'
import { setAddNewProjectModalOpen } from '~/modals/AddNewProjectModal'

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
          action: () => void
        },
        {
          url: string
        }
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
        action: () => setAddNewProjectModalOpen(true),
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
      <div class="drawer-content bg-base-100">{props.children}</div>
      <div class="drawer-side">
        <label for="main-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 bg-base-300 text-base-content gap-2">
          {/*  Sidebar content here */}
          <span class="uppercase font-black text-2xl text-center p-3 tracking-wider">
            JustTimeTrack
          </span>
          {/* Links */}
          <For each={navLinks}>
            {({ label, url, icon, sublinks }) => (
              <>
                <li>
                  {url ? (
                    <A
                      href={url}
                      end={true}
                      class="text-xs font-bold uppercase tracking-wide"
                    >
                      {icon && <div class={icon}></div>}
                      {label}
                    </A>
                  ) : (
                    <div class="text-xs font-bold uppercase tracking-wide">
                      {icon && <div class={icon}></div>}
                      {label}
                    </div>
                  )}
                </li>
                <For each={sublinks}>
                  {({ label, action, url, icon }) => (
                    <li>
                      {url ? (
                        <A
                          href={url}
                          end={true}
                          class="text-xs font-bold uppercase tracking-wide"
                        >
                          &nbsp;
                          {icon && <div class={icon}></div>}
                          {label}
                        </A>
                      ) : (
                        <button
                          onClick={action}
                          class="text-xs font-bold uppercase tracking-wide"
                        >
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
