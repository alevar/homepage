import React from 'react';
import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Projects from './components/Projects/Projects';
import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';
import CookingBlogList from './components/CookingBlog/CookingBlogList';
import CookingBlogPost from './components/CookingBlog/CookingBlogPost';

// Define a layout that includes the Footer
const Layout: React.FC = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

// Define your routes with the Layout
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/projects', element: <Projects /> },
      { path: '/blog', element: <BlogList /> },
      { path: '/blog/:postId', element: <BlogPost /> },
      { path: '/cooking', element: <CookingBlogList /> },
      { path: '/cooking/:postId', element: <CookingBlogPost /> }
    ]
  }
];

// Create the router using HashRouter instead of BrowserRouter
const router = createHashRouter(routes);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;