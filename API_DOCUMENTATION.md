# FridgeWiz API Documentation

## Overview

FridgeWiz is a GPT-powered recipe generation API that analyzes ingredient photos and creates personalized recipes. The backend provides RESTful endpoints for managing conversations, messages, and image uploads.

## Database Schema

### Models

- **User**: Optional user management
- **Conversation**: Chat sessions
- **Message**: Individual messages with role (USER/ASSISTANT/SYSTEM)
- **Image**: Attached images with metadata

## API Endpoints

### Health Check

#### GET `/api/health`

Check API and database connectivity.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "environment": "development"
}
```

### Conversations

#### POST `/api/conversations`

Create a new conversation.

**Request Body:**

```json
{
  "userId": "optional-user-id",
  "title": "My Recipe Chat"
}
```

**Response:**

```json
{
  "id": "conversation-id",
  "userId": null,
  "title": "My Recipe Chat",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "messages": []
}
```

#### GET `/api/conversations`

List conversations with pagination.

**Query Parameters:**

- `userId` (optional): Filter by user ID
- `limit` (optional, default: 10): Number of conversations
- `offset` (optional, default: 0): Pagination offset

#### GET `/api/conversations/[id]`

Get specific conversation with all messages.

#### PATCH `/api/conversations/[id]`

Update conversation title.

**Request Body:**

```json
{
  "title": "New Title"
}
```

#### DELETE `/api/conversations/[id]`

Delete conversation and all messages.

### Chat

#### POST `/api/chat`

Send message with optional images and get AI response.

**Request:** FormData

- `conversationId`: String (required)
- `message`: String (required)
- `images`: File[] (optional, multiple image files)

**Response:**

```json
{
  "userMessage": {
    "id": "message-id",
    "conversationId": "conv-id",
    "role": "USER",
    "content": "What can I cook with these ingredients?",
    "images": [
      {
        "id": "image-id",
        "filename": "fridge.jpg",
        "mimeType": "image/jpeg",
        "s3Key": "recipe-images/1704067200000-abc123.jpg",
        "url": "https://your-bucket.s3.us-east-1.amazonaws.com/recipe-images/1704067200000-abc123.jpg",
        "size": 123456,
        "width": 1024,
        "height": 768
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "assistantMessage": {
    "id": "message-id",
    "conversationId": "conv-id",
    "role": "ASSISTANT",
    "content": "Based on your ingredients, here are some recipe suggestions...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/chat?conversationId=xxx`

Get all messages in a conversation.

### Images

#### DELETE `/api/images/[id]`

Delete image from both S3 and database.

**Response:**

```json
{
  "success": true
}
```

## Environment Variables

```bash
# Database
DATABASE_URL="mongodb://localhost:27017/fridgewiz"

# AWS S3 Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your_access_key_here"
AWS_SECRET_ACCESS_KEY="your_secret_key_here"
S3_BUCKET_NAME="your_bucket_name_here"
CLOUDFRONT_DOMAIN="https://your-cloudfront-domain.net"  # Optional

# OpenAI API
OPENAI_API_KEY="your_openai_api_key_here"

# App Configuration
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES="image/jpeg,image/png,image/webp,image/gif"
```

## Setup Instructions

1. **Install Dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure Environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URL and OpenAI API key
   ```

3. **Set up AWS S3:**
   - Create an S3 bucket in AWS Console
   - Set bucket permissions for public read access (for images)
   - Create IAM user with S3 permissions
   - Add credentials to `.env` file
   - Optional: Set up CloudFront distribution for CDN

4. **Initialize Database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server:**
   ```bash
   pnpm dev
   ```

## Usage Examples

### Create Conversation and Send Image

```javascript
// Create conversation
const conversation = await fetch("/api/conversations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Recipe Ideas" }),
});

// Send message with images
const formData = new FormData();
formData.append("conversationId", conversation.id);
formData.append("message", "What can I cook with these ingredients?");
formData.append("images", fridgePhoto);

const response = await fetch("/api/chat", {
  method: "POST",
  body: formData,
});
```

### Continue Conversation

```javascript
const formData = new FormData();
formData.append("conversationId", conversationId);
formData.append("message", "Can you make it vegetarian?");

const response = await fetch("/api/chat", {
  method: "POST",
  body: formData,
});
```

## Features

- **Image Analysis**: Upload multiple ingredient photos
- **Recipe Generation**: AI-powered recipe suggestions
- **Conversation Memory**: Context-aware responses
- **S3 Image Storage**: Scalable cloud storage with AWS S3
- **CDN Support**: Optional CloudFront integration for fast image delivery
- **Image Management**: Upload, view, and delete images from S3
- **Error Handling**: Comprehensive error responses
- **Type Safety**: Full TypeScript support
- **Database**: MongoDB with Prisma ORM

## Error Responses

All endpoints return appropriate HTTP status codes:

- `400`: Bad Request (missing parameters)
- `404`: Not Found (conversation/resource not found)
- `500`: Internal Server Error

Error response format:

```json
{
  "error": "Descriptive error message"
}
```
