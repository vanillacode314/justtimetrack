import { Component } from "solid-js";

export const Navbar: Component = () => {
  return (
    <div class="navbar bg-base-100 border-2 border-stone-900">
      <div class="flex-none">
        <label for="main-drawer" class="btn btn-square btn-ghost lg:hidden">
          <div class="text-2xl i-mdi-menu" />
        </label>
      </div>
      <div class="px-3 flex-1">
        <span class="font-semibold">JustTimeTrack</span>
      </div>
    </div>
  );
};

export default Navbar;
