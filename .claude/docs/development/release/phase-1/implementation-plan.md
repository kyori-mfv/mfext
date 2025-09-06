# 🎯 Phase 1: Next.js App Router Implementation Plan

## 🎨 **Goal: UI Foundation with Next.js App Router Compatibility**

Transform MFExt from Pages Router to Next.js 13+ App Router architecture for production credibility and developer adoption.

## 📋 **Task Overview (9 Tasks Total)**

Each task follows: **Implementation → Playground Demo → Validation**

---

## **🏗️ Foundation Tasks (1-5)**

### **Task 1: Type System**
**Purpose**: Create TypeScript foundation for App Router architecture

- **Implementation**: 
  - Define `AppRouteSegment`, `AppRoute`, `AppRoutesManifest` interfaces
  - Update existing types to support App Router concepts
  - File: `packages/core/src/types/index.ts`

- **Playground Demo**: 
  - Create basic `apps/playground/src/app/page.tsx`
  - Demonstrate proper TypeScript typing works

- **Validation**: 
  - TypeScript compilation succeeds
  - Types are usable and provide proper IntelliSense
  - No breaking changes to existing code

### **Task 2: App Router Discovery**
**Purpose**: Scan file system to discover App Router structure

- **Implementation**:
  - Build file scanner for `src/app/` directory
  - Discover `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
  - File: `packages/core/bin/commands/discover.js`

- **Playground Demo**:
  - Create sample app/ structure in playground
  - Run discovery, show output of found files
  - Demonstrate glob patterns work correctly

- **Validation**:
  - All App Router files discovered correctly
  - Directory traversal works for nested routes
  - Discovery output matches expected structure

### **Task 3: Route Resolution**
**Purpose**: Convert discovered files into routes with layout chains

- **Implementation**:
  - Algorithm to build route tree from file paths
  - Resolve layout hierarchy for each route
  - Generate App Router manifest
  - File: `packages/core/src/router/app-router.ts`

- **Playground Demo**:
  - Generate routes.json from playground app/ structure
  - Show route-to-layout mappings
  - Display layout chain resolution

- **Validation**:
  - Routes generated correctly from file structure
  - Layout chains resolved in proper order
  - Manifest matches Next.js App Router behavior

### **Task 4: Layout Rendering**
**Purpose**: Render nested layouts around pages

- **Implementation**:
  - Layout nesting engine with recursive rendering
  - Update MainApp to support App Router
  - Layout component wrapper system
  - File: `packages/core/src/app/index.tsx`

- **Playground Demo**:
  - Create root layout (`app/layout.tsx`)
  - Create dashboard layout (`app/dashboard/layout.tsx`) 
  - Demonstrate nested rendering: Root → Dashboard → Page

- **Validation**:
  - Layouts render in correct hierarchy
  - Page content appears inside nested layouts
  - No rendering errors or infinite loops

### **Task 5: Build System**
**Purpose**: Update webpack configs to support App Router

- **Implementation**:
  - Modify webpack client/SSR/RSC configs
  - Update CLI commands to handle app/ directory
  - Ensure both Pages and App Router work
  - Files: `packages/core/src/build/webpack/*.js`

- **Playground Demo**:
  - Run `mfext build` with App Router structure
  - Run `mfext start` and serve App Router pages
  - Demonstrate both RSC and SSR servers work

- **Validation**:
  - Build completes without errors
  - Servers start and serve pages correctly
  - No regressions in existing functionality

---

## **🚀 Navigation Tasks (6-7)**

### **Task 6: Link Component**
**Purpose**: Client-side navigation without page reloads

- **Implementation**:
  - Next.js compatible `<Link>` component
  - Client-side routing and history management
  - File: `packages/core/src/navigation/Link.tsx`

- **Playground Demo**:
  - Add navigation links between pages
  - Demonstrate page transitions without reload
  - Show URL updates in browser

- **Validation**:
  - Navigation works without page refresh
  - Browser history updates correctly
  - Link component matches Next.js API

### **Task 7: useRouter Hook**
**Purpose**: Programmatic navigation API

- **Implementation**:
  - useRouter hook with Next.js API (`push`, `replace`, `back`)
  - Navigation context and state management
  - File: `packages/core/src/navigation/useRouter.ts`

- **Playground Demo**:
  - Buttons using `router.push('/dashboard')`
  - Back/forward navigation buttons
  - Show programmatic route changes

- **Validation**:
  - All router methods work correctly
  - Navigation state updates properly
  - API matches Next.js useRouter exactly

---

## **🧪 Advanced Features (8-9)**

### **Task 8: Complex Nested Layouts**
**Purpose**: Support for deep layout hierarchies

- **Implementation**:
  - Support 3+ level layout nesting
  - Efficient layout resolution algorithm
  - Memory management for deep trees

- **Playground Demo**:
  - Create Root → Dashboard → Settings layout chain
  - Demonstrate 3-level nesting works
  - Show layout isolation between sections

- **Validation**:
  - Deep nesting renders correctly
  - Performance remains acceptable
  - No layout bleeding between sections

### **Task 9: Layout Persistence**
**Purpose**: Layout state preservation during navigation

- **Implementation**:
  - Layout component state management
  - State preservation during route changes
  - Component lifecycle optimization

- **Playground Demo**:
  - Dashboard sidebar with expanded/collapsed state
  - Navigate between dashboard pages
  - Show sidebar state persists

- **Validation**:
  - Layout state maintained across navigation
  - Component instances preserved correctly
  - No unwanted re-renders or state loss

---

## **📁 Expected File Structure**

### **After Task 4 (Playground Structure)**:
```
apps/playground/src/
├── pages/                  ← Keep for compatibility
│   ├── index.tsx
│   └── dashboard/
│       └── index.tsx
└── app/                    ← New App Router
    ├── layout.tsx          ← Root layout
    ├── page.tsx            ← Home page (/)
    └── dashboard/
        ├── layout.tsx      ← Dashboard layout  
        └── page.tsx        ← Dashboard page (/dashboard)
```

### **After Task 8 (Complex Nesting)**:
```
apps/playground/src/app/
├── layout.tsx              ← Level 1: Root
├── page.tsx                
└── dashboard/
    ├── layout.tsx          ← Level 2: Dashboard
    ├── page.tsx
    └── settings/
        ├── layout.tsx      ← Level 3: Settings
        └── page.tsx        ← /dashboard/settings
```

---

## **✅ Success Criteria**

**After Phase 1 Completion:**

🎯 **Next.js App Router Compatibility**
- ✅ Identical file structure to Next.js 13+ App Router
- ✅ Same component APIs (`Link`, `useRouter`)
- ✅ Nested layouts work exactly like Next.js

🎯 **Production Ready**
- ✅ Zero learning curve for Next.js developers
- ✅ Can copy/paste Next.js App Router code
- ✅ Performance matches or exceeds Next.js

🎯 **Framework Integration**
- ✅ RSC and SSR servers render App Router correctly
- ✅ Build system supports both Pages and App Router
- ✅ No breaking changes to existing MFExt features

---

## **🚀 Next Phase**

**Phase 2**: Dynamic routing (`[id].tsx`, `[...slug].tsx`) and enhanced data fetching patterns building on this App Router foundation.
