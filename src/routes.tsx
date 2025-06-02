import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/Layout';
import Home from './pages/home';
import NotFound from './pages/not-found';
import SearchResults from './pages/search-results';
import About from './pages/about';
import Login from './pages/login';
import Signup from './pages/signup';
import PrivateRoute from './pages/private-route';
import Dashboard from './pages/dashboard';

export const router = createBrowserRouter([
    {
        path: '',
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/search',
                element: <SearchResults />
            },
            {
                path: '/about',
                element: <About />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '*',
                element: <NotFound />
            },
            {
                path: '',
                element: <PrivateRoute />,
                children: [
                    {
                        path: '/dashboard',
                        element: <Dashboard />
                    }
                ]
            },
        ]
    }
])