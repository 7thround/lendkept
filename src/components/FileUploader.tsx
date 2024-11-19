import { useDropzone } from "react-dropzone";

const FileUploader = ({ setFile, file }) => {
	const onDrop = async (files: File[]) => {
		const file = files[0];
		setFile(file);

	};

	const { getRootProps, getInputProps } = useDropzone({
		onDrop, accept: {
			'application/msword': ['.doc'], // for .doc files
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], // for .docx files
			'application/pdf': ['.pdf'], // for .pdf files
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], // for .xlsx files
			'application/vnd.ms-excel': ['.xlx'], // for .xlx files
			'text/plain': ['.txt'], // for .txt files
		}
	});

	return (
		<div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg">
			<input {...getInputProps()} />
			<p>Drag & drop a file here, or click to select one</p>
			{file && (
				<p className="mt-4">
					Selected file: {file?.name}.
				</p>
			)}
		</div>
	);
}

export default FileUploader