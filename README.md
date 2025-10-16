# 🎓 Fluentify Frontend - Complete Documentation

> A modern, scalable React application for language learning with React Query, modular architecture, and reusable components.

---

## 📋 Table of Contents
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Components](#-components)
- [React Query Hooks](#-react-query-hooks)
- [Why Index.js Files?](#-why-indexjs-files-barrel-exports)
- [Development Guide](#-development-guide)
- [Best Practices](#-best-practices)

---

## 🚀 Quick Start

### **Installation**
```bash
npm install
```

### **Development**
```bash
npm run dev
```

### **Build**
```bash
npm run build
```

### **Preview Build**
```bash
npm preview
```

---

## 📂 Project Structure

```
src/
├── App/
│   ├── App.jsx              # Main app component with routing
│   └── index.css            # Global styles
├── api/
│   ├── auth.js              # Authentication API calls
│   ├── courses.js           # Course-related API calls
│   └── preferences.js       # Learner preferences API calls
├── components/              # Shared components
│   ├── Button.jsx
│   ├── ErrorMessage.jsx
│   ├── Input.jsx
│   ├── LoadingSpinner.jsx
│   ├── PageHeader.jsx
│   └── index.js             # Barrel export
├── hooks/                   # React Query hooks
│   ├── useAuth.js           # Auth hooks
│   ├── useCourses.js        # Course hooks
│   └── usePreferences.js    # Preference hooks
├── modules/                 # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── PasswordInput.jsx
│   │   │   └── index.js
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── index.js
│   ├── learner/
│   │   ├── components/
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseGenerationForm.jsx
│   │   │   ├── CustomDropdown.jsx
│   │   │   ├── LessonCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── UnitCard.jsx
│   │   │   └── index.js
│   │   ├── CoursePage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LearnerPreferences.jsx
│   │   ├── LessonPage.jsx
│   │   └── index.js
│   └── admin/
│       ├── AdminDashboard.jsx
│       └── index.js
├── utils/
│   ├── constants.js         # Centralized constants
│   └── courseHelpers.js     # Helper functions
└── main.jsx                 # App entry point
```

---

## 🏗️ Architecture

### **1. Modular Organization**
The app is organized by features (auth, learner, admin) rather than by file type. This makes the codebase:
- ✅ **Scalable** - Easy to add new features
- ✅ **Maintainable** - Related code stays together
- ✅ **Clear** - Obvious where to find things

### **2. React Query for Data Management**
All server data is managed through React Query:
- ✅ **Automatic caching** - No repeated API calls
- ✅ **Background refetching** - Data stays fresh
- ✅ **Loading & error states** - Built-in handling
- ✅ **Optimistic updates** - Instant UI feedback

### **3. Separation of Concerns**
```
UI Components (JSX) 
    ↓
React Query Hooks (data fetching logic)
    ↓
API Functions (network requests)
    ↓
Backend
```

---

## 🧩 Components

### **Shared Components** (`src/components/`)
Used across the entire application.

#### **Button**
```jsx
import { Button } from '../components';

<Button 
  variant="primary"      // primary|secondary|danger|ghost|success
  size="md"             // sm|md|lg
  loading={isLoading}
  icon={<Icon />}
  onClick={handleClick}
>
  Click Me
</Button>
```

#### **Input**
```jsx
import { Input } from '../components';

<Input
  label="Email"
  type="email"
  icon={<Mail />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errorMessage}
/>
```

#### **LoadingSpinner**
```jsx
import { LoadingSpinner } from '../components';

<LoadingSpinner size="md" />
// or full screen
<LoadingSpinner fullScreen text="Loading..." />
```

#### **PageHeader**
```jsx
import { PageHeader } from '../components';

<PageHeader
  title="Page Title"
  subtitle="Optional subtitle"
  showBack
  actions={<Button>Action</Button>}
/>
```

#### **ErrorMessage**
```jsx
import { ErrorMessage } from '../components';

<ErrorMessage 
  message={error} 
  onDismiss={() => setError('')} 
/>
```

### **Module-Specific Components**
Components specific to a feature module.

**Learner Components** (`src/modules/learner/components/`):
- `CourseCard` - Display course information
- `CourseGenerationForm` - Form to generate new courses
- `CustomDropdown` - Custom dropdown with flags
- `LessonCard` - Display lesson information
- `StatCard` - Display statistics
- `UnitCard` - Display unit information

**Auth Components** (`src/modules/auth/components/`):
- `PasswordInput` - Password input with show/hide toggle

---

## 🎣 React Query Hooks

### **Authentication Hooks** (`src/hooks/useAuth.js`)

```jsx
import { useLogin, useSignup, useLogout, useUserProfile } from '../hooks/useAuth';

// Login
const loginMutation = useLogin();
loginMutation.mutate({ role: 'learner', email, password });

// Signup
const signupMutation = useSignup();
signupMutation.mutate({ role: 'learner', name, email, password });

// Logout
const logoutMutation = useLogout();
logoutMutation.mutate();

// Get User Profile
const { data: user, isLoading } = useUserProfile();

// Check if authenticated
const isAuthenticated = useIsAuthenticated();
```

### **Course Hooks** (`src/hooks/useCourses.js`)

```jsx
import { 
  useCourses, 
  useGenerateCourse, 
  useCourseDetails,
  useLessonDetails,
  useGenerateExercises,
  useCompleteLesson 
} from '../hooks/useCourses';

// Fetch all courses
const { data: courses, isLoading } = useCourses();

// Generate new course
const generateMutation = useGenerateCourse();
generateMutation.mutate({ language: 'Spanish', expectedDuration: '3 months' });

// Get course details
const { data: course } = useCourseDetails(courseId);

// Get lesson details
const { data: lesson } = useLessonDetails({ courseId, unitId, lessonId });

// Generate exercises
const exercisesMutation = useGenerateExercises();
exercisesMutation.mutate({ courseId, unitId, lessonId });

// Complete lesson
const completeMutation = useCompleteLesson();
completeMutation.mutate({ courseId, unitId, lessonId, score: 100 });
```

### **Preference Hooks** (`src/hooks/usePreferences.js`)

```jsx
import { useLearnerPreferences, useSaveLearnerPreferences } from '../hooks/usePreferences';

// Fetch preferences
const { data: preferences } = useLearnerPreferences();

// Save preferences
const saveMutation = useSaveLearnerPreferences();
saveMutation.mutate({ language: 'Spanish', expected_duration: '3 months', expertise: 'beginner' });
```

---

## 📦 Why Index.js Files? (Barrel Exports)

You'll see `index.js` files in many folders. These are called **barrel exports** and they make imports cleaner.

### **Without Barrel Exports:**
```jsx
// ❌ Messy imports
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
```

### **With Barrel Exports:**
```jsx
// ✅ Clean imports
import { Button, Input, LoadingSpinner, ErrorMessage } from '../components';
```

### **How It Works:**

**`src/components/index.js`:**
```javascript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorMessage } from './ErrorMessage';
export { default as PageHeader } from './PageHeader';
```

Now you can import multiple components from one location!

### **Benefits:**
- ✅ **Cleaner imports** - One import line instead of many
- ✅ **Easier refactoring** - Change file structure without updating all imports
- ✅ **Better organization** - Clear public API for each module

---

## 🛠️ Development Guide

### **Adding a New Page**

1. **Create the page file in the appropriate module:**
   ```jsx
   // src/modules/learner/NewPage.jsx
   import React from 'react';
   import { PageHeader } from '../../components';
   
   const NewPage = () => {
     return (
       <div>
         <PageHeader title="New Page" />
         {/* Your content */}
       </div>
     );
   };
   
   export default NewPage;
   ```

2. **Export it from the module index:**
   ```javascript
   // src/modules/learner/index.js
   export { default as NewPage } from './NewPage';
   ```

3. **Add route in App.jsx:**
   ```jsx
   import { NewPage } from '../modules/learner';
   
   <Route path="/new-page" element={<NewPage />} />
   ```

### **Adding a New Component**

1. **Create the component:**
   ```jsx
   // src/components/Card.jsx
   const Card = ({ title, children }) => {
     return (
       <div className="bg-white rounded-lg shadow p-4">
         <h3>{title}</h3>
         {children}
       </div>
     );
   };
   
   export default Card;
   ```

2. **Add to barrel export:**
   ```javascript
   // src/components/index.js
   export { default as Card } from './Card';
   ```

3. **Use it anywhere:**
   ```jsx
   import { Card } from '../components';
   
   <Card title="My Card">Content here</Card>
   ```

### **Adding a New API Endpoint**

1. **Add API function:**
   ```javascript
   // src/api/courses.js
   export const deleteCourse = async (courseId) => {
     const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
       method: 'DELETE',
       headers: getAuthHeader()
     });
     return handleResponse(response);
   };
   ```

2. **Create React Query hook:**
   ```javascript
   // src/hooks/useCourses.js
   export const useDeleteCourse = () => {
     const queryClient = useQueryClient();
     
     return useMutation({
       mutationFn: deleteCourse,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['courses'] });
       }
     });
   };
   ```

3. **Use in component:**
   ```jsx
   const deleteMutation = useDeleteCourse();
   
   deleteMutation.mutate(courseId);
   ```

### **Adding Constants**

```javascript
// src/utils/constants.js
export const NEW_CONSTANT = {
  OPTION_1: 'value1',
  OPTION_2: 'value2'
};
```

Then use:
```jsx
import { NEW_CONSTANT } from '../utils/constants';
```

---

## ✨ Best Practices

### **1. Always Use React Query for Server Data**
```jsx
// ❌ DON'T do this
const [data, setData] = useState(null);
useEffect(() => {
  fetch('/api/data').then(r => r.json()).then(setData);
}, []);

// ✅ DO this
const { data } = useQuery({ queryKey: ['data'], queryFn: fetchData });
```

### **2. Use Shared Components**
```jsx
// ❌ DON'T duplicate UI
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click Me
</button>

// ✅ DO use shared components
<Button variant="primary">Click Me</Button>
```

### **3. Centralize Constants**
```jsx
// ❌ DON'T hardcode values
const languages = ['Spanish', 'French', 'German'];

// ✅ DO use constants
import { LANGUAGES } from '../utils/constants';
```

### **4. Handle Loading & Error States**
```jsx
const { data, isLoading, error } = useQuery(...);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error.message} />;

return <div>{/* Success state */}</div>;
```

### **5. Use Barrel Exports**
```jsx
// ❌ DON'T
import Button from './components/Button';
import Input from './components/Input';

// ✅ DO
import { Button, Input } from './components';
```

---

## 🎯 Code Quality Checklist

Before submitting code, ensure:

- [ ] No duplicate components
- [ ] No duplicate API calls
- [ ] No hardcoded constants
- [ ] All constants in `utils/constants.js`
- [ ] Using React Query for data fetching
- [ ] Using shared components
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Barrel exports used
- [ ] No console.log statements
- [ ] Code is formatted

---

## 🔧 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack Query (React Query)** - Data fetching
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Validator** - Form validation
- **JWT Decode** - Token parsing
- **React Country Flag** - Flag components

---

## 📊 Project Stats

- **Total Components:** 17
- **Shared Components:** 5
- **Module Components:** 7
- **Pages:** 8
- **React Query Hooks:** 13
- **API Functions:** 11
- **Lines of Code:** ~2,500

---

## 🎓 Learning Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)

---

## ✅ What's Different from Standard React?

### **Standard React:**
```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/data')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

### **Our React (with React Query):**
```jsx
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData
});
```

**Benefits:**
- ✅ Less code
- ✅ Automatic caching
- ✅ Background refetching
- ✅ No useEffect needed
- ✅ Better performance

---

## 🚀 You're Ready!

Your Fluentify frontend is production-ready with:
- ✅ Modern architecture
- ✅ Reusable components
- ✅ Clean code
- ✅ Best practices
- ✅ Scalable structure

**Happy coding! 🎉**
