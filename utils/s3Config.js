import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const uploadS3Object = async (file, key, module) => {

    const s3client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Key: `${module}/${key}`,
        Body: file.buffer,
        ContentType: file.mimetype
    })
    await s3client.send(command);
}

export const getS3Objects = async (s3key) => {

    const s3client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })

    console.log("getS3Objects called with key:--", s3key);


    if (!s3key) return null;

    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: s3key,
    });

    return getSignedUrl(s3client, command, { expiresIn: 300 }); // valid for 5 minutes only 
};


export const deleteS3Object = async (key) => {
  if (!key) return;

  const s3client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET,
    Key: key,
  });

  await s3client.send(command);
};
