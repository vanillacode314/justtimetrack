import { Component, JSXElement } from "solid-js";
import { Drawer } from "~/components/Drawer";

interface Props {
  children: JSXElement;
}

export const BaseLayout: Component<Props> = (props) => {
  return (
    <>
      <Drawer />
      <main style={{ padding: "1rem" }}>{props.children}</main>
    </>
  );
};

export default BaseLayout;
