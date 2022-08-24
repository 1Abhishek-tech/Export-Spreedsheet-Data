var excelToJson = require('convert-excel-to-json');
const fs = require('fs')
const path = require('path')
const CandidateData = require('../model/CandidateData');
const async = require('async');

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
    var result = [];
    async.eachSeries(excelData.Sheet1, function (item, callback) {
        CandidateData.findOne({ email: item.email }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                if (data) {
                    console.log('data already exists');
                    callback();
                } else {
                    const candidateData = new CandidateData({
                        name: item.name,
                        email: item.email,
                        mobile: item.mobile,
                        dob: item.dob,
                        work_experience: item.work_experience,
                        resume_title: item.resume_title,
                        current_location: item.current_location,
                        postal_address: item.postal_address,
                        current_employer: item.current_employer,
                        current_designation: item.current_designation
                    });
                    candidateData.save(function (err) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            result.push(item);
                            callback();
                        }
                    },
                    );
                }
            }
        }
        );
    }, function (err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: 'Some error occurred'
            });
        } else {
            res.status(200).json({
                message: 'File uploaded successfully',
                data: result
            });
        }
    }
    );
    fs.unlinkSync(file);
}

module.exports = {
    upload_data
}