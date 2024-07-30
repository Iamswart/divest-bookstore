import AuthService from '../src/services/auth';
import db, { sequelize } from '../src/database/models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sqs from '../src/utils/sqs-consumer';




jest.mock('../src/database/models', () => ({
  __esModule: true,
  default: {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
  sequelize: {
    close: jest.fn(),
  },
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
}));

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(),
}));
jest.mock('../src/utils/sqs-consumer', () => ({
  sendMessage: jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({ MessageId: '123' }),
  }),
}));
jest.mock('../src/config/');

const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword',
  save: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const input = { email: 'new@example.com', name: 'New User', password: 'password123' };
      
      (db.User.findOne as jest.Mock).mockResolvedValue(null);
      (db.User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken');
      (sqs.sendMessage as jest.Mock).mockReturnValue({ promise: jest.fn().mockResolvedValue({ MessageId: '123' }) });
  
      const result = await authService.register(input);
  
      expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(db.User.create).toHaveBeenCalledWith(input);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(sqs.sendMessage).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  
    it('should throw an error if email already exists', async () => {
      const input = { email: 'existing@example.com', name: 'Existing User', password: 'password123' };
      
      (db.User.findOne as jest.Mock).mockResolvedValue(mockUser);
  
      await expect(authService.register(input)).rejects.toThrow('Email address already exist, please login to continue');
    });
  });


  describe('login', () => {
    it('should login a user successfully', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      
      (db.User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockedToken');
  
      const result = await authService.login(input);
  
      expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(bcrypt.compareSync).toHaveBeenCalledWith(input.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  
    it('should throw an error if user is not found', async () => {
      const input = { email: 'nonexistent@example.com', password: 'password123' };
      
      (db.User.findOne as jest.Mock).mockResolvedValue(null);
  
      await expect(authService.login(input)).rejects.toThrow('Email Or Password Incorrect');
    });
  
    it('should throw an error if user is inactive', async () => {
      const input = { email: 'inactive@example.com', password: 'password123' };
      
      (db.User.findOne as jest.Mock).mockResolvedValue({ ...mockUser, status: 'inactive' });
  
      await expect(authService.login(input)).rejects.toThrow('Your account has been disabled please contact support for further details');
    });
  
    it('should throw an error if password is incorrect', async () => {
      const input = { email: 'test@example.com', password: 'wrongpassword' };
      
      (db.User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
  
      await expect(authService.login(input)).rejects.toThrow('Email Or Password Incorrect');
    });
  });
});

afterAll(done => {
  sequelize.close();
  done();
});