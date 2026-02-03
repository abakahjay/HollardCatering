/* eslint-disable react-hooks/exhaustive-deps */
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Authpage } from "./pages/Authpage/Authpage.jsx";
import PageLayout from "./Layouts/PageLayouts/PageLayout.jsx";
import { useEffect, useState } from "react";
import useAuthStore from "./store/useAuthStore.js";
import API from "./utils/api";
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import MessagesPage from './pages/Messages/Messages';
import useLogout from "./hooks/useLogout.js";
import { Flex, Spinner } from "@chakra-ui/react";
import useShowToast from "./hooks/useShowToast.js";
import Homepage from "./routes/homePage/Homepage.jsx"
import Dashboard from "./routes/dashboardPage/Dashboard.jsx";
import FindPage from "./routes/findPage/FindPage.jsx";
import FeedbackPage from "./routes/FeedbackPage/FeedbackPage";
import DataPage from "./routes/DataPage/DataPage";
import AddMealPage from "./routes/addMealPage/AddMealPage.jsx";
import OrderWeeklyPage from "./routes/orderWeeklyPage/OrderWeeklyPage.jsx";


export default function App() {
    const showToast = useShowToast()
    const { logout } = useLogout()
    const authUser = useAuthStore(state => state.user)
    const setAuthUser = useAuthStore((state) => state.setAuthUser)
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    // console.log(user?.token)
    // Fetch the authenticated user on initial load
    useEffect(() => {
        const controller = new AbortController();
        const fetchAuthUser = async () => {
            if (user) {
                try {
                    const { data } = await API.get("/api/v1/auth/dashboard", {
                        signal: controller.signal,
                        headers: { Authorization: `Bearer ${user?.token}` }
                    });
                    setAuthUser(data.user);
                    localStorage.setItem("user-info", JSON.stringify({ user: data.user, token: user.token }));
                } catch (error) {
                    console.log(error)
                    showToast("Loading", '', "loading", 1000);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchAuthUser();

        return () => {//This is a cleanup function
            controller.abort();
        }
    }, [user, setAuthUser]);


    const handleLogout = (userId) => {
        logout(userId)
    };

    if (loading) return <PageLayoutSpinner />








    const router = createBrowserRouter([
        {
            path: '/dashboard',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <Dashboard authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" />}
                </PageLayout>
            ),
        },
        {
            path: '/auth',
            element: (
                <>
                    <PageLayout>
                        {!authUser ? <Authpage onAuth={setAuthUser} /> : <Navigate to="/" />}
                    </PageLayout>

                </>
            ),
        },
        {
            path: '/:username',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <ProfilePage authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" onLogout={handleLogout} />}
                </PageLayout>
            ),
        },
        {
            path: '/history',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <MessagesPage authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" onLogout={handleLogout} />}
                </PageLayout>
            ),
        },
        {
            path: '/feedback',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <FeedbackPage authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" onLogout={handleLogout} />}
                </PageLayout>
            ),
        },
        {
            path: '/data',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <DataPage authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" onLogout={handleLogout} />}
                </PageLayout>
            ),
        },
        {
            path: '/findmeal',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <FindPage authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" onLogout={handleLogout} />}
                </PageLayout>
            ),
        },
        {
            path: '/',
            element: (
                <Homepage authUser={authUser} onLogout={handleLogout} />
            ),
        },
        {
            path: '/add-meal',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <AddMealPage authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" />}
                </PageLayout>
            ),
        },
        {
            path: '/order-weekly',
            element: (
                <PageLayout authUser={authUser} onLogout={handleLogout}>
                    {authUser ? <OrderWeeklyPage authUser={authUser} onLogout={handleLogout} /> : <Navigate to="/auth" />}
                </PageLayout>
            ),
        },

    ]);





    return <>
        {/* This is for Creating Routes and Pages */}
        <RouterProvider router={router} />
        {/* <ChatApp userId={'67886226f65d5209b0836659'} recipientId={'67886bde4f9166876c734a8c'}/> */}
    </>
}


const PageLayoutSpinner = () => {
    return (
        <Flex flexDir='column' h='100vh' alignItems='center' justifyContent='center'>
            <Spinner size='xl' />
        </Flex>
    );
};
