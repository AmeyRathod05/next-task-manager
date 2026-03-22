import "dotenv/config";
import { PrismaClient } from '../generated/prisma/index'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Simple in-memory mock database for development
interface MockUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
}

interface MockTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignedToId?: string;
  createdAt: string;
}

const mockUsers: MockUser[] = [];
const mockTasks: MockTask[] = [];

// For development, use a simple mock database
const isDevelopment = process.env.NODE_ENV !== 'production'

const mockPrisma = {
  user: {
    findUnique: async ({ where }: any) => {
      console.log('Mock DB - Find user:', where);
      if (where.email) {
        const user = mockUsers.find(u => u.email === where.email);
        console.log('Mock DB - User found:', !!user);
        return user || null;
      }
      if (where.id) {
        return mockUsers.find(u => u.id === where.id) || null;
      }
      return null;
    },
    findMany: async () => {
      console.log('Mock DB - Find all users, count:', mockUsers.length);
      return mockUsers;
    },
    create: async ({ data }: any) => {
      console.log('Mock DB - Creating user:', { email: data.email, name: data.name });
      const newUser: MockUser = {
        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: data.email,
        name: data.name,
        password: data.password, // Store as plain text for mock
        role: data.role || 'USER',
        createdAt: new Date().toISOString()
      };
      mockUsers.push(newUser);
      console.log('Mock DB - User created:', newUser.id);
      return newUser;
    },
    update: async ({ where, data }: any) => {
      const index = mockUsers.findIndex(u => u.id === where.id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data };
        console.log('Mock DB - User updated:', where.id);
        return mockUsers[index];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const index = mockUsers.findIndex(u => u.id === where.id);
      if (index !== -1) {
        const deleted = mockUsers[index];
        mockUsers.splice(index, 1);
        console.log('Mock DB - User deleted:', where.id);
        return deleted;
      }
      return null;
    },
    count: async () => mockUsers.length
  },
  task: {
    findUnique: async ({ where }: any) => {
      return mockTasks.find(t => t.id === where.id) || null;
    },
    findMany: async () => mockTasks,
    create: async ({ data }: any) => {
      const newTask: MockTask = {
        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: data.title,
        description: data.description,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        assignedToId: data.assignedToId,
        createdAt: new Date().toISOString()
      };
      mockTasks.push(newTask);
      return newTask;
    },
    update: async ({ where, data }: any) => {
      const index = mockTasks.findIndex(t => t.id === where.id);
      if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...data };
        return mockTasks[index];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const index = mockTasks.findIndex(t => t.id === where.id);
      if (index !== -1) {
        const deleted = mockTasks[index];
        mockTasks.splice(index, 1);
        return deleted;
      }
      return null;
    },
    count: async () => mockTasks.length
  }
};

export const prisma = isDevelopment ? mockPrisma as any : (
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })
)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
