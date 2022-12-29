// @refresh reload
import { Component, Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start'

import Base from '~/layouts/Base'
import { AddNewProjectModal } from './modals/AddNewProjectModal'

export const Root: Component = () => {
  return (
    <Html lang="en" data-theme="forest" class="font-sans">
      <Head>
        <Title>JustTimeTrack</Title>
        <Meta
          name="description"
          content="A Free and Open source Time Tracker for Freelancers."
        />
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="icon" href="/assets/images/logo.png" />
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
  )
}

export default Root
