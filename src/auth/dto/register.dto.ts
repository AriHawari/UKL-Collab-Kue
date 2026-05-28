import { UserRole } from 'generated/prisma/client';

export class RegisterDto {
name: string;
email: string;
password: string;
role: UserRole;
}