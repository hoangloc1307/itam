import { IconFileSettings, IconLifebuoy, IconSend } from '@tabler/icons-react';
import type { NavItem } from '~/components/nav-main';

const MAIN_MENU = [
  {
    title: 'Master',
    url: '',
    icon: IconFileSettings,
    children: [
      {
        title: 'Category',
        url: '/category',
      },
      {
        title: 'Model',
        url: '/model',
      },
    ],
  },
] as const satisfies NavItem[];

const SECONDARY_MENU = [
  {
    title: 'Support',
    url: '/',
    icon: IconLifebuoy,
  },
  {
    title: 'Feedback',
    url: '/',
    icon: IconSend,
  },
];

const MENU = { MAIN_MENU, SECONDARY_MENU };

export default MENU;
