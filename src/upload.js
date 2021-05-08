const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async event => {
    console.log(event);


    let response = {
        statusCode: 200,
        body: JSON.stringify({message: "Successfuly uploaded file"})
    }

    try {
        const parsedBody = JSON.parse(event.body);
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString()}.jpeg`, // Putting date in object name is a good idea
            Body: decodedFile,
            ContentType: "image/jpeg"
        }

        const uploadResult = await s3.upload(params).promise();

    } catch(e) {
        response = {
            statusCode: 500,
            body: JSON.stringify({message: "File failed to upload", error: e})
        }
    }

    return response;
}