# Notes API

A scalable REST API for notes management with JWT authentication and role-based access control.

## 🚀 Features

- **JWT Authentication** with access & refresh tokens
- **Role-based access** (User/Admin)
- **CRUD operations** for Notes
- **Secure password hashing** with bcrypt
- **Input validation** and error handling
- **API versioning** support

## 🛠️ Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** 5.x
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm or yarn

## ⚙️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/primetrade-notes-api.git
cd primetrade-notes-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/primetrade_notes
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIREIN=7d
```

4. **Start MongoDB:**
```bash
mongod
```

5. **Run the application:**
```bash
# Development mode
npm run dev

# Production mode
npm run start
```

## 📁 Project Structure

```
src/
├── config/         # Configuration files
│   ├── config.ts   # Environment config
│   └── database.ts # Database connection
├── controllers/    # Request handlers
│   ├── auth.controller.ts
│   └── note.controller.ts
├── middleware/     # Express middleware
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── models/         # Database models
│   ├── user.model.ts
│   └── note.model.ts
├── routes/         # API routes
│   ├── auth.routes.ts
│   ├── note.routes.ts
│   └── index.ts
├── services/       # Business logic
│   ├── auth.service.ts
│   └── note.service.ts
├── utils/          # Utility functions
│   ├── errors.ts
│   └── jwt.utils.ts
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Notes (Protected)
- `POST /api/v1/notes` - Create note
- `GET /api/v1/notes` - Get all user's notes
- `GET /api/v1/notes/:id` - Get specific note
- `PUT /api/v1/notes/:id` - Update note
- `DELETE /api/v1/notes/:id` - Delete note

### Admin
- `GET /api/v1/admin/notes` - Get all notes (admin only)

## 📝 API Documentation

Detailed API documentation with request/response examples is available in [API_ENDPOINTS.md](./API_ENDPOINTS.md)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens stored in HTTP-only cookies
- Input validation and sanitization
- Error handling middleware
- CORS configuration
- Helmet.js for security headers
- Environment-based configuration

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key (min 32 chars) | Required |
| `JWT_EXPIREIN` | JWT token expiration | `7d` |

## 📈 Scalability Considerations

### Current Implementation
- **Modular architecture** with separation of concerns
- **Service layer pattern** for business logic
- **Error handling middleware** for consistent error responses
- **Database indexing** for optimized queries
- **Pagination** support for large datasets

### Future Enhancements
- **Redis** for caching and session management
- **Rate limiting** to prevent API abuse
- **API Gateway** for microservices architecture
- **Load balancing** with PM2 or Kubernetes
- **Database replication** for high availability
- **Message queues** for async processing
- **Elasticsearch** for advanced search capabilities
- **Docker** containerization for easy deployment

## 🧪 Testing

```bash
# Run with sample requests
npm run dev

# Test endpoints using the provided Postman collection
# or use the API documentation in API_ENDPOINTS.md
```

