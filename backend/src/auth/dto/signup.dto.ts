export enum ParentUserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PARTNER_ADMIN = 'PARTNER_ADMIN',
}

export class SignUpDto {
  name: string;
  email: string;
  password: string;
  parent_role: ParentUserRole;
}
