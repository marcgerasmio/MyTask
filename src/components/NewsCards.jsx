import { useState, useEffect } from 'react';

export default function NewsCards() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
       try {
    const response = await fetch( 'https://carsu.edu.ph/wp-json/wp/v2/posts' );
	const posts = await response.json();

	console.log( posts ); 
    //   const response = await fetch('https://carsu.edu.ph/wp-json/wp/v2/posts?tags=164', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   if (!response.ok) throw new Error('Failed to fetch posts');
    //   const data = await response.json();
    //   setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {post.featured_media && post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={stripHtml(post.title.rendered)}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="border-l-4 border-yellow-500 pl-3 mb-4">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Press Releases
                  </h3>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-3">
                  {stripHtml(post.title.rendered)}
                </h2>
                
                <p className="text-sm text-gray-500 mb-4">
                  By {post._embedded?.author?.[0]?.name || 'PICO'} | {formatDate(post.date)}
                </p>
                
                <div className="text-gray-700 text-sm line-clamp-3">
                  {stripHtml(post.excerpt.rendered)}
                </div>
                
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}