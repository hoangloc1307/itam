import { IconFileSettings, IconLifebuoy, IconSend } from '@tabler/icons-react';
import { FEATURES } from 'itam-shared/constants';
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
        featureCode: FEATURES.CATEGORY,
      },
      {
        title: 'Model',
        url: '/model',
        featureCode: FEATURES.MODEL,
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
