// src/api/flashcardApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/flashcards';

export const fetchFlashcardSets = () => axios.get(`${API_BASE}`);
export const fetchCardsBySet = (setId) => axios.get(`${API_BASE}`);
export const createFlashcard = (card) => axios.post(`${API_BASE}/create`, card);
export const deleteFlashcard = (id) => axios.delete(`${API_BASE}/delete/${id}`);
