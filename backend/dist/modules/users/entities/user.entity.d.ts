import { Role } from '../../roles/entities/role.entity';
import { School } from '../../schools/entities/school.entity';
export declare class User {
    id: string;
    username: string;
    password: string;
    realName: string;
    email: string;
    phone: string;
    avatar: string;
    isActive: boolean;
    roles: Role[];
    school: School;
    schoolId: string;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
