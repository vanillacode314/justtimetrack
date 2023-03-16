// @refresh reload
import { MetaProvider } from '@solidjs/meta'
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
import './root.css'

import Base from '~/layouts/Base'
import { AddNewProjectModal } from '~/modals/AddNewProjectModal'

export const Root: Component = () => {
  return (
    <MetaProvider tags={[]}>
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
            <Suspense
              fallback={
                <div class="p-5 grid place-items-center">
                  <Spinner />
                </div>
              }
            >
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
    </MetaProvider>
  )
}

export default Root
