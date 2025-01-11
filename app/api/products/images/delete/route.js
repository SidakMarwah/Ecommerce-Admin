import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/app/api/auth/[...nextauth]/route';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const DELETE = async (req) => {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 403 } // Forbidden
        );
    }

    const { fileNames } = await req.json();

    if (!Array.isArray(fileNames) || fileNames.length === 0) {
        return NextResponse.json({ message: 'An array of file names is required' }, { status: 400 });
    }

    // Map over fileNames to create an array of delete promises
    const deletePromises = fileNames.map((fileName) => {
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
        };
        return s3.send(new DeleteObjectCommand(deleteParams));
    });

    try {
        // Wait for all deletions to complete
        await Promise.all(deletePromises);
        return NextResponse.json({ message: 'Files deleted successfully' });
    } catch (error) {
        console.error('S3 delete error:', error);
        return NextResponse.json({ message: 'File deletion failed' }, { status: 500 });
    }
};
