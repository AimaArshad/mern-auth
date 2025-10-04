# mern-auth
User Authentication--OTP generation, Email Verification, Reset Password
`# Secure MERN Authentication System

## Overview
A comprehensive and secure authentication system built with the MERN stack, featuring advanced security measures and user management capabilities.

## Key Features
- **User Registration & Login**: Secure signup and login with form validation
- **Email Verification**: OTP-based email verification system
- **Password Reset**: Secure password reset flow with email confirmation
- **JWT Authentication**: Stateless authentication with refresh tokens
- **Protected Routes**: Route guarding for authenticated users only
- **Cookie Management**: Secure HTTP-only cookies for token storage
- **Session Security**: Automatic session management and cleanup

## Security Implementations
- Password hashing with bcryptjs
- JWT token expiration and refresh mechanisms
- HTTP-only cookies for secure token storage
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Rate limiting for authentication endpoints

## Technologies & Tools
### Frontend
- React.js with Hooks and Context API
- React Router for navigation
- React Bootstrap for UI components
- Axios for API calls
- Form validation with custom hooks

### Backend
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT for token generation and verification
- Nodemailer for email services
- bcryptjs for password hashing
- Cookie-parser for cookie management

### Development Tools
- Environment variables configuration
- CORS setup for development/production
- Error handling middleware
- Custom response handlers

## Project Structure

mern-auth/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    
│   │   ├── context/       
│   │   ├── pages/       
│   │   └── assets/       
├── server/                 # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── middleware/        # Custom middleware
│   ├── routes/            # API routes
│   └── utils/             # Helper functions
└── config/                # Configuration files


## API Endpoints
- \`POST /auth/register\` - User registration
- \`POST /auth/login\` - User login
- \`POST /auth/send-verify-otp\` - Send verification email
- \`POST /auth/verify-email\` - Verify email with OTP
- \`POST /auth/send-reset-otp\` - Send password reset OTP
- \`POST /auth/reset-password\` - Reset password
- \`POST /auth/logout\` - User logout
- \`GET /auth/is-auth\` - Check authentication status
- \`GET /user/userData\` - Get user data

## Security Features
- Password strength validation
- Account lockout prevention
- Secure token storage in HTTP-only cookies
- Automatic token refresh
- Email verification requirement
- Session timeout handling

## Installation & Setup
1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Configure MongoDB connection
5. Set up email service (Nodemailer)
6. Run development servers

## Environment Variables

# Backend
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000

# Frontend
VITE_BACKEND_URL=http://localhost:5000


## Concepts Implemented
- **State Management**: React Context API for global state
- **Authentication Flow**: Complete auth cycle from registration to logout
- **Middleware**: Express middleware for authentication and validation
- **Error Handling**: Comprehensive error handling on both client and server
- **Responsive Design**: Mobile-first responsive UI design
- **API Security**: Protection against common web vulnerabilities

