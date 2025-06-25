# CORS Configuration Guide

This document explains how to fix the "Response body is not available to scripts (Reason: CORS Missing Allow Origin)" error.

## What is CORS?

Cross-Origin Resource Sharing (CORS) is a security feature implemented by web browsers. It prevents JavaScript from making requests to a different domain than the one that served the web page.

## How to Fix CORS Issues

### 1. Backend Configuration (Recommended Solution)

The proper way to fix CORS issues is to configure your backend server to allow requests from your frontend application.

#### For FastAPI Backend

Add this code to your main FastAPI application file:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # List of allowed origins (frontend URLs)
    allow_origins=[
        "http://localhost:5173",  # Vite default dev server
        # Add your production URL here
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Rest of your FastAPI app...
```

### 2. Frontend Adjustments

We've already made these changes to the frontend:

1. Set `withCredentials: false` in the Axios configuration
2. Added CORS detection logic to better handle errors
3. Added specific error messages for CORS issues

## Debugging CORS Issues

If you're still experiencing CORS issues:

1. Check browser console for specific CORS error messages
2. Verify that your backend's `allow_origins` includes your frontend's URL
3. Ensure the request doesn't include custom headers not allowed by the backend
4. For development, you can use browser extensions to disable CORS (NOT recommended for production)

## References

- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
