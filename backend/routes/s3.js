const {GetObjectCommand, PutObjectCommand, S3Client} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});


const router = new express.Router();
const client = new S3Client();


router.get("/download-before-image", async (req, res, next) => {

    const params = {
        bucket: "tasker-tyckaf4h614d3cryjaesfgnc1g5fouse2a-s3alias",
        key: `before-images/${req.query.params.data.userId}/${req.query.params.data.key}`,
    }

    const createPresignedUrlWithClient = async ({bucket, key}) => {

        const command = new GetObjectCommand(
            {
                Bucket: bucket, 
                Key: key
            }
        );
        
        const res = await getSignedUrl(client, command, {expiresIn: 3600});
        return res;
      };
     
    try{

    const preSignedUrl = await createPresignedUrlWithClient(params);
    return res.status(200).json({preSignedUrl});

    }catch(err){
        return next(err);
    }

} );

router.get("/download-after-image", async (req, res, next) => {


    const params = {
        bucket: "tasker-tyckaf4h614d3cryjaesfgnc1g5fouse2a-s3alias",
        key: `after-images/${req.query.params.data.userId}/${req.query.params.data.key}`,
    }

    const createPresignedUrlWithClient = async ({bucket, key}) => {
  
        const command = new GetObjectCommand(
            {
                Bucket: bucket, 
                Key: key
            }
        );
        
        const res = await getSignedUrl(client, command, {expiresIn: 3600});
        return res;
      };
  
    try{
        
        const preSignedUrl = await createPresignedUrlWithClient(params);
        return res.status(200).json({preSignedUrl});

    }catch(err){
        return next(err);
    }
} );

router.post("/upload-before-image/:userId", upload.single("image"), async (req, res, next) => {
    const {file} = req;
    const {userId} = req.params;
    

    if(!file){
        console.error("Must pass a valid file to handler.")
        return res.status(400).json({message: "Bad request on upload-before-image route"})
    }

    try {
        
        const params = {
            Body: file.buffer,
            Bucket: "tasker-tyckaf4h614d3cryjaesfgnc1g5fouse2a-s3alias",
            Key: `before-images/${userId}/${file.originalname}`,
        }

        const resp = await client.send(new PutObjectCommand(params));
        return res.status(200).json({resp});

    }catch(err) {
        return next(err);
    }
    
    
} );

router.post("/upload-after-image/:userId", upload.single("image"), async (req, res, next) => {
    
    const {file} = req;
    const {userId} = req.params;
    

    if(!file){
        console.error("Must pass a valid file to handler.")
        return res.status(400).json({message: "Bad request on upload-before-image route"})
    }

    try {
        
        const params = {
            Body: file.buffer,
            Bucket: "tasker-tyckaf4h614d3cryjaesfgnc1g5fouse2a-s3alias",
            Key: `after-images/${userId}/${file.originalname}`,
        }

        const resp = await client.send(new PutObjectCommand(params));
        return res.status(200).json({resp});

    }catch(err) {
        return next(err);
    }
    
} );

module.exports = router;