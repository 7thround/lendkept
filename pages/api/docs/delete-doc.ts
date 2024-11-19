import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import { s3Client } from "../../../lib/s3-client";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'DELETE') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { docName } = req.query;

	if (!docName) {
		return res.status(400).json({ error: 'Missing doc key' });
	}

	try {

		const deleteParams = {
			Bucket: process.env.S3_BUCKET_NAME!, // Your S3 bucket name
			Key: docName as string, // The key for the file you want to delete
		};

		const deleteCommand = new DeleteObjectCommand(deleteParams);
		await s3Client.send(deleteCommand);

		return res.status(200).json({ message: 'File deleted successfully' });
	} catch (error) {
		console.error('Error deleting file:', error);
		return res.status(500).json({ error: 'Failed to delete file' });
	}
}
