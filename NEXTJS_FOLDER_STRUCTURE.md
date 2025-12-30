# Next.js 15 Folder Structure Guide

> **A comprehensive guide for organizing enterprise-grade Next.js applications**

---

## 📖 Table of Contents

1. [Introduction](#-introduction)
2. [Quick Start](#-quick-start)
3. [Complete Structure](#-complete-structure)
4. [Core Concepts](#-core-concepts)
5. [Folder Deep Dive](#-folder-deep-dive)
6. [Code Examples](#-code-examples)
7. [Implementation Guide](#-implementation-guide)
8. [Best Practices](#-best-practices)
9. [Resources](#-resources)

---

## 🎯 Introduction

### What is This Guide?

This guide provides a **production-ready folder structure** for Next.js 15 applications using:
- ✅ **App Router** (Next.js 15)
- ✅ **Feature-based architecture**
- ✅ **TypeScript**
- ✅ **Enterprise best practices**

### Who Should Use This?

- Teams building large-scale applications
- Developers seeking maintainable code organization
- Projects requiring role-based access control
- Applications with multiple features/modules

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Scalability** | Add features without affecting existing code |
| **Maintainability** | Consistent structure across the entire app |
| **Team Collaboration** | Multiple developers work independently |
| **Code Reusability** | Shared components and utilities |
| **Clear Boundaries** | Each feature is self-contained |

---

## 🚀 Quick Start

### Minimal Structure

Start with this basic structure and expand as needed:

```
my-app/
├── src/
│   ├── app/              # Next.js routes
│   ├── features/         # Feature modules
│   ├── components/       # Shared components
│   ├── hooks/           # Shared hooks
│   └── lib/             # Utilities & configs
├── public/              # Static assets
└── package.json
```

### First Steps

1. **Create the base folders**
   ```bash
   mkdir -p src/{app,features,components,hooks,lib}
   ```

2. **Configure path aliases** in `tsconfig.json`
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. **Start building features** (see [Feature Structure](#feature-structure))

---

## 📁 Complete Structure

<details>
<summary><strong>Click to expand full directory tree</strong></summary>

```
my-app/
├── public/                          # Static files (images, fonts, icons)
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── src/
│   ├── app/                         # Next.js App Router (routes)
│   │   ├── (auth)/                  # Auth routes (login, register)
│   │   ├── (app)/                   # Protected app routes
│   │   │   ├── (admin)/             # Admin-only routes
│   │   │   ├── (manager)/           # Manager-only routes
│   │   │   └── (customer)/          # Customer routes
│   │   ├── api/                     # API routes
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   │
│   ├── features/                    # Feature modules (self-contained)
│   │   ├── products/
│   │   ├── orders/
│   │   ├── users/
│   │   └── auth/
│   │
│   ├── components/                  # Global shared components
│   │   ├── ui/                      # Base UI (Shadcn)
│   │   ├── forms/                   # Form components
│   │   ├── tables/                  # Table components
│   │   ├── layout/                  # Layout components
│   │   └── guards/                  # Permission guards
│   │
│   ├── hooks/                       # Global custom hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── useApi.ts
│   │
│   ├── lib/                         # Utilities & configurations
│   │   ├── api/                     # API client setup
│   │   ├── auth/                    # Auth utilities
│   │   ├── utils/                   # Helper functions
│   │   ├── constants/               # Constants
│   │   └── providers/               # React providers
│   │
│   ├── types/                       # Global TypeScript types
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── styles/                      # Global styles
│   │   └── globals.css
│   │
│   ├── i18n/                        # Translations
│   │   └── locales/
│   │       ├── en/
│   │       └── ar/
│   │
│   └── middleware.ts                # Next.js middleware
│
├── tests/                           # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                       # Environment variables
├── next.config.js                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
└── package.json
```

</details>

---

## 💡 Core Concepts

### 1. Feature-Based Architecture

**What:** Each feature contains ALL its related files (components, hooks, API calls, types).

**Why:** 
- Easy to locate all code for a feature
- Features can be developed independently
- Reduced coupling between features

**Example:**
```
features/products/
├── components/       # Product-specific UI
├── hooks/           # Product-specific hooks
├── api/             # Product API calls
├── types/           # Product types
└── index.ts         # Public exports
```

### 2. Route Groups (Parentheses)

**What:** Folders wrapped in `()` don't affect the URL path.

**Why:** Organize routes by role or purpose without changing URLs.

**Example:**
```
app/
├── (auth)/
│   └── login/           → URL: /login
└── (app)/
    └── dashboard/       → URL: /dashboard
```

### 3. Colocation Principle

**What:** Keep related code close together.

**Why:** Easier to find, modify, and understand code.

**Example:**
```
features/products/
├── components/ProductForm.tsx
├── hooks/useProductForm.ts      # Used by ProductForm
└── config/formConfig.ts         # Used by ProductForm
```

---

## 🔍 Folder Deep Dive

### `src/app/` - Routes & Pages

> **Purpose:** Define your application's routes using Next.js App Router

#### Structure

```
app/
├── (auth)/                  # Authentication routes
│   ├── login/
│   │   └── page.tsx        # /login
│   └── register/
│       └── page.tsx        # /register
│
├── (app)/                   # Protected routes
│   ├── dashboard/
│   │   └── page.tsx        # /dashboard
│   └── layout.tsx          # Shared layout for /dashboard, etc.
│
├── layout.tsx              # Root layout (wraps everything)
└── page.tsx                # Home page (/)
```

#### Special Files

| File | Purpose | Example |
|------|---------|---------|
| `page.tsx` | Route page | Product list page |
| `layout.tsx` | Shared layout | Admin sidebar |
| `loading.tsx` | Loading state | Skeleton UI |
| `error.tsx` | Error boundary | Error message |
| `not-found.tsx` | 404 page | Custom 404 |

#### Example: Dynamic Route

```
app/
└── products/
    ├── page.tsx           # /products (list)
    └── [id]/
        └── page.tsx       # /products/123 (detail)
```

---

### `src/features/` - Feature Modules

> **Purpose:** Self-contained modules for each major feature

#### Feature Structure

Every feature follows this pattern:

```
features/[feature-name]/
├── components/          # UI components
│   ├── FeatureTable.tsx
│   ├── FeatureForm.tsx
│   └── FeatureCard.tsx
│
├── hooks/              # Custom hooks
│   ├── useFeature.ts
│   └── useFeatureForm.ts
│
├── api/                # API calls
│   └── featureApi.ts
│
├── types/              # TypeScript types
│   └── feature.types.ts
│
├── config/             # Configuration
│   ├── tableConfig.ts
│   └── formConfig.ts
│
├── utils/              # Utilities
│   └── featureUtils.ts
│
└── index.ts            # Public exports
```

#### Example: Products Feature

```typescript
// features/products/index.ts
export { ProductsTable } from './components/ProductsTable';
export { ProductForm } from './components/ProductForm';
export { useProducts } from './hooks/useProducts';
export type { Product } from './types/product.types';
```

**Usage:**
```typescript
// In a page component
import { ProductsTable, useProducts } from '@/features/products';
```

---

### `src/components/` - Shared Components

> **Purpose:** Reusable components used across multiple features

#### Organization

```
components/
├── ui/              # Base UI components (Shadcn)
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
│
├── forms/           # Form-related components
│   ├── FormBuilder.tsx
│   ├── FormField.tsx
│   └── FormInput.tsx
│
├── tables/          # Table components
│   ├── DataTable.tsx
│   └── DataTablePagination.tsx
│
├── layout/          # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
│
└── guards/          # Permission guards
    ├── PermissionGuard.tsx
    └── RoleGuard.tsx
```

#### When to Use

| Use `components/` | Use `features/[name]/components/` |
|-------------------|-----------------------------------|
| Used by 3+ features | Used by 1 feature only |
| Generic/reusable | Feature-specific logic |
| No business logic | Contains business logic |

---

### `src/hooks/` - Custom Hooks

> **Purpose:** Reusable React hooks used across features

#### Examples

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  // Authentication logic
  return { user, login, logout };
};

// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number) => {
  // Debounce logic
  return debouncedValue;
};

// hooks/useApi.ts
export const useApi = () => {
  // API call wrapper
  return { get, post, put, delete };
};
```

---

### `src/lib/` - Utilities & Config

> **Purpose:** Global utilities, configurations, and setup

#### Structure

```
lib/
├── api/
│   ├── client.ts          # Axios/Fetch setup
│   ├── endpoints.ts       # API URLs
│   └── interceptors.ts    # Request/response interceptors
│
├── auth/
│   ├── session.ts         # Session management
│   └── permissions.ts     # Permission checks
│
├── utils/
│   ├── cn.ts             # Class name utility
│   ├── format.ts         # Formatters (date, currency)
│   └── string.ts         # String helpers
│
├── constants/
│   ├── routes.ts         # Route constants
│   ├── permissions.ts    # Permission constants
│   └── config.ts         # App config
│
└── providers/
    ├── QueryProvider.tsx  # React Query
    └── ThemeProvider.tsx  # Theme
```

#### Example: API Client

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 💻 Code Examples

### Example 1: Complete Feature

```typescript
// features/products/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// features/products/api/productsApi.ts
import { apiClient } from '@/lib/api/client';
import type { Product } from '../types/product.types';

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id'>) => apiClient.post<Product>('/products', data),
};

// features/products/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });
};

// features/products/components/ProductsTable.tsx
import { useProducts } from '../hooks/useProducts';
import { DataTable } from '@/components/tables/DataTable';

export const ProductsTable = () => {
  const { data, isLoading } = useProducts();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <DataTable data={data} columns={columns} />;
};

// features/products/index.ts
export { ProductsTable } from './components/ProductsTable';
export { useProducts } from './hooks/useProducts';
export type { Product } from './types/product.types';
```

### Example 2: Page Using Feature

```typescript
// app/(app)/products/page.tsx
import { ProductsTable } from '@/features/products';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <ProductsTable />
    </div>
  );
}
```

### Example 3: Permission Guard

```typescript
// components/guards/PermissionGuard.tsx
import { usePermissions } from '@/hooks/usePermissions';

interface Props {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({ permission, children, fallback = null }: Props) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Usage in a page
<PermissionGuard permission="products.delete">
  <DeleteButton />
</PermissionGuard>
```

---

## 🛠️ Implementation Guide

### Step 1: Initialize Project

```bash
# Create Next.js app
npx create-next-app@latest my-app --typescript --tailwind --app

# Navigate to project
cd my-app

# Create folder structure
mkdir -p src/{features,components/{ui,forms,tables,layout,guards},hooks,lib/{api,auth,utils,constants,providers},types,styles,i18n/locales/{en,ar}}
```

### Step 2: Configure TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### Step 3: Create Your First Feature

```bash
# Create products feature
mkdir -p src/features/products/{components,hooks,api,types,config}

# Create files
touch src/features/products/{index.ts,types/product.types.ts,api/productsApi.ts,hooks/useProducts.ts,components/ProductsTable.tsx}
```

### Step 4: Add Shared Components

```bash
# Install Shadcn UI
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
```

### Step 5: Set Up API Client

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add interceptors
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ✨ Best Practices

### 1. Feature Independence

❌ **Don't:** Import from other features
```typescript
// features/orders/components/OrderForm.tsx
import { ProductSelect } from '@/features/products/components/ProductSelect'; // ❌
```

✅ **Do:** Move shared components to `components/`
```typescript
// components/selects/ProductSelect.tsx
export const ProductSelect = () => { ... };

// features/orders/components/OrderForm.tsx
import { ProductSelect } from '@/components/selects/ProductSelect'; // ✅
```

### 2. Barrel Exports

✅ **Always export from `index.ts`**
```typescript
// features/products/index.ts
export { ProductsTable } from './components/ProductsTable';
export { ProductForm } from './components/ProductForm';
export { useProducts } from './hooks/useProducts';
export type { Product } from './types/product.types';

// Usage
import { ProductsTable, useProducts, type Product } from '@/features/products';
```

### 3. Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ProductsTable.tsx` |
| Hooks | camelCase with `use` prefix | `useProducts.ts` |
| Types | PascalCase | `Product` |
| Files with types | camelCase with `.types.ts` | `product.types.ts` |
| Utils | camelCase | `formatPrice.ts` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |

### 4. File Organization

✅ **Group by feature, not by type**
```
✅ Good
features/
├── products/
│   ├── components/
│   ├── hooks/
│   └── types/
└── orders/
    ├── components/
    ├── hooks/
    └── types/

❌ Bad
src/
├── components/
│   ├── ProductsTable.tsx
│   └── OrdersTable.tsx
├── hooks/
│   ├── useProducts.ts
│   └── useOrders.ts
```

### 5. TypeScript Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

---

## 📚 Resources

### Official Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)

### Architecture Patterns
- [Feature-Sliced Design](https://feature-sliced.design)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

### Tools & Libraries
- [Shadcn UI](https://ui.shadcn.com) - Component library
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Zod](https://zod.dev) - Schema validation
- [React Hook Form](https://react-hook-form.com) - Form management

---

## 📝 Summary

### Quick Reference

```
✅ DO:
- Keep features self-contained
- Use barrel exports (index.ts)
- Follow naming conventions
- Colocate related code
- Use TypeScript strictly

❌ DON'T:
- Import between features
- Mix feature and global code
- Use inconsistent naming
- Create deep nesting (max 3-4 levels)
- Skip type definitions
```

### Folder Cheat Sheet

| Folder | Purpose | When to Use |
|--------|---------|-------------|
| `app/` | Routes & pages | Creating new pages/routes |
| `features/` | Feature modules | Building isolated features |
| `components/` | Shared UI | Reusable components (3+ uses) |
| `hooks/` | Custom hooks | Reusable logic |
| `lib/` | Utilities | Helper functions, configs |
| `types/` | Global types | Shared TypeScript types |

---

**Happy coding! 🚀**
