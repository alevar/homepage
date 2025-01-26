import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/Post';
import { createCookingBlogLoader } from '../../utils/contentLoader';

import './CookingBlog.css'

// CookingBlogList Component
const CookingBlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cookingBlogLoader = createCookingBlogLoader();
    const loadedPosts = cookingBlogLoader.getPublishedContent();
    setPosts(loadedPosts);
    setIsLoaded(true);
  }, []);

  const filteredPosts = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      post.author?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-8">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 recipe-header">
              Delicious Recipes
            </h1>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search recipes, ingredients, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input w-full max-w-2xl pl-10 pr-4 py-3 border border-gray-200 
                          rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 
                          focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-10">
            {filteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className={`recipe-card bg-white rounded-2xl shadow-sm p-6 ${isLoaded ? '' : 'skeleton'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <article className="space-y-4">
                  <Link
                    to={`/cooking/${post.id}`}
                    className="group block"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-orange-600 
                                 transition duration-200">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <time>{formatDate(post.date)}</time>
                    {post.author && (
                      <>
                        <span>•</span>
                        <span>{post.author}</span>
                      </>
                    )}
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span 
                          key={tag}
                          className="recipe-tag px-3 py-1 text-sm bg-orange-50 text-orange-700 
                                   rounded-full border border-orange-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-600 leading-relaxed">{post.summary}</p>
                  
                  <Link
                    to={`/cooking/${post.id}`}
                    className="back-button inline-flex items-center text-orange-600 
                             hover:text-orange-700 font-medium"
                  >
                    Read full recipe →
                  </Link>
                </article>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse all recipes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingBlogList;