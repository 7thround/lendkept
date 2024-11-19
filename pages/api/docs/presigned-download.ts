import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextApiRequest, NextApiResponse } from 'next';

import { s3Client } from "../../../lib/s3-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { fileKey } = req.query;

	if (!fileKey) {
		return res.status(400).json({ error: 'Missing fileKey' });
	}

	try {

		const uploadParams = {
			Bucket: process.env.S3_BUCKET_NAME!,
			Key: fileKey as string,
		};

		const command = new GetObjectCommand(uploadParams);
		const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

		return res.status(200).json({ signedUrl });
	} catch (error) {
		console.error('Error generating pre-signed Download URL:', error);
		return res.status(500).json({ error: 'Failed to generate pre-signed URL' });
	}
}
