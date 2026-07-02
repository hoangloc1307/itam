import { IconChevronRight, type TablerIcon } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar';
import { useAuthStore } from '~/stores/auth';

export type NavItem = {
  title: string;
  url: string;
  icon: TablerIcon;
  featureCode?: string;
  isActive?: boolean;
  children?: {
    title: string;
    url: string;
    featureCode?: string;
  }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const visibleItems = items
    .map((item) => {
      if (item.children?.length) {
        const visibleChildren = item.children.filter(
          (child) => !child.featureCode || hasPermission(child.featureCode),
        );

        if (visibleChildren.length === 0) return null;
        return { ...item, children: visibleChildren };
      }

      if (item.featureCode && !hasPermission(item.featureCode)) return null;
      return item;
    })
    .filter(Boolean) as NavItem[];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {visibleItems.map((item) =>
          item.children?.length ? (
            <Collapsible key={item.title} render={<SidebarMenuItem />}>
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <IconChevronRight className='ml-auto transition-transform duration-200 in-data-panel-open:rotate-90' />
                  </SidebarMenuButton>
                }
              />
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.children.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton render={<Link to={subItem.url} />}>
                        <span>{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} render={<Link to={item.url} />}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
