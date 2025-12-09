import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    password: 'hashedPassword',
    realName: '测试用户',
    email: 'test@example.com',
    avatar: null,
    roles: [{ id: 'role-1', code: 'admin', name: '管理员' }],
    school: { id: 'school-1', name: '测试学校' },
  };

  beforeEach(async () => {
    const mockUsersService = {
      findByUsernameWithPassword: jest.fn(),
      updateLastLogin: jest.fn(),
      findOne: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      usersService.findByUsernameWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('testuser', 'correctPassword');

      expect(result).toBeDefined();
      expect(result.id).toBe('user-123');
      expect(result.password).toBeUndefined();
      expect(usersService.findByUsernameWithPassword).toHaveBeenCalledWith('testuser');
    });

    it('should return null when user is not found', async () => {
      usersService.findByUsernameWithPassword.mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      usersService.findByUsernameWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser('testuser', 'wrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user info when login is successful', async () => {
      usersService.findByUsernameWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mock-jwt-token');
      usersService.updateLastLogin.mockResolvedValue(undefined);

      const result = await authService.login({
        username: 'testuser',
        password: 'correctPassword',
      });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.id).toBe('user-123');
      expect(result.user.username).toBe('testuser');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-123',
        username: 'testuser',
        roles: ['admin'],
      });
      expect(usersService.updateLastLogin).toHaveBeenCalledWith('user-123');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      usersService.findByUsernameWithPassword.mockResolvedValue(null);

      await expect(
        authService.login({ username: 'testuser', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with correct message', async () => {
      usersService.findByUsernameWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ username: 'testuser', password: 'wrongPassword' }),
      ).rejects.toThrow('用户名或密码错误');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const profileUser = { ...mockUser, password: undefined };
      usersService.findOne.mockResolvedValue(profileUser as any);

      const result = await authService.getProfile('user-123');

      expect(result).toBeDefined();
      expect(usersService.findOne).toHaveBeenCalledWith('user-123');
    });
  });
});
