import React, { useEffect, useState } from "react";

import axios from "axios";

import { Search, Plus, X, Edit, Trash2, Book, Tag, Check, Loader2, Filter } from "lucide-react";

import Flashcard from "../components/Flashcard";

import { motion, AnimatePresence } from "framer-motion";



export default function FlashcardsPage() {

  const [cards, setCards] = useState([]);

  const [filteredCards, setFilteredCards] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTopic, setSelectedTopic] = useState("");

  const [newCard, setNewCard] = useState({ question: "", answer: "", topic: "" });

  const [editingCard, setEditingCard] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [viewMode, setViewMode] = useState("grid");

  const [studyMode, setStudyMode] = useState(false);

  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);

  const [topics, setTopics] = useState([]);



  const apiUrl = "http://localhost:8080/api/flashcards";



  useEffect(() => {

    fetchCards();

  }, []);



  useEffect(() => {

    const uniqueTopics = [...new Set(cards.map(card => card.topic))];

    setTopics(uniqueTopics);

  }, [cards]);



  useEffect(() => {

    filterCards();

  }, [searchTerm, selectedTopic, cards]);



  async function fetchCards() {

    setIsLoading(true);

    try {

      const res = await axios.get(apiUrl);

      setCards(res.data);

    } catch (err) {

      console.error("Failed to load flashcards:", err);

    } finally {

      setIsLoading(false);

    }

  }



  function filterCards() {

    let result = [...cards];

    if (searchTerm.trim()) {

      const term = searchTerm.trim().toLowerCase();

      result = result.filter(card =>

        card.question.toLowerCase().includes(term) ||

        card.answer.toLowerCase().includes(term) ||

        card.topic.toLowerCase().includes(term)

      );

    }

    if (selectedTopic) {

      result = result.filter(card => card.topic === selectedTopic);

    }

    setFilteredCards(result);

  }



  async function handleCreate() {

    if (!newCard.question.trim() || !newCard.answer.trim()) {

      alert("Question and answer are required!");

      return;

    }

    setIsLoading(true);

    try {

      await axios.post(apiUrl, newCard);

      setNewCard({ question: "", answer: "", topic: "" });

      setIsFormOpen(false);

      await fetchCards();

    } catch (err) {

      console.error("Create failed:", err);

    } finally {

      setIsLoading(false);

    }

  }



  async function handleDelete(id, e) {

    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this flashcard?")) return;

    setIsLoading(true);

    try {

      await axios.delete(`${apiUrl}/${id}`);

      await fetchCards();

    } catch (err) {

      console.error("Delete failed:", err);

    } finally {

      setIsLoading(false);

    }

  }



  async function handleUpdate() {

    if (!editingCard.question.trim() || !editingCard.answer.trim()) {

      alert("Question and answer are required!");

      return;

    }

    setIsLoading(true);

    try {

      await axios.put(`${apiUrl}/${editingCard.id}`, editingCard);

      setEditingCard(null);

      setIsFormOpen(false);

      await fetchCards();

    } catch (err) {

      console.error("Update failed:", err);

    } finally {

      setIsLoading(false);

    }

  }



  function handleCardClick(card) {

    setSelectedCard(card);

    setIsModalOpen(true);

  }



  function handleEditClick(card, e) {

    e.stopPropagation();

    setEditingCard({ ...card });

    setIsFormOpen(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

  }



  function startStudyMode() {

    setStudyMode(true);

    setCurrentStudyIndex(0);

    setShowAnswer(false);

  }



  function nextCard() {

    if (currentStudyIndex < filteredCards.length - 1) {

      setCurrentStudyIndex(currentStudyIndex + 1);

      setShowAnswer(false);

    } else {

      setStudyMode(false);

    }

  }



  function prevCard() {

    if (currentStudyIndex > 0) {

      setCurrentStudyIndex(currentStudyIndex - 1);

      setShowAnswer(false);

    }

  }



  return (

    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">

      <header className="bg-indigo-600 text-white dark:bg-gray-800 dark:text-gray-200 shadow-lg">

        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">

          <div className="flex items-center space-x-3">

            <Book className="h-8 w-8" />

            <h1 className="text-3xl font-bold">FlashMaster</h1>

          </div>

          <div className="flex items-center space-x-4">

            {filteredCards.length > 0 && !studyMode && (

              <button

                onClick={startStudyMode}

                className="bg-white text-indigo-600 dark:bg-gray-700 dark:text-indigo-400 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 dark:hover:bg-gray-600 transition"

              >

                Study Mode

              </button>

            )}

            <button

              onClick={() => {

                setEditingCard(null);

                setIsFormOpen(!isFormOpen);

              }}

              className="flex items-center space-x-2 bg-white text-indigo-600 dark:bg-gray-700 dark:text-indigo-400 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 dark:hover:bg-gray-600 transition"

            >

              {isFormOpen ? (

                <>

                  <X size={18} />

                  <span>Close</span>

                </>

              ) : (

                <>

                  <Plus size={18} />

                  <span>New Card</span>

                </>

              )}

            </button>

          </div>

        </div>

      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">

        {studyMode && filteredCards.length > 0 && (

          <div className="mb-12">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Study Mode</h2>

              <button

                onClick={() => setStudyMode(false)}

                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"

              >

                <X size={20} />

                <span>Exit</span>

              </button>

            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl p-8 max-w-2xl mx-auto transition-colors">

              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">

                <span>Card {currentStudyIndex + 1} of {filteredCards.length}</span>

                <span>Topic: {filteredCards[currentStudyIndex].topic}</span>

              </div>

              <div className="min-h-48 mb-8">

                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Question:</h3>

                <p className="text-lg text-gray-900 dark:text-gray-100">{filteredCards[currentStudyIndex].question}</p>

                {showAnswer && (

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">

                    <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">Answer:</h3>

                    <p className="text-lg text-gray-900 dark:text-gray-100">{filteredCards[currentStudyIndex].answer}</p>

                  </div>

                )}

              </div>

              <div className="flex justify-between">

                <div>

                  <button

                    onClick={prevCard}

                    disabled={currentStudyIndex === 0}

                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2 disabled:opacity-50 transition-colors dark:text-gray-200"

                  >

                    Previous

                  </button>

                  <button

                    onClick={nextCard}

                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md transition-colors dark:text-gray-200"

                  >

                    Next

                  </button>

                </div>

                {!showAnswer && (

                  <button

                    onClick={() => setShowAnswer(true)}

                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"

                  >

                    Show Answer

                  </button>

                )}

              </div>

            </div>

          </div>

        )}



        {!studyMode && (

          <>

            <AnimatePresence>

              {isFormOpen && (

                <motion.div

                  initial={{ opacity: 0, y: -20 }}

                  animate={{ opacity: 1, y: 0 }}

                  exit={{ opacity: 0, y: -20 }}

                  className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 mb-8 transition-colors"

                >

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">

                    {editingCard ? "Edit Flashcard" : "Create New Flashcard"}

                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>

                      <textarea

                        rows={4}

                        placeholder="Enter your question..."

                        value={editingCard ? editingCard.question : newCard.question}

                        onChange={(e) => {

                          const val = e.target.value;

                          editingCard

                            ? setEditingCard({ ...editingCard, question: val })

                            : setNewCard({ ...newCard, question: val });

                        }}

                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"

                      />

                    </div>

                    <div>

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer</label>

                      <textarea

                        rows={4}

                        placeholder="Enter the answer..."

                        value={editingCard ? editingCard.answer : newCard.answer}

                        onChange={(e) => {

                          const val = e.target.value;

                          editingCard

                            ? setEditingCard({ ...editingCard, answer: val })

                            : setNewCard({ ...newCard, answer: val });

                        }}

                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"

                      />

                    </div>

                    <div className="md:col-span-2">

                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>

                      <div className="flex">

                        <input

                          type="text"

                          placeholder="e.g. Math, Science, History..."

                          value={editingCard ? editingCard.topic : newCard.topic}

                          onChange={(e) => {

                            const val = e.target.value;

                            editingCard

                              ? setEditingCard({ ...editingCard, topic: val })

                              : setNewCard({ ...newCard, topic: val });

                          }}

                          className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"

                          list="topics"

                        />

                        <datalist id="topics">

                          {topics.map((topic, i) => (

                            <option key={i} value={topic} />

                          ))}

                        </datalist>

                      </div>

                    </div>

                  </div>

                  <div className="mt-6 flex justify-end space-x-3">

                    <button

                      onClick={() => {

                        setIsFormOpen(false);

                        setEditingCard(null);

                      }}

                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition"

                    >

                      Cancel

                    </button>

                    {editingCard ? (

                      <button

                        onClick={handleUpdate}

                        className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 flex items-center transition"

                        disabled={isLoading}

                      >

                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}

                        Save Changes

                      </button>

                    ) : (

                      <button

                        onClick={handleCreate}

                        className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 flex items-center transition"

                        disabled={isLoading}

                      >

                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}

                        Create Flashcard

                      </button>

                    )}

                  </div>

                </motion.div>

              )}

            </AnimatePresence>



            <div className="mb-8">

              <div className="flex flex-col md:flex-row gap-4">

                <div className="flex-1 relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />

                  </div>

                  <input

                    type="text"

                    placeholder="Search questions, answers or topics..."

                    value={searchTerm}

                    onChange={(e) => setSearchTerm(e.target.value)}

                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"

                  />

                </div>

                <div className="md:w-64">

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                      <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500" />

                    </div>

                    <select

                      value={selectedTopic}

                      onChange={(e) => setSelectedTopic(e.target.value)}

                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-colors"

                    >

                      <option value="">All Topics</option>

                      {topics.map((topic, i) => (

                        <option key={i} value={topic}>{topic}</option>

                      ))}

                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">

                      <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />

                    </div>

                  </div>

                </div>

                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden transition-colors">

                  <button

                    onClick={() => setViewMode("grid")}

                    className={`px-4 py-2 ${viewMode === "grid" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}

                  >

                    Grid

                  </button>

                  <button

                    onClick={() => setViewMode("list")}

                    className={`px-4 py-2 ${viewMode === "list" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300"}`}

                  >

                    List

                  </button>

                </div>

              </div>

            </div>



            <div className="mb-6 flex justify-between items-center">

              <p className="text-gray-600 dark:text-gray-400">

                {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} found

                {selectedTopic && ` in topic "${selectedTopic}"`}

                {searchTerm && ` matching "${searchTerm}"`}

              </p>

              {filteredCards.length > 0 && (

                <button

                  onClick={startStudyMode}

                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium transition"

                >

                  Study These Cards

                </button>

              )}

            </div>



            {isLoading && (

              <div className="flex justify-center py-12">

                <div className="flex flex-col items-center">

                  <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />

                  <p className="mt-4 text-gray-500 dark:text-gray-400">Loading flashcards...</p>

                </div>

              </div>

            )}



            {!isLoading && filteredCards.length === 0 && (

              <div className="py-12 flex flex-col items-center justify-center bg-white dark:bg-gray-700 rounded-xl shadow p-8 text-center transition-colors">

                <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-4 mb-4">

                  <Book className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />

                </div>

                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No flashcards found</h3>

                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">

                  {searchTerm || selectedTopic ?

                    "Try a different search term or topic filter" :

                    "Create your first flashcard to get started with your study session"}

                </p>

                {!isFormOpen && (

                  <button

                    onClick={() => setIsFormOpen(true)}

                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"

                  >

                    <Plus size={16} className="mr-2" />

                    Create Flashcard

                  </button>

                )}

              </div>

            )}



            {!isLoading && filteredCards.length > 0 && (

              <div className={viewMode === "grid" ? 

                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : 

                "space-y-4"}>

                <AnimatePresence>

                  {filteredCards.map(card => (

                    <motion.div

                      key={card.id}

                      initial={{ opacity: 0, scale: 0.95 }}

                      animate={{ opacity: 1, scale: 1 }}

                      exit={{ opacity: 0, scale: 0.95 }}

                      whileHover={{ scale: 1.02 }}

                      transition={{ duration: 0.2 }}

                      className={`relative cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow rounded-lg p-5" : ""} transition-colors`}

                      onClick={() => handleCardClick(card)}

                    >

                      {viewMode === "grid" ? (

                        <Flashcard card={card} />

                      ) : (

                        <div className="flex justify-between">

                          <div>

                            <h3 className="font-medium text-lg mb-1 text-gray-800 dark:text-gray-200">{card.question}</h3>

                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">

                              {card.topic}

                            </div>

                          </div>

                          <div className="flex space-x-2">

                            <button

                              onClick={e => handleEditClick(card, e)}

                              className="p-2 text-yellow-600 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-600 rounded-full transition"

                              title="Edit"

                            >

                              <Edit size={16} />

                            </button>

                            <button

                              onClick={e => handleDelete(card.id, e)}

                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-600 rounded-full transition"

                              title="Delete"

                            >

                              <Trash2 size={16} />

                            </button>

                          </div>

                        </div>

                      )}

                      {viewMode === "grid" && (

                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">

                          <button

                            onClick={e => handleEditClick(card, e)}

                            className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-70 text-yellow-600 dark:text-yellow-300 hover:text-yellow-700 dark:hover:text-yellow-200 rounded-full shadow-sm transition"

                            title="Edit"

                          >

                            <Edit size={16} />

                          </button>

                          <button

                            onClick={e => handleDelete(card.id, e)}

                            className="p-2 bg-white dark:bg-gray-700 bg-opacity-90 dark:bg-opacity-70 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 rounded-full shadow-sm transition"

                            title="Delete"

                          >

                            <Trash2 size={16} />

                          </button>

                        </div>

                      )}

                    </motion.div>

                  ))}

                </AnimatePresence>

              </div>

            )}

          </>

        )}

      </main>



      <footer className="bg-gray-100 dark:bg-gray-800 mt-12 transition-colors">

        <div className="max-w-7xl mx-auto px-4 py-6">

          <p className="text-center text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} FlashMaster - Your Ultimate Study Companion</p>

        </div>

      </footer>



      {isModalOpen && selectedCard && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">

            <div className="p-6">

              <div className="flex justify-between items-center mb-6">

                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">

                  {selectedCard.topic}

                </div>

                <button

                  onClick={() => setIsModalOpen(false)}

                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition"

                >

                  <X size={24} />

                </button>

              </div>

              <div className="space-y-6 text-gray-900 dark:text-gray-100">

                <div>

                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300 mb-2">Question</h3>

                  <p className="text-xl">{selectedCard.question}</p>

                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">

                  <h3 className="text-lg font-medium text-gray-500 dark:text-gray-300 mb-2">Answer</h3>

                  <p className="text-xl">{selectedCard.answer}</p>

                </div>

              </div>

              <div className="mt-8 flex justify-end space-x-3">

                <button

                  onClick={() => {

                    setIsModalOpen(false);

                    handleEditClick(selectedCard, { stopPropagation: () => {} });

                  }}

                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center transition"

                >

                  <Edit size={16} className="mr-2" />

                  Edit

                </button>

                <button

                  onClick={() => setIsModalOpen(false)}

                  className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"

                >

                  Close

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}