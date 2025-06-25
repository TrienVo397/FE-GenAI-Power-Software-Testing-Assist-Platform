# GenAI Power Software Testing Assistant Platform

A React-based frontend for a generative AI software testing assistant platform.

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# API Configuration
VITE_API_BASE_URL=https://localhost:5000
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token
VITE_AUTH_USER_KEY=user_info

# Feature Flags
VITE_ENABLE_GOOGLE_LOGIN=true
```

You can copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

## Development

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Framework

This project uses:

- React + Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests

## Import Path Aliases

This project uses path aliases to simplify imports. Instead of using relative paths like `../../components/Button`, you can use aliases:

```jsx
// Instead of this
import Button from "../../../components/ui/Button";
import { FEATURES } from "../../../configs/EnvConfig";

// Use this
import Button from "@@/components/ui/Button";
import { FEATURES } from "@@/configs/EnvConfig";
```

Available aliases:
- `@@/` - Points to the `src` directory

## Authentication

The application uses JWT-based authentication with:

- Username/password login
- Google OAuth login (optional)
- Token refresh mechanism
- Secure token storage
