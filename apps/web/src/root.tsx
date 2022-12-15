// @refresh reload
import { Component, Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";

import "@unocss/reset/tailwind.css";
import "@kidonng/daisyui/index.css";
import "virtual:uno.css";
import Base from "~/layouts/Base";
import { AddNewProjectModal } from "./modals/AddNewProject";

export const Root: Component = () => {
  return (
    <Html lang="en" data-theme="forest" class="font-sans">
      <Head>
        <Title>JustTimeTrack</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Base>
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary>
              <AddNewProjectModal />
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
          <Scripts />
        </Base>
      </Body>
    </Html>
  );
};

export default Root;
