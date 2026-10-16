import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, MessagesSquare, Users } from 'lucide-react';
import { useUserKeyQuery } from 'librechat-data-provider/react-query';
import { getConfigDefaults, getEndpointField, SystemRoles } from 'librechat-data-provider';
import type { TEndpointsConfig } from 'librechat-data-provider';
import type { NavLink } from '~/common';
import { useGetEndpointsQuery, useGetStartupConfig, useInsightsAccessQuery } from '~/data-provider';
import ConversationsSection from '~/components/UnifiedSidebar/ConversationsSection';
import useSideNavLinks from '~/hooks/Nav/useSideNavLinks';
import { useAuthContext } from '~/hooks';
import store from '~/store';

const defaultInterface = getConfigDefaults().interface;

export default function useUnifiedSidebarLinks() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  /** Selector instead of the full conversation atom: the links only depend on
   * the endpoint, so parameter edits and other conversation writes stay out. */
  const endpoint = useRecoilValue(store.conversationEndpointByIndex(0)) ?? undefined;
  const { data: startupConfig } = useGetStartupConfig();
  const { data: endpointsConfig = {} as TEndpointsConfig } = useGetEndpointsQuery();

  const interfaceConfig = useMemo(
    () => startupConfig?.interface ?? defaultInterface,
    [startupConfig],
  );
  const insightsFeatureEnabled = startupConfig?.insightsEnabled === true;
  const { data: insightsAccess } = useInsightsAccessQuery(user?.id, {
    enabled: user?.role === SystemRoles.ADMIN && insightsFeatureEnabled,
  });

  const endpointType = useMemo(
    () => getEndpointField(endpointsConfig, endpoint, 'type'),
    [endpoint, endpointsConfig],
  );

  const userProvidesKey = useMemo(
    () => !!(endpointsConfig?.[endpoint ?? '']?.userProvide ?? false),
    [endpointsConfig, endpoint],
  );

  const { data: keyExpiry = { expiresAt: undefined } } = useUserKeyQuery(endpoint ?? '');

  const keyProvided = useMemo(
    () => (userProvidesKey ? !!(keyExpiry.expiresAt ?? '') : true),
    [keyExpiry.expiresAt, userProvidesKey],
  );

  const sideNavLinks = useSideNavLinks({
    keyProvided,
    endpoint,
    endpointType,
    interfaceConfig,
    endpointsConfig,
    includeHidePanel: false,
  });

  const links = useMemo(() => {
    const conversationLink: NavLink = {
      title: 'com_ui_chat_history',
      label: '',
      icon: MessagesSquare,
      id: 'conversations',
      Component: ConversationsSection,
    };

    const nextLinks = [...sideNavLinks];
    const mcpIndex = nextLinks.findIndex((link) => link.id === 'mcp-builder');
    let insertAt = mcpIndex >= 0 ? mcpIndex + 1 : nextLinks.length;

    if (insightsFeatureEnabled && insightsAccess?.access === true) {
      nextLinks.splice(insertAt++, 0, {
        title: 'com_insights_navigation',
        label: '',
        icon: BarChart3,
        id: 'insights',
        onClick: () => {
          if (!location.pathname.startsWith('/insights')) {
            navigate('/insights');
          }
        },
      });
    }

    if (user?.role === SystemRoles.ADMIN) {
      nextLinks.splice(insertAt, 0, {
        title: 'com_admin_users_title',
        label: '',
        icon: Users,
        id: 'users',
        onClick: () => {
          if (!location.pathname.startsWith('/users')) {
            navigate('/users');
          }
        },
      });
    }

    return [conversationLink, ...nextLinks];
  }, [
    insightsAccess?.access,
    insightsFeatureEnabled,
    location.pathname,
    navigate,
    sideNavLinks,
    user?.role,
  ]);

  return links;
}
