import { useState } from "react";
import { formatDateWithTime } from "../utils";

const NotesSection = ({ notes, loanId, onAddNote, sender }) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = async () => {
    if (newNote.trim()) {
      const note = {
        text: newNote,
        loanId: loanId,
        senderId: sender.id,
        createdAt: new Date(),
      };

      // Call the function to add the note
      await onAddNote(note);

      setNewNote("");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg pt-2 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
      <ul className="space-y-4">
        {notes?.map((note, index) => (
          <li
            key={note.id}
            className={` ${
              index !== notes.length - 1 ? "border-b pb-4" : "pb-2"
            }`}
          >
            <p className="text-gray-800 font-semibold">{note.sender.name}</p>
            <p className="text-gray-600">{note.text}</p>
            <p className="text-gray-500 text-sm">
              {formatDateWithTime(note.createdAt)}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <textarea
          className="w-full p-2 border rounded focus:outline-none focus:ring"
          rows={3}
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        ></textarea>
        <button
          onClick={handleAddNote}
          className="mt-2 px-4 py-2 bg-[#e74949] text-white rounded hover:bg-[#e74949]"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

export default NotesSection;
