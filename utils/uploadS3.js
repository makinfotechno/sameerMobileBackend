import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const uploadS3 = async (file, purchaseId, module) => {

    const s3client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Key: `${module}/${purchaseId}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
    })

    await s3client.send(command);

}