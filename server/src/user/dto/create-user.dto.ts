import { ROLES } from "../roles";

export class CreateUserDto {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    current_organisation?: string;
    bio?: string;
    role?: ROLES;
}
