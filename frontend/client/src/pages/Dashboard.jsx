import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [likeLoading, setLikeLoading] = useState(null);
  
  // New post state
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [postLoading, setPostLoading] = useState(false);
  
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Theme toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  // Apply theme class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    try {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
    const interceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    fetchPosts();
    return () => api.interceptors.request.eject(interceptor);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle new post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    setPostLoading(true);
    try {
      await api.post("/posts", newPost);
      setNewPost({ title: "", content: "" });
      setShowNewPostForm(false);
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleLike = async (postId) => {
    setLikeLoading(postId);
    await api.put(`/posts/${postId}/like`);
    fetchPosts();
    setLikeLoading(null);
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    await api.post(`/posts/${postId}/comments`, { text: commentText[postId] });
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts();
  };

  const handleDeleteComment = async (postId, commentId) => {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
    fetchPosts();
  };

  const handleEditComment = async (postId, commentId) => {
    if (!editText.trim()) return;
    await api.put(`/posts/${postId}/comments/${commentId}`, { text: editText });
    setEditingComment(null);
    setEditText("");
    fetchPosts();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-300
        ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8f5f0]'}`}>
        <div className="text-center">
          <div className={`w-6 h-6 mx-auto mb-4 transition-colors duration-300
            ${isDark ? 'bg-[#c9a84c]' : 'bg-[#8a7a60]'}`}
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", animation: "pulse 1.5s infinite" }} />
          <p className={`text-[11px] tracking-[4px] uppercase font-serif transition-colors duration-300
            ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>Loading</p>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen font-serif transition-colors duration-300
      ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8f5f0]'}`}>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg
          ${isDark 
            ? 'bg-[#1a1a1a] border border-[#c9a84c] text-[#c9a84c]' 
            : 'bg-white border border-[#8a7a60] text-[#5a5040]'}`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Gold top accent line */}
      <div className={`h-[2px] w-full transition-all duration-300
        ${isDark 
          ? 'bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent' 
          : 'bg-gradient-to-r from-transparent via-[#8a7a60] to-transparent'}`} />

      {/* HEADER */}
      <header className={`border-b px-8 py-5 transition-colors duration-300
        ${isDark ? 'border-[#2a2010]' : 'border-[#d0c5b5]'}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`w-7 h-7 border flex items-center justify-center transition-colors duration-300
              ${isDark ? 'border-[#c9a84c]' : 'border-[#8a7a60]'}`}>
              <div className={`w-3 h-3 transition-colors duration-300
                ${isDark ? 'bg-[#c9a84c]' : 'bg-[#8a7a60]'}`}
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
            </div>
            <div>
              <p className={`text-[9px] tracking-[4px] uppercase leading-none mb-1 transition-colors duration-300
                ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
                Member Portal
              </p>
              <h1 className={`text-xl font-normal tracking-tight leading-none transition-colors duration-300
                ${isDark ? 'text-[#f5f0e8]' : 'text-[#2a2010]'}`}>Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {currentUser && (
              <span className={`text-[11px] tracking-[2px] uppercase transition-colors duration-300
                ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
                {currentUser.name}
              </span>
            )}
            <button
              onClick={handleLogout}
              className={`text-[10px] tracking-[3px] uppercase border px-4 py-2 transition-all duration-200
                ${isDark 
                  ? 'text-[#8a7a60] border-[#2a2010] hover:border-[#c9a84c] hover:text-[#c9a84c]' 
                  : 'text-[#5a5040] border-[#d0c5b5] hover:border-[#8a7a60] hover:text-[#8a7a60]'}`}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        
        {/* CREATE POST BUTTON */}
        <div className="mb-10 flex justify-between items-center">
          <h2 className={`text-[10px] tracking-[4px] uppercase transition-colors duration-300
            ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
            Latest Discussions
          </h2>
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className={`text-[10px] tracking-[3px] uppercase border px-5 py-2.5 transition-all duration-200
              ${isDark 
                ? 'text-[#c9a84c] border-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a]' 
                : 'text-[#8a7a60] border-[#8a7a60] hover:bg-[#8a7a60] hover:text-white'}`}
          >
            {showNewPostForm ? '− Cancel' : '+ New Post'}
          </button>
        </div>

        {/* NEW POST FORM */}
        {showNewPostForm && (
          <div className={`mb-12 border p-8 relative transition-colors duration-300
            ${isDark ? 'border-[#2a2010] bg-[#0d0d0d]' : 'border-[#d0c5b5] bg-white'}`}>
            
            {/* Corner accents */}
            <div className={`absolute top-0 left-0 w-6 h-6 border-t border-l transition-colors duration-300
              ${isDark ? 'border-[#c9a84c]' : 'border-[#8a7a60]'}`} />
            <div className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r transition-colors duration-300
              ${isDark ? 'border-[#c9a84c]' : 'border-[#8a7a60]'}`} />

            <h3 className={`text-[11px] tracking-[4px] uppercase mb-6 transition-colors duration-300
              ${isDark ? 'text-[#c9a84c]' : 'text-[#8a7a60]'}`}>
              Compose New Post
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-6">
              <div>
                <label className={`block text-[9px] tracking-[3px] uppercase mb-2 transition-colors duration-300
                  ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Post title..."
                  className={`w-full bg-transparent border-b py-2 px-0 text-[15px] font-serif outline-none transition-all duration-200 placeholder:transition-colors
                    ${isDark 
                      ? 'border-[#2a2010] text-[#f5f0e8] placeholder-[#3a3020] focus:border-[#c9a84c]' 
                      : 'border-[#d0c5b5] text-[#2a2010] placeholder-[#a09585] focus:border-[#8a7a60]'}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-[9px] tracking-[3px] uppercase mb-2 transition-colors duration-300
                  ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Write your post content..."
                  rows="4"
                  className={`w-full bg-transparent border py-3 px-3 text-[14px] font-serif outline-none transition-all duration-200 placeholder:transition-colors resize-none
                    ${isDark 
                      ? 'border-[#2a2010] text-[#f5f0e8] placeholder-[#3a3020] focus:border-[#c9a84c]' 
                      : 'border-[#d0c5b5] text-[#2a2010] placeholder-[#a09585] focus:border-[#8a7a60]'}`}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={postLoading}
                  className={`text-[10px] tracking-[3px] uppercase px-6 py-3 transition-all duration-200
                    ${postLoading
                      ? isDark
                        ? 'bg-[#2a2010] text-[#8a7a60] cursor-not-allowed'
                        : 'bg-[#d0c5b5] text-[#6a6050] cursor-not-allowed'
                      : isDark
                        ? 'bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#e0b85c]'
                        : 'bg-[#8a7a60] text-white hover:bg-[#9a8a70]'
                    }`}
                >
                  {postLoading ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* POSTS LIST */}
        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className={`text-center py-16 border transition-colors duration-300
              ${isDark ? 'border-[#2a2010]' : 'border-[#d0c5b5]'}`}>
              <p className={`text-[12px] tracking-[2px] uppercase transition-colors duration-300
                ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
                No posts yet. Be the first to share your thoughts.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post._id}
                className={`border p-8 relative transition-colors duration-300
                  ${isDark 
                    ? 'border-[#2a2010] bg-[#0d0d0d]' 
                    : 'border-[#d0c5b5] bg-[#ffffff]'}`}
              >
                {/* Corner accents */}
                <div className={`absolute top-0 left-0 w-6 h-6 border-t border-l transition-colors duration-300
                  ${isDark ? 'border-[#c9a84c]' : 'border-[#8a7a60]'}`} />
                <div className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r transition-colors duration-300
                  ${isDark ? 'border-[#c9a84c]' : 'border-[#8a7a60]'}`} />

                <div className={`text-[9px] tracking-[3px] uppercase mb-3 transition-colors duration-300
                  ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
                  {post.author?.name} &nbsp;·&nbsp; {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>

                <h2 className={`text-2xl font-normal leading-tight tracking-tight mb-4 transition-colors duration-300
                  ${isDark ? 'text-[#f5f0e8]' : 'text-[#2a2010]'}`}>
                  {post.title}
                </h2>

                <p className={`text-[14px] leading-relaxed mb-6 border-l-2 pl-4 transition-colors duration-300
                  ${isDark 
                    ? 'text-[#8a7a60] border-[#2a2010]' 
                    : 'text-[#5a5040] border-[#d0c5b5]'}`}>
                  {post.content}
                </p>

                {/* LIKE */}
                <button
                  onClick={() => handleLike(post._id)}
                  disabled={likeLoading === post._id}
                  className={`flex items-center gap-2 text-[10px] tracking-[2px] uppercase border px-4 py-2 transition-all duration-200 disabled:opacity-40
                    ${isDark 
                      ? 'text-[#8a7a60] border-[#2a2010] hover:border-[#c9a84c] hover:text-[#c9a84c]' 
                      : 'text-[#5a5040] border-[#d0c5b5] hover:border-[#8a7a60] hover:text-[#8a7a60]'}`}
                >
                  <span className={likeLoading === post._id ? 'animate-pulse' : ''}>♥</span>
                  <span>{post.likes?.length || 0}</span>
                </button>

                {/* COMMENTS SECTION (keep your existing comments code) */}
                <div className={`mt-8 pt-6 border-t transition-colors duration-300
                  ${isDark ? 'border-[#2a2010]' : 'border-[#d0c5b5]'}`}>
                  <p className={`text-[9px] tracking-[4px] uppercase mb-5 transition-colors duration-300
                    ${isDark ? 'text-[#5a5040]' : 'text-[#8a7a60]'}`}>
                    Comments &nbsp;({post.comments?.length || 0})
                  </p>

                  <div className="space-y-3 mb-5">
                    {post.comments?.map((comment) => (
                      <div key={comment._id} 
                        className={`border px-4 py-3 transition-colors duration-300
                          ${isDark 
                            ? 'border-[#1e1e0e] bg-[#0a0a0a]' 
                            : 'border-[#e0d5c5] bg-[#faf7f2]'}`}>
                        {editingComment === comment._id ? (
                          <div className="flex gap-2">
                            <input
                              className={`flex-1 bg-transparent border-b outline-none text-[13px] py-1 font-serif transition-colors duration-200
                                ${isDark 
                                  ? 'border-[#2a2010] focus:border-[#c9a84c] text-[#f5f0e8]' 
                                  : 'border-[#d0c5b5] focus:border-[#8a7a60] text-[#2a2010]'}`}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                            />
                            <button
                              className={`text-[9px] tracking-[2px] uppercase px-3 py-1 transition-colors duration-200
                                ${isDark 
                                  ? 'text-[#0a0a0a] bg-[#c9a84c] hover:bg-[#e0b85c]' 
                                  : 'text-white bg-[#8a7a60] hover:bg-[#9a8a70]'}`}
                              onClick={() => handleEditComment(post._id, comment._id)}
                            >
                              Save
                            </button>
                            <button
                              className={`text-[9px] tracking-[2px] uppercase border px-3 py-1 transition-colors duration-200
                                ${isDark 
                                  ? 'text-[#8a7a60] border-[#2a2010] hover:border-[#5a5040]' 
                                  : 'text-[#5a5040] border-[#d0c5b5] hover:border-[#8a7a60]'}`}
                              onClick={() => setEditingComment(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <div className="text-[13px]">
                              <span className={`text-[10px] tracking-[1px] uppercase mr-2 transition-colors duration-300
                                ${isDark ? 'text-[#c9a84c]' : 'text-[#8a7a60]'}`}>
                                {comment.user?.name}
                              </span>
                              <span className={`transition-colors duration-300
                                ${isDark ? 'text-[#8a7a60]' : 'text-[#5a5040]'}`}>
                                {comment.text}
                              </span>
                            </div>
                            {currentUser?.id === comment.user?._id && (
                              <div className="flex gap-3 text-[9px] tracking-[2px] uppercase">
                                <button
                                  className={`transition-colors duration-200
                                    ${isDark 
                                      ? 'text-[#5a5040] hover:text-[#c9a84c]' 
                                      : 'text-[#8a7a60] hover:text-[#5a5040]'}`}
                                  onClick={() => { setEditingComment(comment._id); setEditText(comment.text); }}
                                >
                                  Edit
                                </button>
                                <button
                                  className={`transition-colors duration-200
                                    ${isDark 
                                      ? 'text-[#5a5040] hover:text-[#cc6666]' 
                                      : 'text-[#8a7a60] hover:text-[#cc3333]'}`}
                                  onClick={() => handleDeleteComment(post._id, comment._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ADD COMMENT */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Leave a comment..."
                      className={`flex-1 bg-transparent border-b outline-none text-[13px] py-2 font-serif transition-colors duration-200 placeholder:transition-colors
                        ${isDark 
                          ? 'border-[#2a2010] focus:border-[#c9a84c] text-[#f5f0e8] placeholder-[#3a3020]' 
                          : 'border-[#d0c5b5] focus:border-[#8a7a60] text-[#2a2010] placeholder-[#a09585]'}`}
                      value={commentText[post._id] || ""}
                      onChange={(e) => setCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") handleComment(post._id); }}
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      className={`text-[9px] tracking-[3px] uppercase px-5 py-2 transition-colors duration-200
                        ${isDark 
                          ? 'text-[#0a0a0a] bg-[#c9a84c] hover:bg-[#e0b85c]' 
                          : 'text-white bg-[#8a7a60] hover:bg-[#9a8a70]'}`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;