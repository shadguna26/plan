const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Load users from file
 */
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
}

/**
 * Save users to file
 */
function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
}

/**
 * Register a new user
 */
async function registerUser(email, password, name) {
  const users = loadUsers();

  // Check if user already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name: name,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  };
}

/**
 * Login user
 */
async function loginUser(email, password) {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  };
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Get user by ID
 */
function getUserById(userId) {
  const users = loadUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name
  };
}

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  getUserById
};


