export interface IUserTagID {
  user_role: IUserRole;
  organization_role: IOrganizationRole;
  _id: string;
  user_id: string;
  tag_id: string;
  registered_by_user_id: number;
  email: null;
  first_name: string;
  identification_img_url: string;
  identification_img_file_name: string;
  last_name: string;
  mobile_number: string;
  badge: string;
  adminuser: string;
  adminpassword: string;
  adminsub: string;
  arrivaldate: string;
  accessdate: string;
  limitdate: string;
  custom_properties: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganizationRole {
  region: string;
  zona: string;
  distrito: string;
  tienda: string;
  area: string;
  role: string;
}

export interface IUserRole {
  role: string;
}
