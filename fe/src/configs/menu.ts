import { IconFileSettings, IconLifebuoy, IconSend } from '@tabler/icons-react';
import type { NavItem } from '~/components/nav-main';

const MAIN_MENU: NavItem[] = [
  {
    title: 'Master',
    url: '',
    icon: IconFileSettings,
    children: [
      {
        title: 'Category',
        url: '/category',
        featureCode: 'CATEGORY',
      },
      {
        title: 'Model',
        url: '/model',
        featureCode: 'MODEL',
      },
    ],
  },
];

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
