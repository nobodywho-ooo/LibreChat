/** Routes that render a full page instead of the chat; the sidebar collapses to its icon rail. */
const PAGE_ROUTE_IDS = ['insights', 'users'] as const;

export function getPageRouteId(pathname: string): string | undefined {
  return PAGE_ROUTE_IDS.find((id) => pathname.startsWith(`/${id}`));
}
