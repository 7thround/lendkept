import { useState } from "react";
import { formatDateWithTime } from "../utils";

const NotesSection = ({ notes, loanId, onAddNote, sender, onDeleteNote }) => {
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      setIsAdding(true);
      const note = {
        text: newNote,
        loanId: loanId,
        senderId: sender.id,
        createdAt: new Date(),
      };
      await onAddNote(note);
      setNewNote("");
      setIsAdding(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    setIsDeleting(true);
    await onDeleteNote(noteId);
    setIsDeleting(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
      <ul className="space-y-4">
        {notes?.map((note) => (
          <li key={note.id} className="border-b pb-4 last:border-none">
            <p className="text-gray-800 font-semibold">{note.sender.name}</p>
            <p className="text-gray-800 py-1">{note.text}</p>
            <p className="text-gray-500 text-sm">
              {formatDateWithTime(note.createdAt)}
            </p>
            {sender.id === note.senderId && (
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-500 text-sm hover:underline"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <textarea
          className="w-full p-3 border rounded"
          rows={3}
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          disabled={isAdding}
          onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
        ></textarea>
        <button
          onClick={handleAddNote}
          className="mt-3 px-4 py-2 bg-[#e74949] text-white rounded hover:brightness-110"
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add Note"}
        </button>
      </div>
    </div>
  );
};

export default NotesSection;
