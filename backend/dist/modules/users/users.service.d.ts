import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(query: QueryUserDto): Promise<{
        data: User[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<User>;
    findByUsernameWithPassword(username: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    updateLastLogin(id: string): Promise<void>;
    assignRoles(userId: string, roleIds: string[]): Promise<User>;
}
