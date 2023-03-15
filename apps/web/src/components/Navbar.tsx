import { Component } from 'solid-js'

export const Navbar: Component = () => {
  return (
    <div class="navbar bg-base-300">
      <div class="flex-none">
        <label for="main-drawer" class="btn btn-square btn-ghost lg:hidden">
          <div class="text-2xl i-mdi-menu" />
        </label>
      </div>
    </div>
  )
}

export default Navbar
