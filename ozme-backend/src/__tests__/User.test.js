import User from '../models/User.js';
import mongoose from 'mongoose';

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ozme-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBeDefined();
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });

  it('should hash password before saving', async () => {
    const userData = {
      name: 'Test User',
      email: 'test2@example.com',
      password: 'password123',
    };

    const user = await User.create(userData);
    const isMatch = await user.matchPassword('password123');

    expect(isMatch).toBe(true);
  });

  it('should not return password by default', async () => {
    const userData = {
      name: 'Test User',
      email: 'test3@example.com',
      password: 'password123',
    };

    await User.create(userData);
    const user = await User.findOne({ email: 'test3@example.com' });

    expect(user.password).toBeUndefined();
  });
});

