// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3 = new S3Client({ region: "ap-south-1" });

// export const getSignedUrls = async (req, res) => {
//   const { purchaseId, files } = req.body;

//   const urls = await Promise.all(
//     files.map(async (file) => {
//       const command = new PutObjectCommand({
//         Bucket: "mobile-purchases",
//         Key: `purchases/${purchaseId}/${file.key}`,
//         ContentType: file.type
//       });

//       const url = await getSignedUrl(s3, command, { expiresIn: 300 });

//       return {
//         key: file.key,
//         uploadUrl: url,
//         finalUrl: `https://mobile-purchases.s3.amazonaws.com/purchases/${purchaseId}/${file.key}`
//       };
//     })
//   );

//   res.json({ urls });
// });
