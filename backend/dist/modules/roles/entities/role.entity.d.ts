import { User } from '../../users/entities/user.entity';
export declare class Role {
    id: string;
    name: string;
    code: string;
    description: string;
    permissions: string[];
    isActive: boolean;
    isSystem: boolean;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
