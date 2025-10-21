# Username/Password Authentication Implementation

## Overview
Both **Admin** and **Faculty** users now use **username** and **password** for authentication. Email addresses are NOT used in the login or registration process.

---

## Implementation Details

### Backend Changes

#### 1. **Login Schema** (`backend/src/schemas/validation.js`)
```javascript
export const loginSchema = Joi.object({
  username: Joi.string().required(),  // Changed from email
  password: Joi.string().required()
});
```

#### 2. **Register Schema** (`backend/src/schemas/validation.js`)
```javascript
export const registerSchema = Joi.object({
  username: Joi.string().required(),  // Primary login credential
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('faculty', 'admin').default('faculty'),
  name: Joi.string(),  // Optional display name
  department_id: Joi.number().integer(),
  designation: Joi.string(),
  expertise: Joi.array().items(Joi.string()),
  preferences: Joi.array().items(Joi.string())
});
```

#### 3. **Login Controller** (`backend/src/controllers/authController.js`)
- Accepts `username` from request body
- Maps `username` to the `email` column in database (backend architecture uses email column for storage)
- Uses bcrypt to verify hashed passwords
- Returns JWT token on successful authentication

```javascript
const { username, password } = req.body;
// Query by email column using username value
.eq('email', username)
```

#### 4. **Register Controller** (`backend/src/controllers/authController.js`)
- Accepts `username` from request body
- Stores `username` in the `email` column (database schema reuse)
- Hashes password with bcrypt (saltRounds=10)
- Creates new user with role (faculty/admin)
- Auto-generates name from username if not provided
- Sets default department_id to 1 if not provided

```javascript
const { username, password, role, name, department_id, ... } = req.body;
// Store in email column
email: username,
name: name || username,  // Fallback to username
department_id: department_id || 1  // Default department
```

---

### Frontend Changes

#### 1. **Login Form** (`frontend/src/pages/Login.jsx`)
✅ Already correct - uses `username` and `password` fields
```jsx
<TextField label="Username" value={formData.username} ... />
<TextField label="Password" type="password" value={formData.password} ... />
```

#### 2. **Register Form** (`frontend/src/pages/Register.jsx`)
✅ Already correct - collects:
- `username` (required)
- `password` (required)
- `confirmPassword` (required)
- `role` (faculty/admin dropdown)

**No email field is shown to users**

---

## Database Schema

### Faculty Table Structure
The database uses this column structure:
```sql
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,    -- Stores username here
    password VARCHAR(255) NOT NULL,        -- Bcrypt hashed
    role VARCHAR(50) NOT NULL,             -- 'admin' or 'faculty'
    name VARCHAR(255),
    department_id INTEGER,
    designation VARCHAR(100),
    expertise TEXT[],
    preferences TEXT[]
);
```

**Important:** The `email` column is used to store usernames (architectural decision to reuse existing schema)

---

## Authentication Flow

### Login Flow
1. User enters `username` and `password` in frontend
2. Frontend sends `{username, password}` to `/api/auth/login`
3. Backend validates with `loginSchema`
4. Backend queries `faculty` table: `WHERE email = username`
5. Backend compares password using `bcrypt.compare()`
6. If valid, returns JWT token with user data
7. Frontend stores token in localStorage
8. User redirected to dashboard based on role

### Registration Flow
1. User enters `username`, `password`, `confirmPassword`, `role`
2. Frontend validates passwords match
3. Frontend sends `{username, password, role}` to `/api/auth/register`
4. Backend validates with `registerSchema`
5. Backend checks if username exists: `WHERE email = username`
6. Backend hashes password with bcrypt
7. Backend inserts: `email=username, password=hashed, role=role`
8. Returns JWT token
9. Frontend redirects to `/login`

---

## Test Credentials

After running `supabase_setup_fixed.sql`, these test accounts are available:

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin | admin123 | admin | Computer Science |
| john.smith@university.edu | admin123 | faculty | Computer Science |
| jane.doe@university.edu | admin123 | faculty | Electrical Engineering |
| robert.brown@university.edu | admin123 | faculty | Mechanical Engineering |

**Note:** Some test accounts use email-like usernames for demonstration, but login still uses the username field (not email validation).

---

## Security Features

1. **Password Hashing:** bcrypt with saltRounds=10
2. **JWT Tokens:** 24-hour expiry
3. **Password Minimum:** 6 characters required
4. **Unique Usernames:** Database constraint prevents duplicates
5. **Role-Based Access:** Admin/Faculty separation

---

## Consistency Checklist

✅ **Login Form** - Uses `username` field  
✅ **Login Schema** - Validates `username` field  
✅ **Login Controller** - Accepts `username` parameter  
✅ **Register Form** - Uses `username` field  
✅ **Register Schema** - Validates `username` field  
✅ **Register Controller** - Accepts `username` parameter  
✅ **Database Query** - Maps `username` to `email` column  
✅ **Admin Dashboard** - No email references  
✅ **Faculty Dashboard** - No email references  

---

## API Endpoints

### POST `/api/auth/login`
**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin",  // Contains username
    "role": "admin",
    "department": 1,
    "departmentName": "Computer Science",
    "name": "Admin User"
  }
}
```

### POST `/api/auth/register`
**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "role": "faculty"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 5,
    "email": "newuser",  // Contains username
    "role": "faculty",
    "department": 1,
    "name": "newuser"
  }
}
```

---

## Notes for Developers

1. **Column Mapping:** The `email` database column stores usernames. This is an architectural choice to avoid modifying the existing schema.

2. **Frontend Never Sees "Email":** All forms use "Username" labels and field names.

3. **Backend Translation:** The backend transparently maps `username` → `email` column.

4. **No Email Validation:** Usernames can be any string (no @ symbol required).

5. **Display Name:** The `name` field is used for display purposes in dashboards, separate from the login username.

---

## Migration Path

If you need to switch back to email-based authentication:
1. Update schemas to accept `email` instead of `username`
2. Add email validation to frontend forms
3. Remove the mapping in controllers
4. Update frontend labels from "Username" to "Email"
