import { PermissionAction, ScreenResource } from '@prisma/client';

export const screens = [
  {
    id: 1,
    resource: ScreenResource.DASHBOARD,
    actions: [
      PermissionAction.READ,
      PermissionAction.WRITE,
      PermissionAction.UPDATE,
    ],
    route: 'dashboard',
    display_name: 'Dashboard',
  },
  {
    id: 2,
    resource: ScreenResource.STUDENTS,
    actions: [
      PermissionAction.READ,
      PermissionAction.WRITE,
      PermissionAction.UPDATE,
    ],
    route: 'students',
    display_name: 'Students',
  },
  {
    id: 3,
    resource: ScreenResource.COURSE_SEARCH,
    actions: [
      PermissionAction.READ,
      PermissionAction.WRITE,
      PermissionAction.UPDATE,
    ],
    route: 'course-search',
    display_name: 'Course Search',
  },
  {
    id: 4,
    resource: ScreenResource.NOTIFICATION,
    actions: [
      PermissionAction.READ,
      PermissionAction.WRITE,
      PermissionAction.UPDATE,
    ],
    route: 'notification',
    display_name: 'Notification',
  },
  {
    id: 5,
    resource: ScreenResource.ADMINISTRATION,
    actions: [
      PermissionAction.READ,
      PermissionAction.WRITE,
      PermissionAction.UPDATE,
    ],
    route: 'administration',
    display_name: 'Administration',
  },
  // {
  //   id: 6,
  //   resource: ScreenResource.COURSE_SEARCH,
  //   actions: [
  //     PermissionAction.READ,
  //     PermissionAction.WRITE,
  //     PermissionAction.UPDATE,
  //   ],
  //   route: 'course/search',
  //   display_name: 'Search',
  //   parent_id: 3,
  // },
  // {
  //   id: 7,
  //   resource: ScreenResource.COURSE_LIST,
  //   actions: [
  //     PermissionAction.READ,
  //     PermissionAction.WRITE,
  //     PermissionAction.UPDATE,
  //   ],
  //   route: 'courses/list',
  //   display_name: 'List',
  //   parent_id: 3,
  // },
  {
    id: 6,
    resource: ScreenResource.USERS,
    actions: [
      PermissionAction.READ,
      PermissionAction.WRITE,
      PermissionAction.UPDATE,
    ],
    route: 'administration/users',
    display_name: 'Users',
    parent_id: 5,
  },
  {
    id: 7,
    resource: ScreenResource.ROLES,
    actions: [
      PermissionAction.READ,
      PermissionAction.WRITE,
      PermissionAction.UPDATE,
    ],
    route: 'administration/roles',
    display_name: 'Roles',
    parent_id: 5,
  },
];
