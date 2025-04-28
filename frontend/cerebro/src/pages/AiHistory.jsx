// src/pages/AiHistory.jsx

import React, { useEffect, useState, useRef } from "react";

import axios from "axios";

import ReactMarkdown from "react-markdown";

import { Link } from "react-router-dom";

import {

  FiArrowLeft,

  FiSearch,

  FiClock,

  FiMessageSquare,

  FiTrash2,

  FiFilter,

  FiDownload,

  FiCopy,

  FiShare2

} from "react-icons/fi";



export default function AiHistory() {

  const [history, setHistory]             = useState([]);

  const [loading, setLoading]             = useState(true);

  const [error, setError]                 = useState(null);

  const [searchTerm, setSearchTerm]       = useState("");

  const [expandedItem, setExpandedItem]   = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);

  const [viewMode, setViewMode]           = useState("list"); // or "grid"

  const [sortOrder, setSortOrder]         = useState("newest");

  const [notification, setNotification]   = useState({ visible: false, message: "", type: "" });

  const [filterDate, setFilterDate]       = useState("all");

  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [showSortMenu, setShowSortMenu] = useState(false);

  const listRef = useRef(null);

  const filterRef = useRef(null);

  const sortRef = useRef(null);



  useEffect(() => {

    fetchHistory();

    

    // Apply dark mode by default

    document.documentElement.classList.add('dark');

    

    // Handle clicks outside the filter and sort menus

    const handleClickOutside = (event) => {

      if (filterRef.current && !filterRef.current.contains(event.target)) {

        setShowFilterMenu(false);

      }

      if (sortRef.current && !sortRef.current.contains(event.target)) {

        setShowSortMenu(false);

      }

    };

    

    document.addEventListener('mousedown', handleClickOutside);

    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, []);



  async function fetchHistory() {

    setLoading(true);

    try {

      const res = await axios.get("http://localhost:8080/api/ai/conversations");

      setHistory(res.data || []);

      setError(null);

    } catch (err) {

      console.error("Failed to fetch conversation history:", err);

      setError("Failed to load conversation history. Please try again later.");

    } finally {

      setLoading(false);

    }

  }



  function showNotification(message, type) {

    setNotification({ visible: true, message, type });

    setTimeout(() => setNotification({ visible: false, message: "", type: "" }), 3000);

  }



  function handleSearch(e) {

    setSearchTerm(e.target.value);

  }



  function toggleExpand(id) {

    setExpandedItem(expandedItem === id ? null : id);

  }



  function toggleSelectItem(id) {

    if (selectedItems.includes(id)) {

      setSelectedItems(selectedItems.filter(i => i !== id));

    } else {

      setSelectedItems([...selectedItems, id]);

    }

  }



  async function deleteSelected() {

    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} conversation(s)?`)) {

      return;

    }

    try {

      // TODO: call DELETE endpoints here

      showNotification(`${selectedItems.length} conversation(s) deleted successfully`, "success");

      setSelectedItems([]);

      await fetchHistory();

    } catch {

      showNotification("Failed to delete conversations", "error");

    }

  }



  function handleDateFilter(filter) {

    setFilterDate(filter);

    setShowFilterMenu(false);

  }



  function handleSort(order) {

    setSortOrder(order);

    setShowSortMenu(false);

  }



  function exportHistory() {

    const dataToExport =

      selectedItems.length > 0

        ? history.filter(item => selectedItems.includes(item.id))

        : history;



    const dataStr = JSON.stringify(dataToExport, null, 2);

    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const filename = `ai-conversation-history-${new Date().toISOString().slice(0,10)}.json`;



    const link = document.createElement('a');

    link.href = dataUri;

    link.download = filename;

    link.click();

    showNotification("History exported successfully!", "success");

  }



  // Safely filter and sort

  const filteredHistory = history

    .filter(item => {

      // guard against null prompt/answer

      const prompt = item.prompt ?? "";

      const answer = item.answer ?? "";

      const text = (prompt + answer).toLowerCase();

      if (!text.includes(searchTerm.toLowerCase())) return false;



      if (filterDate === "all") return true;

      const created = new Date(item.createdAt);

      const now = new Date();



      if (filterDate === "today") {

        return created.toDateString() === now.toDateString();

      }

      if (filterDate === "week") {

        const weekAgo = new Date(now);

        weekAgo.setDate(now.getDate() - 7);

        return created >= weekAgo;

      }

      if (filterDate === "month") {

        const monthAgo = new Date(now);

        monthAgo.setMonth(now.getMonth() - 1);

        return created >= monthAgo;

      }

      return true;

    })

    .sort((a, b) => {

      const aDate = new Date(a.createdAt).getTime();

      const bDate = new Date(b.createdAt).getTime();

      return sortOrder === "oldest" ? aDate - bDate : bDate - aDate;

    });



  const stats = {

    total: history.length,

    filtered: filteredHistory.length,

    selected: selectedItems.length

  };



  function formatDate(dateString) {

    const date = new Date(dateString);

    const now  = new Date();

    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff} seconds ago`;

    if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`;

    if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;

    if (diff < 2592000) return `${Math.floor(diff/86400)} days ago`;

    return date.toLocaleDateString(undefined, {

      year: 'numeric', month: 'short', day: 'numeric',

      hour: '2-digit', minute: '2-digit'

    });

  }



  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-indigo-950">

      {/* Notification */}

      {notification.visible && (

        <div

          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${

            notification.type === 'error'

              ? 'bg-red-500 text-white'

              : 'bg-green-500 text-white'

          }`}

        >

          {notification.message}

        </div>

      )}



      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl shadow-lg mb-6 overflow-hidden">

          <div className="p-6 text-white flex justify-between items-center">

            <div>

              <h1 className="text-3xl font-bold flex items-center">

                <span className="text-4xl mr-2">💾</span> AI Conversation History

              </h1>

              <p className="mt-2 text-blue-300">

                Your past conversations with our AI assistant

              </p>

            </div>

            <Link

              to="/dashboard/ai-solver"

              className="flex items-center gap-2 bg-white/10 hover:bg-white/20

                       text-white px-4 py-2 rounded-lg transition-all"

            >

              <FiArrowLeft /> Back to Chat

            </Link>

          </div>



          {/* Stats + Controls */}

          <div className="bg-black/20 backdrop-blur-sm p-4 flex flex-wrap gap-3 items-center justify-between">

            {/* Search */}

            <div className="relative flex-grow max-w-md">

              <FiSearch className="absolute left-3 top-3 text-white/70" />

              <input

                type="text"

                placeholder="Search conversations..."

                value={searchTerm}

                onChange={handleSearch}

                className="w-full bg-white/10 text-white placeholder-white/60

                         border border-white/20 rounded-lg py-2 pl-10 pr-4

                         focus:outline-none focus:ring-2 focus:ring-white/30"

              />

            </div>



            {/* Date Filter */}

            <div className="relative" ref={filterRef}>

              <button 

                className="flex items-center gap-1 bg-white/10 hover:bg-white/20

                         text-white px-3 py-2 rounded-lg"

                onClick={() => setShowFilterMenu(!showFilterMenu)}

              >

                <FiFilter /> Filter <span className="text-xs">▼</span>

              </button>

              {showFilterMenu && (

                <div

                  className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden

                         z-10"

                >

                  {['all','today','week','month'].map(f => (

                    <button

                      key={f}

                      onClick={() => handleDateFilter(f)}

                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${

                        filterDate === f ? 'bg-blue-900 text-blue-100' : 'text-gray-300'

                      }`}

                    >

                      {f === 'all' ? 'All Time' :

                      f === 'today' ? 'Today' :

                      f === 'week' ? 'Past Week' :

                      'Past Month'}

                    </button>

                  ))}

                </div>

              )}

            </div>



            {/* Sort */}

            <div className="relative" ref={sortRef}>

              <button 

                className="flex items-center gap-1 bg-white/10 hover:bg-white/20

                         text-white px-3 py-2 rounded-lg"

                onClick={() => setShowSortMenu(!showSortMenu)}

              >

                <FiClock /> Sort <span className="text-xs">▼</span>

              </button>

              {showSortMenu && (

                <div

                  className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden

                         z-10"

                >

                  {['newest','oldest'].map(o => (

                    <button

                      key={o}

                      onClick={() => handleSort(o)}

                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${

                        sortOrder === o ? 'bg-blue-900 text-blue-100' : 'text-gray-300'

                      }`}

                    >

                      {o === 'newest'? 'Newest First' : 'Oldest First'}

                    </button>

                  ))}

                </div>

              )}

            </div>



            {/* View Mode */}

            <button

              onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}

              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white

                       px-3 py-2 rounded-lg"

            >

              {viewMode === 'list' ? 'Grid View' : 'List View'}

            </button>



            {/* Actions */}

            <div className="flex gap-2">

              {selectedItems.length > 0 && (

                <button

                  onClick={deleteSelected}

                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"

                >

                  <FiTrash2 /> Delete Selected

                </button>

              )}

              <button

                onClick={exportHistory}

                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"

              >

                <FiDownload /> Export

              </button>

            </div>

          </div>

        </div>



        {/* Main List */}

        <div ref={listRef} className="bg-gray-900 rounded-xl shadow-lg p-6">

          {loading ? (

            <div className="flex flex-col items-center justify-center py-12">

              <div className="w-12 h-12 border-4 border-indigo-900 border-t-indigo-400 rounded-full animate-spin"></div>

              <p className="mt-4 text-gray-400">Loading your conversation history...</p>

            </div>

          ) : error ? (

            <div className="bg-red-900/20 text-red-300 p-4 rounded-lg">

              <p>{error}</p>

              <button

                onClick={fetchHistory}

                className="mt-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-red-200"

              >

                Try Again

              </button>

            </div>

          ) : filteredHistory.length === 0 ? (

            <div className="text-center py-12 text-gray-300">

              {history.length === 0 ? (

                <>

                  <div className="text-6xl mb-4">💬</div>

                  <h3 className="text-xl font-medium text-gray-200 mb-2">No conversations yet</h3>

                  <p className="text-gray-400 mb-6">Start a new conversation with our AI assistant.</p>

                  <Link

                    to="/"

                    className="px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-700

                             text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600

                             transition-all shadow-md hover:shadow-lg"

                  >

                    Start New Conversation

                  </Link>

                </>

              ) : (

                <>

                  <div className="text-6xl mb-4">🔍</div>

                  <h3 className="text-xl font-medium text-gray-200 mb-2">No results found</h3>

                  <p className="text-gray-400">Try adjusting your search or filters.</p>

                </>

              )}

            </div>

          ) : (

            <div className={viewMode === "list" ?

              "space-y-6" :

              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>

              {filteredHistory.map(convo => (

                <div

                  key={convo.id}

                  className={`

                    bg-gray-800 border border-gray-700 rounded-xl overflow-hidden

                    transition-shadow duration-300 shadow-sm hover:shadow-md

                    ${expandedItem === convo.id ? "ring-2 ring-blue-500" : ""}

                    ${selectedItems.includes(convo.id) ? "ring-2 ring-indigo-500 bg-indigo-900/20" : ""}

                  `}

                >

                  {/* Header */}

                  <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-850">

                    <div className="flex items-center space-x-2">

                      <input

                        type="checkbox"

                        checked={selectedItems.includes(convo.id)}

                        onChange={() => toggleSelectItem(convo.id)}

                        className="w-4 h-4 text-indigo-600 rounded border-gray-600 focus:ring-indigo-500 bg-gray-700"

                      />

                      <div>

                        <span className="text-xs font-medium text-gray-400">

                          Conv #{convo.id}

                        </span>

                        <p className="text-xs text-gray-500">

                          {formatDate(convo.createdAt)}

                        </p>

                      </div>

                    </div>

                    <div className="flex space-x-2">

                      <button

                        onClick={() =>

                          {

                            const text = `Q: ${convo.prompt ?? ""}\n\nA: ${convo.answer ?? ""}`;

                            navigator.clipboard.writeText(text);

                            showNotification("Copied to clipboard!", "success");

                          }

                        }

                        className="p-1 text-gray-400 hover:text-gray-200"

                        title="Copy"

                      >

                        <FiCopy size={16} />

                      </button>

                      <button

                        onClick={() => toggleExpand(convo.id)}

                        className="p-1 text-gray-400 hover:text-gray-200"

                        title={expandedItem === convo.id ? "Collapse" : "Expand"}

                      >

                        {expandedItem === convo.id ? (

                          <FiArrowLeft size={16} />

                        ) : (

                          <FiArrowLeft size={16} className="transform rotate-180" />

                        )}

                      </button>

                    </div>

                  </div>



                  {/* Prompt */}

                  <div className="p-4">

                    <h3 className="font-medium text-gray-200 flex items-center gap-2">

                      <span className="text-blue-400">Q:</span>

                      <span className={expandedItem === convo.id ? "" : "line-clamp-2"}>

                        {convo.prompt ?? ""}

                      </span>

                    </h3>

                  </div>



                  {/* Answer */}

                  {expandedItem === convo.id && (

                    <div className="border-t border-gray-700">

                      <div className="p-4 bg-blue-900/20">

                        <div className="text-sm font-medium text-blue-300 mb-2">Answer:</div>

                        <div className="prose prose-sm max-w-none prose-invert prose-headings:text-gray-200 prose-a:text-blue-400">

                          <ReactMarkdown>{convo.answer ?? ""}</ReactMarkdown>

                        </div>

                      </div>

                    </div>

                  )}



                  {/* Footer */}

                  <div className="p-4 bg-gray-850 border-t border-gray-700 flex justify-between items-center">

                    <button

                      onClick={() => toggleExpand(convo.id)}

                      className="text-sm text-gray-400 hover:text-gray-200"

                    >

                      {expandedItem === convo.id ? "Show less" : "Show more"}

                    </button>

                    <button

                      className="p-1 text-gray-400 hover:text-gray-200 transition-colors"

                      title="Share"

                    >

                      <FiShare2 size={16} />

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>



        {/* Footer */}

        <div className="mt-6 text-center text-sm text-gray-400">

          <p>Interactions are stored locally and never shared without your permission.</p>

        </div>

      </div>

    </div>

  );

}