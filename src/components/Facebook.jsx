import React, { useState } from 'react';
import { ExternalLink, Loader2, Facebook, MessageSquare, Heart, Share2 } from 'lucide-react';

export default function FacebookPostExtractor() {
  const [url, setUrl] = useState('');
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractPostData = async (fbUrl) => {
    setLoading(true);
    setError('');
    
    try {
      const encodedUrl = encodeURIComponent(fbUrl);
      const apiUrl = `https://facebook-scraper-api4.p.rapidapi.com/get_facebook_post_details?link=${encodedUrl}`;
      
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'aef7037091mshd61d057342cdadfp1ebae4jsnacd9667d28ca',
          'x-rapidapi-host': 'facebook-scraper-api4.p.rapidapi.com'
        }
      };
      
      const response = await fetch(apiUrl, options);
      const result = await response.json();
      
      if (result && result.length > 0) {
        const post = result[0];
        
        // Get cover image - prioritize attachments first, then photo_image
        let imageUrl = '';
        
        // Option 1: Get from attachments.all_subattachments.nodes (multiple photos)
        if (post.attachments?.all_subattachments?.nodes?.length > 0) {
          const firstPhoto = post.attachments.all_subattachments.nodes[0];
          imageUrl = firstPhoto.media?.image?.uri || '';
        }
        // Option 2: Get from attachments array (single photo)
        else if (post.attachments && Array.isArray(post.attachments) && post.attachments.length > 0 && post.attachments[0].photo_image) {
          imageUrl = post.attachments[0].photo_image.uri;
        }
        // Option 3: Fallback to values.photo_image
        else if (post.values.photo_image) {
          try {
            const photoData = JSON.parse(post.values.photo_image);
            imageUrl = photoData.uri;
          } catch (e) {
            console.error('Error parsing photo_image:', e);
          }
        }
        
        // Limit text to 200 characters
        const fullText = post.values.text || '';
        const truncatedText = fullText.length > 200 
          ? fullText.substring(0, 200) + '...' 
          : fullText;
        
        setPostData({
          text: truncatedText,
          fullText: fullText,
          image: imageUrl,
          url: fbUrl,
          userName: post.user_details.name,
          userProfilePic: post.user_details.profile_picture_url,
          userProfileUrl: post.user_details.profile_url,
          reactions: post.reactions.total_reaction_count,
          comments: post.details.comments_count,
          shares: post.details.share_count,
          publishTime: post.values.publish_time,
          ocrText: post.values.ocr_text
        });
      } else {
        setError('No data found for this Facebook post URL');
      }
    } catch (err) {
      setError('Failed to extract post data. Please check the URL and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = () => {
    if (url.includes('facebook.com')) {
      extractPostData(url);
    } else {
      setError('Please enter a valid Facebook URL');
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Facebook className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Facebook Post Extractor</h1>
              <p className="text-gray-600">Extract and display Facebook post data</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facebook Post URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.facebook.com/username/posts/..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onKeyPress={(e) => e.key === 'Enter' && handleExtract()}
              />
            </div>
            
            <button
              onClick={handleExtract}
              disabled={loading || !url}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Extracting Post Data...
                </>
              ) : (
                'Extract Post'
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Post Card */}
        {postData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* User Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img 
                  src={postData.userProfilePic} 
                  alt={postData.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <a 
                    href={postData.userProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gray-900 hover:text-blue-600 transition"
                  >
                    {postData.userName}
                  </a>
                  <p className="text-sm text-gray-500">{formatDate(postData.publishTime)}</p>
                </div>
                <a
                  href={postData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-6">
              {postData.text && (
                <p className="text-gray-800 text-lg mb-4 whitespace-pre-wrap">
                  {postData.text}
                </p>
              )}
              
              {postData.image && (
                <img 
                  src={postData.image}
                  alt="Post content"
                  className="w-full rounded-xl shadow-md"
                />
              )}
            </div>

            {/* Engagement Stats */}
            {/* <div className="px-6 pb-6">
              <div className="flex items-center justify-around py-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart size={20} className="text-red-500" />
                  <span className="font-semibold">{formatNumber(postData.reactions)}</span>
                  <span className="text-sm">Reactions</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageSquare size={20} className="text-blue-500" />
                  <span className="font-semibold">{formatNumber(postData.comments)}</span>
                  <span className="text-sm">Comments</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Share2 size={20} className="text-green-500" />
                  <span className="font-semibold">{formatNumber(postData.shares)}</span>
                  <span className="text-sm">Shares</span>
                </div>
              </div>
            </div> */}

            {/* Raw Data Section (Collapsible) */}
            {/* <details className="border-t border-gray-200">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 transition">
                View Raw JSON Data
              </summary>
              <div className="px-6 pb-6">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-xs">
                  {JSON.stringify(postData, null, 2)}
                </pre>
              </div>
            </details> */}
          </div>
        )}

        {/* Sample URL */}
        {!postData && !loading && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Try a sample URL:</h3>
            <button
              onClick={() => {
                setUrl('https://www.facebook.com/fttmph/posts/pfbid02D8YFQyRDJMqPZYzQyh4pCEHr127FtQAGPh4irppcCM4V99tUwcXBK9pKHA2taRRNl');
              }}
              className="text-sm text-blue-700 hover:text-blue-900 underline"
            >
              Click to load sample Facebook post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}