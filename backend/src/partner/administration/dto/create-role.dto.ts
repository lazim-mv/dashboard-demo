export class CreateRoleDto {
  name: string;
  permissions: Permission[];
  screen_ids: number[];
}

export class Permission {
  id: number;
  screen_id: number | null;
  // type: PermissionTypeEnum;
  resource: PermissionResourceEnum;
  actions: PermissionActionEnum[];
  created_at: Date;
  updated_at: Date;
}

export class Screen {
  id: number;
  resource: ScreenResourceEnum;
  parent_screen_id: number | null;
}

export enum PermissionTypeEnum {
  NORMAL = 'NORMAL',
  SCREEN = 'SCREEN',
}

export enum PermissionResourceEnum {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  COURSE_SEARCH = 'COURSE_SEARCH',
  NOTIFICATION = 'NOTIFICATION',
  ADMINISTRATION = 'ADMINISTRATION',
  UNIVERSITIES = 'UNIVERSITIES',
  PARTNERS = 'PARTNERS',
}

export enum ScreenResourceEnum {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  COURSE_SEARCH = 'COURSE_SEARCH',
  NOTIFICATION = 'NOTIFICATION',
  ADMINISTRATION = 'ADMINISTRATION',
  UNIVERSITIES = 'UNIVERSITIES',
  PARTNERS = 'PARTNERS',
}

export enum PermissionActionEnum {
  READ = 'READ',
  WRITE = 'WRITE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
