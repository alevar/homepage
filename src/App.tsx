import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Projects from './components/Projects/Projects';
import BlogList from './components/Blog/BlogList';
import BlogPost from './components/Blog/BlogPost';
import CookingBlogList from './components/CookingBlog/CookingBlogList';
import CookingBlogPost from './components/CookingBlog/CookingBlogPost';
import Visualizations from './components/Visualizations/Visualizations';

const Layout: React.FC = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/projects', element: <Projects /> },
      { path: '/visualizations', element: <Visualizations /> },
      { path: '/blog', element: <BlogList /> },
      { path: '/blog/:postId', element: <BlogPost /> },
      { path: '/cooking', element: <CookingBlogList /> },
      { path: '/cooking/:postId', element: <CookingBlogPost /> }
    ]
  }
], {
  basename: '/homepage'
});

const App: React.FC = () => <RouterProvider router={router} />;

export default App;