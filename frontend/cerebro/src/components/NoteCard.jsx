import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";

export default function NoteCard({ note, onEdit, onDelete, onView }) {
  // Format date if note has createdAt or updatedAt
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get a snippet of the content for preview
  const contentPreview = note.content.length > 120 
    ? `${note.content.substring(0, 120)}...` 
    : note.content;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col">
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-1">{note.title}</h3>
        
        <div className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
          {contentPreview}
        </div>
        
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Date info would go here if available */}
        {(note.createdAt || note.updatedAt) && (
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {note.updatedAt ? `Updated: ${formatDate(note.updatedAt)}` : `Created: ${formatDate(note.createdAt)}`}
          </div>
        )}
      </div>
      
      {/* Actions bar */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onView}
          className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          <Eye size={16} /> View Note
        </button>
        
        <div className="flex space-x-1">
          <button 
            onClick={onEdit}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Edit note"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this note?")) {
                onDelete();
              }
            }}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}