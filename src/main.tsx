import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Moviedetail from './Moviedetail.tsx';
import MovieDetail2 from './moviedetal2.tsx';
import Signup from "./components/signup.js";
import { AuthProvider } from './authContext/authcontext.tsx';
import Login from './components/login.tsx';
import ProtectedRoutes from './authContext/ProtectedRoutes.tsx';
import About from './components/About.tsx';
import { LLMsProvider } from './LLMsContext/LLmscontext.tsx';

const queryClient = new QueryClient();
const router = createHashRouter([
  {
    path: "/",
    element: <LLMsProvider><AuthProvider>
      <ProtectedRoutes><App /></ProtectedRoutes></AuthProvider></LLMsProvider>
    ,
  },
  {
    path: "/:id",
    element: <LLMsProvider><AuthProvider>
      <ProtectedRoutes><Moviedetail /></ProtectedRoutes></AuthProvider></LLMsProvider>
    ,
  },
  {
    path: "/top-detail",
    element: <LLMsProvider><AuthProvider>
      <ProtectedRoutes><MovieDetail2 /></ProtectedRoutes></AuthProvider></LLMsProvider>
    ,
  },
  {
    path: "/signup",
    element: <AuthProvider><Signup /></AuthProvider>
    ,
  },
  {
    path: "/login",
    element: <AuthProvider><Login /></AuthProvider>
    ,
  },
  {
    path: "/about",
    element: <AuthProvider><About /></AuthProvider>
    ,
  },
])
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)

