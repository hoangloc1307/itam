import { IconChevronRight, type TablerIcon } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar';

export type NavItem = {
  title: string;
  url: string;
  icon: TablerIcon;
  isActive?: boolean;
  children?: {
    title: string;
    url: string;
  }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} render={<SidebarMenuItem />}>
            <SidebarMenuButton tooltip={item.title} render={<Link to={item.url} />}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
            {item.children?.length ? (
              <>
                <CollapsibleTrigger
                  render={<SidebarMenuAction className='aria-expanded:rotate-90' />}
                >
                  <IconChevronRight />
                  <span className='sr-only'>Toggle</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton render={<a href={subItem.url} />}>
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : null}
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
