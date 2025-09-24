const dotenv = require('dotenv');
const { Client: MinioClient } = require('minio');
const fs = require('fs');

dotenv.config();

const bucketName = process.env.MINIO_BUCKET_NAME;

const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});


// Upload to MinIO
const uploadFile = async (file, targetPath) => {
  const filePath = file.path;
  await minioClient.fPutObject(bucketName, targetPath, filePath);
  fs.unlinkSync(filePath); 
  return targetPath;
};

const deleteFile = async (filePath) => {
  await minioClient.removeObject(bucketName, filePath);
};

module.exports = { uploadFile, deleteFile };
