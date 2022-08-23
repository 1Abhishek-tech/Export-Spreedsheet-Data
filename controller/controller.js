var excelToJson = require('convert-excel-to-json');
const fs = require('fs')
const path = require('path')
const CandidateData = require('../model/CandidateData');

const upload_data = async (req, res) => { // upload file data to database

    console.log(req.file);
    const file = path.join(__dirname, '../public/uploads/' + req.file.filename)
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return res.status(400).json({
            message: 'Please upload a file'
        });
    }

    const excelData = excelToJson({
        sourceFile: file,
        sheets: [{
            name: 'Sheet1',
            // Header Row -> be skipped and will not be present at our result object.
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'name',
                B: 'email',
                C: 'mobile',
                D: 'dob',
                E: 'work_experience',
                F: 'resume_title',
                G: 'current_location',
                H: 'postal_address',
                I: 'current_employer',
                J: 'current_designation'
            }
        }]
    });
    // console.log(excelData.Sheet1);
    let result = [];
    excelData.Sheet1.forEach(async obj => {
        // console.log(obj)
        let user = await CandidateData.findOne({ email: obj.email })
        if (!user) {
            result.push(obj)
        }
        else {
            console.log('Email already exists : ', obj.email)
        }
    })
    await CandidateData.insertMany(result)
    fs.unlinkSync(file);

    res.status(200).json({
        message: 'File uploaded successfully'
    });

}

module.exports = {
    upload_data
}