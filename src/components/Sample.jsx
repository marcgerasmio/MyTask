import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function WordPressExtractor() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);

  const fetchAllPosts = async (baseUrl) => {
    let allPosts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await fetch(
          `${baseUrl}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed`
        );
        
        if (!response.ok) {
          if (response.status === 400) {
            hasMore = false;
            break;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.length === 0) {
          hasMore = false;
        } else {
          allPosts = [...allPosts, ...data];
          setStatus(`Fetched ${allPosts.length} posts...`);
          page++;
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        hasMore = false;
      }
    }

    return allPosts;
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const groupPostsByMonth = (posts) => {
    const grouped = {};

    posts.forEach(post => {
      const date = new Date(post.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 0-indexed, so add 1
      const monthName = date.toLocaleString('default', { month: 'long' });
      
      // Create key with sortable format: YYYY-MM-MonthName (e.g., "2017-01-January")
      const sortKey = `${year}-${String(month).padStart(2, '0')}-${monthName}`;
      const displayName = `${monthName}-${year}`;
      
      if (!grouped[sortKey]) {
        grouped[sortKey] = {
          displayName: displayName,
          posts: []
        };
      }

      grouped[sortKey].posts.push({
        Title: stripHtml(post.title.rendered),
        Content: stripHtml(post.content.rendered),
        Date: date.toLocaleDateString(),
        Link: post.link
      });
    });

    return grouped;
  };

  const exportToExcel = (groupedPosts) => {
    const wb = XLSX.utils.book_new();

    // Sort keys chronologically (YYYY-MM format ensures proper sorting)
    const sortedKeys = Object.keys(groupedPosts).sort();

    sortedKeys.forEach(sortKey => {
      const { displayName, posts } = groupedPosts[sortKey];
      const ws = XLSX.utils.json_to_sheet(posts);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 50 }, // Title
        { wch: 100 }, // Content
        { wch: 15 }, // Date
        { wch: 50 }  // Link
      ];

      // Sanitize sheet name (Excel has 31 char limit and doesn't allow certain chars)
      let sheetName = displayName.substring(0, 31).replace(/[:\\/?*\[\]]/g, '-');
      
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, 'wordpress-posts.xlsx');
  };

  const handleExtract = async () => {
    if (!url) {
      setStatus('Please enter a WordPress site URL');
      return;
    }

    setLoading(true);
    setStatus('Fetching posts...');
    setPosts([]);

    try {
      // Clean up URL
      let cleanUrl = url.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      cleanUrl = cleanUrl.replace(/\/$/, ''); // Remove trailing slash

      const fetchedPosts = await fetchAllPosts(cleanUrl);
      
      if (fetchedPosts.length === 0) {
        setStatus('No posts found. Make sure the URL is correct and the site has posts.');
        setLoading(false);
        return;
      }

      setPosts(fetchedPosts);
      setStatus(`Successfully fetched ${fetchedPosts.length} posts!`);
      
      // Group and export
      const grouped = groupPostsByMonth(fetchedPosts);
      exportToExcel(grouped);
      
      setStatus(`Exported ${fetchedPosts.length} posts to Excel file!`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              WordPress Posts Extractor
            </h1>
            <p className="text-gray-600">
              Extract all posts from your WordPress site and organize them by month
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WordPress Site URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter your WordPress site URL (e.g., yoursite.com or https://yoursite.com)
              </p>
            </div>

            <button
              onClick={handleExtract}
              disabled={loading || !url}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Extracting...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Extract & Download
                </>
              )}
            </button>

            {status && (
              <div className={`p-4 rounded-lg ${
                status.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : status.includes('Successfully') || status.includes('Exported')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {status}
              </div>
            )}

            {posts.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Summary:</h3>
                <p className="text-sm text-gray-600">
                  Total posts extracted: <span className="font-bold">{posts.length}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  File downloaded: <span className="font-bold">wordpress-posts.xlsx</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Posts are organized into separate sheets by month and year
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">How it works:</h3>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Connects to your WordPress site via the REST API</li>
              <li>Fetches all published posts automatically</li>
              <li>Groups posts by month and year</li>
              <li>Creates separate Excel sheets for each month</li>
              <li>Includes title, content, date, and link for each post</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}