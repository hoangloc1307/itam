import { IconFileSettings, IconLifebuoy, IconSend, IconShieldCog } from '@tabler/icons-react';
import { FEATURES } from 'itam-shared/constants';
import type { NavItem } from '~/components/nav-main';

const MAIN_MENU: NavItem[] = [
  {
    title: 'menu.master',
    url: '',
    icon: IconFileSettings,
    children: [
      {
        title: 'menu.category',
        url: '/category',
        featureCode: FEATURES.CATEGORY,
      },
      {
        title: 'menu.attribute',
        url: '/attribute',
        featureCode: FEATURES.ATTRIBUTE,
      },
      {
        title: 'menu.categoryAttribute',
        url: '/category-attribute',
        featureCode: FEATURES.CATEGORY,
      },
      {
        title: 'menu.model',
        url: '/model',
        featureCode: FEATURES.MODEL,
      },
    ],
  },
  {
    title: 'menu.admin',
    url: '',
    icon: IconShieldCog,
    children: [
      {
        title: 'menu.feature',
        url: '/feature',
        featureCode: FEATURES.FEATURE,
      },
      {
        title: 'menu.role',
        url: '/role',
        featureCode: FEATURES.ROLE,
      },
      {
        title: 'menu.rolePermission',
        url: '/role-permission',
        featureCode: FEATURES.ROLE,
      },
      {
        title: 'menu.userRole',
        url: '/user-role',
        featureCode: FEATURES.USER,
      },
      {
        title: 'menu.user',
        url: '/user',
        featureCode: FEATURES.USER,
      },
    ],
  },
];

const SECONDARY_MENU = [
  {
    title: 'menu.support',
    url: '/',
    icon: IconLifebuoy,
  },
  {
    title: 'menu.feedback',
    url: '/',
    icon: IconSend,
  },
];

const MENU = { MAIN_MENU, SECONDARY_MENU };

export default MENU;
