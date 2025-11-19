# Task: Add protected route wrapper

## Description
In the React client, create a higher-order component or wrapper that protects routes from being accessed by unauthenticated users.

## Steps to Complete
1.  Create a new component, e.g., `ProtectedRoute.tsx`.
2.  This component should check for the existence and validity of the user's authentication token (e.g., from local storage or a context).
3.  If the user is authenticated, it should render the child components (`<Outlet />` from React Router).
4.  If the user is not authenticated, it should redirect them to the `/login` page using the `<Navigate />` component.
5.  Wrap the application's protected routes (e.g., the admin dashboard) with this `ProtectedRoute` component in the main router configuration.

## Definition of Done
- [ ] Unauthenticated users are redirected from protected routes to the login page.
- [ ] Authenticated users can access protected routes.
- [ ] CI passes.

## Related User Stories
- US08 — System protects state-changing endpoints
- US09 — Admin logs in via UI
