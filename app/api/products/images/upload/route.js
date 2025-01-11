import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../auth/[...nextauth]/route';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const POST = async (req) => {

    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        // Return a JSON response with the error message and appropriate status code
        return NextResponse.json(
            { error: error.message },
            { status: 403 } // Forbidden or adjust the status as necessary
        )
    }

    // If admin check passes, proceed to fetch categories

    const formData = await req.formData();
    const files = formData.getAll('files');
    const urls = [];

    if (!files.length) {
        return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
    }

    // Map over files to create an array of promises
    const uploadPromises = files.map(async (file) => {
        // Extract the file extension
        const fileExtension = file.name.split('.').pop();
        // Generate a unique file name
        const fileName = `${nanoid()}.${fileExtension}`;

        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file,  // Handle file directly; Upload will manage the stream
            ContentType: file.type,
            ACL: 'public-read',
        };

        try {
            // Use the Upload utility from lib-storage to handle the file stream
            const parallelUploads3 = new Upload({
                client: s3,
                params: uploadParams,
            });

            // Wait for the upload to complete
            await parallelUploads3.done();

            // Generate the file URL
            const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
            urls.push(fileUrl);
        } catch (error) {
            // console.error('S3 upload error:', error);
            throw new Error('File upload failed');
        }
    });

    try {
        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
        return NextResponse.json({ message: 'Files uploaded successfully', url: urls });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
