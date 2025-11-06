# Deployment Guide

## Database Schema Changes

This project uses MongoDB with Mongoose. Unlike SQL databases, MongoDB doesn't require explicit migrations. The schema is flexible and will automatically adapt to new fields.

### Schema Changes Made

1. **Event Model Updates:**
   - Added `activityIncludes` field (optional string)
   - Changed `imageUrl` → `bannerImage`
   - Removed `type` field (if existed)
   - Removed `isPastEvent` field (if existed)

### Important Notes

- **Existing documents**: Existing events in the database will continue to work without issues since all new fields are optional
- **New fields**: New fields will be `null` or `undefined` for existing events until they're updated
- **Backward compatibility**: The application handles missing fields gracefully

## Deployment Steps

### 1. Environment Variables

Ensure your `.env` file contains:
```
CONNECTION_STRING=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_secret_key_here
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Database Migration (Optional but Recommended)

Run the migration script to ensure data consistency:

```bash
npm run migrate
```

This will:
- Migrate old `imageUrl` fields to `bannerImage`
- Ensure all events have the `activityIncludes` field
- Remove deprecated fields if they exist

### 4. Create Admin User

If you haven't created an admin user yet:

```bash
npm run create-admin [username] [password]
```

Default: `npm run create-admin admin admin123`

### 5. Start the Server

For production:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Frontend Deployment

### 1. Environment Variables

Create a `.env` file in `frontend/womeninkuwait-app/`:
```
VITE_API_URL=http://your-backend-url:3000
```

### 2. Build the Frontend

```bash
cd frontend/womeninkuwait-app
npm install
npm run build
```

### 3. Serve the Build

The `dist` folder contains the production build. Serve it using:
- Nginx
- Apache
- Node.js static server
- Any static file hosting service

## Production Checklist

- [ ] Backend `.env` file configured with production values
- [ ] MongoDB connection string updated
- [ ] JWT_SECRET set to a strong, random value
- [ ] Admin user created
- [ ] Migration script run (optional)
- [ ] Backend server running
- [ ] Frontend `.env` file configured with backend URL
- [ ] Frontend built and deployed
- [ ] CORS configured correctly (if frontend and backend are on different domains)
- [ ] File uploads directory (`backend/uploads/`) has proper permissions
- [ ] Static files from `backend/uploads/` are accessible

## Troubleshooting

### Events not showing up
- Check if backend API is accessible
- Verify `VITE_API_URL` in frontend matches backend URL
- Check browser console for errors

### Image uploads not working
- Ensure `backend/uploads/` directory exists and is writable
- Check backend logs for upload errors
- Verify file size limits (5MB max)

### Admin login not working
- Verify admin user exists: Check MongoDB or create new admin
- Check JWT_SECRET is set correctly
- Verify token is being sent in requests

