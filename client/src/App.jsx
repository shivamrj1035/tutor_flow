import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import HeroSection from './pages/learner/HeroSection'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Courses from './pages/learner/Courses'
import MyLearning from './pages/learner/MyLearning'
import Profile from "@/pages/learner/Profile.jsx";
import Sidebar from './pages/admin/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import CourseTable from './pages/admin/course/CourseTable'
import AddCourse from './pages/admin/course/AddCourse'
import CourseTab from './pages/admin/course/CourseTab'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/learner/CourseDetail'
import CourseProgress from './pages/learner/CourseProgress'
import SearchPage from './pages/learner/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes'
import PurchasedCourseProtection from './components/PurchasedCourseProtection'
import { ThemeProvider } from './components/ThemeProvider'

function App() {

    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                {
                    path: "/",
                    element: (
                        <>
                            <HeroSection />
                            <Courses />
                        </>
                    )
                },
                {
                    path: "login",
                    element: <AuthenticatedUser><Login /></AuthenticatedUser>,
                },
                {
                    path: "my-learning",
                    element: <ProtectedRoute><MyLearning  /></ProtectedRoute>,
                },
                {
                    path: "profile",
                    element: <ProtectedRoute><Profile /></ProtectedRoute>,
                },
                {
                    path: "course/search",
                    element: <ProtectedRoute><SearchPage /></ProtectedRoute>,
                },
                {
                    path: "course-detail/:courseId",
                    element: <ProtectedRoute><CourseDetail /></ProtectedRoute>,
                },
                {
                    path: "course-progress/:courseId",
                    element: <ProtectedRoute>
                        <PurchasedCourseProtection>


                            <CourseProgress />
                        </PurchasedCourseProtection>

                    </ProtectedRoute>,
                },
                {
                    path: "admin",
                    element: <AdminRoute><Sidebar /></AdminRoute>,
                    children: [
                        {
                            path: "dashboard",
                            element: <Dashboard />
                        },
                        {
                            path: "course",
                            element: <CourseTable />,
                            children: [

                            ]
                        },
                        {
                            path: "course/create",
                            element: <AddCourse />
                        },
                        {
                            path: "course/:courseId",
                            element: <EditCourse />
                        },
                        {
                            path: "course/:courseId/lecture",
                            element: <CreateLecture />
                        },
                        {
                            path: "course/:courseId/lecture/:lectureId",
                            element: <EditLecture />
                        }
                    ]
                },
            ]
        },

    ])
    console.log('API URL:', import.meta.env.VITE_BACKEND_URL);


    return (
        <main>
            <ThemeProvider>

                <RouterProvider router={appRouter} />
            </ThemeProvider>
        </main>
    )
}

export default App
