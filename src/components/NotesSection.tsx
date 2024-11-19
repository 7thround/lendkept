import { useState } from "react";
import { formatDateWithTime } from "../utils";
import FileUploader from "./FileUploader";
const NotesSection = ({ notes, loanId, onAddNote, sender, onDeleteNote }) => {
	const [newNote, setNewNote] = useState("");
	console.log('rendered notest section')

	const [isAdding, setIsAdding] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	let hasFiles = false;
	const handleAddNote = async () => {
		if (newNote.trim()) {
			setIsAdding(true);

			// Prepare the note object (we can set default values for docLink and docName here)
			const note = {
				text: newNote,
				loanId: loanId,
				senderId: sender.id,
				docName: '',  // default empty value
				createdAt: new Date(),
			};

			// If there is a file, handle file upload
			if (file) {
				const reader = new FileReader();

				reader.onload = async (event) => {
					const fileData = event.target?.result;

					if (file && fileData) {
						try {
							const presignedURL = new URL('/api/docs/presigned-upload', window.location.href);
							presignedURL.searchParams.set('fileName', file.name);
							presignedURL.searchParams.set('contentType', file.type);

							// Fetch the pre-signed URL for the file upload
							const res = await fetch(presignedURL.toString()).then((res) => res.json());

							const body = new Blob([fileData], { type: file.type });
							console.log("signedUrl:", res.signedUrl.split('?')[0]);

							// Upload the file to S3 using the pre-signed URL
							await fetch(res.signedUrl, {
								body,
								method: 'PUT',
							});

							console.log("File upload completed", res.signedUrl);

							// Update the note with file details after successful upload
							note.docName = file.name;  // Store the file name
							console.log('note to add:', note);
							// Proceed to add the note with the file details
							await onAddNote(note);
							setFile(null);
						} catch (error) {
							console.error("Error uploading file:", error);
						}
					}
				};

				// Read the file if it exists
				reader.readAsArrayBuffer(file);
			} else {
				// If no file, just proceed to add the note immediately
				await onAddNote(note);
			}

			// Reset the form after the note is added
			setNewNote("");
			setIsAdding(false);
		}
	};


	const handleDeleteNote = async (noteId, docName) => {
		setIsDeleting(true);
		await onDeleteNote(noteId, docName);
		setIsDeleting(false);
	};
	const downloadFile = async (fileKey) => {
		try {
			const presignedURL = new URL('/api/docs/presigned-download', window.location.href);
			presignedURL.searchParams.set('fileKey', fileKey);

			// Fetch the pre-signed URL for the file upload
			const res = await fetch(presignedURL.toString()).then((res) => res.json());
			if (res.signedUrl) {
				window.location.href = res.signedUrl; // Open the URL in the browser
			}
			console.log("signedUrl for Download:", res.signedUrl);


		} catch (error) {
			console.error("Error generating download link:", error);
		}
	};

	return (
		<div className="flex flex-row gap-2">
			<div className="flex-1 bg-white shadow rounded-lg p-4">

				<h2 className="text-xl font-bold text-gray-900 mb-4">Files</h2>
				<ol className="list-decimal space-y-4">
					{

						notes?.map((note) => {
							if (note.docName) { hasFiles = true }
							return (
								note.docName &&

								<li key={note.id} className="border-b pb-4 ms-3 last:border-none">
									<p className=" text-gray-800 py-1">
										<span onClick={() => downloadFile(note.docName)} className="underline" style={{ cursor: "pointer" }}>{note?.docName}</span>.
									</p>
								</li>
							)
						})}
				</ol>
				{!hasFiles && <p className="text-gray-800 py-1">No files attached.</p>}
			</div>
			<div className="bg-white shadow rounded-lg p-4 flex-5">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>

				<ul className="space-y-4">
					{notes?.map((note) => {
						return (
							<li key={note.id} className="border-b pb-4 last:border-none">
								<p className="text-gray-800 font-semibold">{note.sender.name}</p>
								<p className="text-gray-800 py-1">{note.text}</p>
								{note.docName &&
									<p className=" text-gray-800 py-1">
										Attachment: <span onClick={() => downloadFile(note.docName)} className="underline" style={{ cursor: "pointer" }}>{note?.docName}</span>.
									</p>
								}
								<p className="text-gray-500 text-sm">
									{formatDateWithTime(note.createdAt)}
								</p>
								{sender.id === note.senderId && (
									<button
										onClick={() => handleDeleteNote(note.id, note?.docName)}
										className="text-red-500 text-sm hover:underline"
									>
										{isDeleting ? "Deleting..." : "Delete"}
									</button>
								)}
							</li>
						)
					})}
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
					<FileUploader setFile={setFile} file={file} />
					<button
						onClick={handleAddNote}
						className="mt-3 px-4 py-2 bg-[#e74949] text-white rounded hover:brightness-110"
						disabled={isAdding}
					>
						{isAdding ? "Adding..." : "Add Note"}
					</button>
				</div>
			</div>
		</div>

	);
};

export default NotesSection;
