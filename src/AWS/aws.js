const S3 = require("aws-sdk/clients/s3")
const s3=new S3({
    accessKeyId: process.env.KEYID,
    secretAccessKey: process.env.SECRETKEY,   
    region:"ap-northeast-1"
})

        function uploadFile(file){
            console.log(".......12")
            console.log(file.path, ' ...file path')
    const uploadParams={
        Bucket:"daybed-resources",
        Body:file,
        Key:file.originalname,
        Body: file.buffer
    }
    console.log(uploadParams, ' ......upload params')
    return s3.upload(uploadParams).promise()
}
module.exports.uploadFile=uploadFile
