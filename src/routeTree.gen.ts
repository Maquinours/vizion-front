/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/auth'
import { Route as AppImport } from './routes/app'
import { Route as IndexImport } from './routes/index'
import { Route as AuthLoginImport } from './routes/auth/login'

// Create Virtual Routes

const AuthForgotPasswordLazyImport = createFileRoute('/auth/forgot-password')()
const AuthResetPasswordTokenLazyImport = createFileRoute(
  '/auth/reset-password/$token',
)()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  path: '/app',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthForgotPasswordLazyRoute = AuthForgotPasswordLazyImport.update({
  path: '/forgot-password',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/auth/forgot-password.lazy').then((d) => d.Route),
)

const AuthLoginRoute = AuthLoginImport.update({
  path: '/login',
  getParentRoute: () => AuthRoute,
} as any)

const AuthResetPasswordTokenLazyRoute = AuthResetPasswordTokenLazyImport.update(
  {
    path: '/reset-password/$token',
    getParentRoute: () => AuthRoute,
  } as any,
).lazy(() =>
  import('./routes/auth/reset-password.$token.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/app': {
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/auth/login': {
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof AuthImport
    }
    '/auth/forgot-password': {
      preLoaderRoute: typeof AuthForgotPasswordLazyImport
      parentRoute: typeof AuthImport
    }
    '/auth/reset-password/$token': {
      preLoaderRoute: typeof AuthResetPasswordTokenLazyImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AppRoute,
  AuthRoute.addChildren([
    AuthLoginRoute,
    AuthForgotPasswordLazyRoute,
    AuthResetPasswordTokenLazyRoute,
  ]),
])

/* prettier-ignore-end */
