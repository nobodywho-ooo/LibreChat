import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SystemRoles } from 'librechat-data-provider';
import { AlertCircle, ArrowDown, ArrowUp, Search } from 'lucide-react';
import { Button, Dropdown, Input, Spinner, useMediaQuery } from '@librechat/client';
import type { TAdminUser, TAdminUsersParams } from 'librechat-data-provider';
import { useAuthContext, useDocumentTitle, useLocalize } from '~/hooks';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import { useAdminUsersQuery } from '~/data-provider';
import { cn } from '~/utils';

type Localize = ReturnType<typeof useLocalize>;
type Sort = Required<Pick<TAdminUsersParams, 'sortBy' | 'sortDirection'>>;

const PAGE_SIZE = 25;
const searchDelayMs = 350;

function roleLabel(role: string, localize: Localize) {
  if (role === SystemRoles.ADMIN) {
    return localize('com_ui_admin');
  }
  if (role === SystemRoles.USER) {
    return localize('com_admin_users_role_user');
  }
  return role;
}

function providerLabel(provider: string, localize: Localize) {
  if (provider === 'local') {
    return localize('com_admin_users_provider_local');
  }
  if (provider === 'openid') {
    return localize('com_admin_users_provider_openid');
  }
  return provider;
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) {
    return '—';
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));
}

function initials(user: TAdminUser) {
  const source = user.name || user.email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function UserCell({ user }: { user: TAdminUser }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {user.avatar ? (
        <img src={user.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-xs font-medium">
          {initials(user)}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate text-text-primary">{user.name || user.username}</div>
        <div className="truncate text-xs text-text-secondary">{user.email}</div>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  field,
  sort,
  setSort,
  className,
}: {
  label: string;
  field: 'name' | 'createdAt';
  sort: Sort;
  setSort: (sort: Sort) => void;
  className?: string;
}) {
  const active = sort.sortBy === field;
  const descending = active && sort.sortDirection === 'desc';
  const Icon = descending ? ArrowDown : ArrowUp;
  let ariaSort: 'ascending' | 'descending' | 'none' = 'none';
  if (active) {
    ariaSort = descending ? 'descending' : 'ascending';
  }
  return (
    <th className={cn('px-2 py-2 font-medium', className)} aria-sort={ariaSort}>
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-text-primary"
        onClick={() =>
          setSort({ sortBy: field, sortDirection: active && !descending ? 'desc' : 'asc' })
        }
      >
        {label}
        {active && <Icon className="size-3" aria-hidden="true" />}
      </button>
    </th>
  );
}

export default function UsersView() {
  const localize = useLocalize();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { user } = useAuthContext();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isAdmin = user?.role === SystemRoles.ADMIN;

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [provider, setProvider] = useState('');
  const [sort, setSort] = useState<Sort>({ sortBy: 'createdAt', sortDirection: 'desc' });
  const [offset, setOffset] = useState(0);

  const params: TAdminUsersParams = { search, role, provider, ...sort, limit: PAGE_SIZE, offset };
  const users = useAdminUsersQuery(params, { enabled: isAdmin });
  const data = users.data;

  useDocumentTitle(`${localize('com_admin_users_title')} | LibreChat`);

  useEffect(() => {
    const next = searchInput.trim();
    if (next === search) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setSearch(next);
      setOffset(0);
    }, searchDelayMs);
    return () => window.clearTimeout(timeout);
  }, [search, searchInput]);

  if (!isAdmin) {
    return <Navigate to="/c/new" replace />;
  }

  const roleOptions = [
    { value: '', label: localize('com_admin_users_all_roles') },
    { value: SystemRoles.ADMIN, label: roleLabel(SystemRoles.ADMIN, localize) },
    { value: SystemRoles.USER, label: roleLabel(SystemRoles.USER, localize) },
  ];
  const providerOptions = [
    { value: '', label: localize('com_admin_users_all_providers') },
    { value: 'openid', label: providerLabel('openid', localize) },
    { value: 'local', label: providerLabel('local', localize) },
  ];
  const total = data?.total ?? 0;
  const rows = data?.users ?? [];

  return (
    <div className="flex h-full w-full min-w-0 flex-col bg-presentation text-text-primary">
      <header className="z-20 flex min-h-14 w-full flex-shrink-0 items-center gap-3 border-b border-border-light bg-presentation px-4 py-3 sm:px-5 md:px-6 lg:px-8">
        {isSmallScreen && <OpenSidebar />}
        <h1 className="text-base font-semibold">{localize('com_admin_users_title')}</h1>
        {users.isFetching && <Spinner className="size-4 text-text-secondary" />}
      </header>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex w-full min-w-0 flex-col gap-4 px-4 py-4 sm:px-5 md:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
                aria-hidden="true"
              />
              <Input
                aria-label={localize('com_admin_users_search')}
                className="pl-9"
                maxLength={200}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={localize('com_admin_users_search')}
                value={searchInput}
              />
            </div>
            <Dropdown
              value={role}
              options={roleOptions}
              ariaLabel={localize('com_admin_users_filter_role')}
              testId="admin-users-role-filter"
              onChange={(value) => {
                setRole(value);
                setOffset(0);
              }}
            />
            <Dropdown
              value={provider}
              options={providerOptions}
              ariaLabel={localize('com_admin_users_filter_provider')}
              testId="admin-users-provider-filter"
              onChange={(value) => {
                setProvider(value);
                setOffset(0);
              }}
            />
          </div>

          {users.isError ? (
            <section className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-primary p-5">
              <AlertCircle className="size-4 text-status-error" />
              <span className="text-sm">{localize('com_admin_users_load_error')}</span>
            </section>
          ) : (
            <section className="min-w-0 overflow-hidden rounded-lg border border-border-light bg-surface-primary">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] table-fixed text-left text-sm">
                  <thead className="border-b border-border-medium text-xs text-text-secondary">
                    <tr>
                      <SortHeader
                        label={localize('com_admin_users_col_user')}
                        field="name"
                        sort={sort}
                        setSort={setSort}
                        className="pl-4"
                      />
                      <th className="w-32 px-2 py-2 font-medium">{localize('com_ui_role')}</th>
                      <th className="w-40 px-2 py-2 font-medium">
                        {localize('com_admin_users_col_provider')}
                      </th>
                      <SortHeader
                        label={localize('com_admin_users_col_created')}
                        field="createdAt"
                        sort={sort}
                        setSort={setSort}
                        className="w-40 pr-4"
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {rows.map((row) => (
                      <tr key={row.id} className="hover:bg-surface-hover">
                        <td className="py-3 pl-4 pr-2">
                          <UserCell user={row} />
                        </td>
                        <td className="px-2 py-3">{roleLabel(row.role, localize)}</td>
                        <td className="px-2 py-3 text-text-secondary">
                          {providerLabel(row.provider, localize)}
                        </td>
                        <td className="whitespace-nowrap py-3 pl-2 pr-4 text-text-secondary">
                          {formatDate(row.createdAt, locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.isLoading && (
                <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-text-secondary">
                  <Spinner className="size-4" />
                  {localize('com_admin_users_loading')}
                </div>
              )}
              {data && rows.length === 0 && (
                <div className="flex min-h-40 items-center justify-center text-sm text-text-secondary">
                  {localize('com_admin_users_empty')}
                </div>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-border-light px-4 py-3 text-sm text-text-secondary">
                <span>
                  {total > 0 &&
                    localize('com_admin_users_range', {
                      from: offset + 1,
                      to: Math.min(offset + PAGE_SIZE, total),
                      total,
                    })}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={users.isFetching || offset === 0}
                    onClick={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))}
                  >
                    {localize('com_ui_prev')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={users.isFetching || offset + PAGE_SIZE >= total}
                    onClick={() => setOffset((value) => value + PAGE_SIZE)}
                  >
                    {localize('com_ui_next')}
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
