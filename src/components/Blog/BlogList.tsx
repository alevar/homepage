import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../types/Post';
import { createBlogLoader } from '../../utils/contentLoader';

const BlogList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const blogLoader = createBlogLoader();
    // Get only published posts, sorted by date
    const loadedPosts = blogLoader.getPublishedContent();
    setPosts(loadedPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.author?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
          <input
            type="text"
            placeholder="Search posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <div key={post.id}>
              <article className="space-y-2">
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-block hover:text-blue-600"
                >
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
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
                        className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-600">{post.summary}</p>
                
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read more →
                </Link>
              </article>
              
              {index < filteredPosts.length - 1 && (
                <hr className="mt-8 border-gray-200" />
              )}
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No posts found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;