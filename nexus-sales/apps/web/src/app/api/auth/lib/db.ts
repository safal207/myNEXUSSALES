// A simple in-memory store for mock data
// NOTE: This is NOT a real database and will be reset on every server restart.
// It is for development and mocking purposes only.

// User Store
export const users = new Map<string, any>();
users.set('test@test.com', {
  id: 1,
  email: 'test@test.com',
  password: 'password123'
});

// Product Store
export const products = new Map<number, any>();
products.set(1, {
  id: 1,
  userId: 1, // Belongs to test@test.com
  name: 'My First Awesome Course',
  description: 'This is the best course ever.',
  price: 4999, // in cents
});
products.set(2, {
  id: 2,
  userId: 1,
  name: 'My Second Product',
  description: 'Another great offering.',
  price: 9999,
});

// Order Store
export const orders = new Map<number, any>();
