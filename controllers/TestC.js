'use strict';
const { getMaxListeners } = require('process');
const Item = require('../models/TestM')
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;
const { v4: uuidv4} = require('uuid');// const te = mongoose.model('Test', mongoose.Schema({
//     _id: String,
//     _nameTest: String
//   }));
  

async function ShowAllTest  (req, res, next)  {

    try {
        const items = await Item.find({});
        console.log('asyncHandlertest items: ' , items);
      
        return res.status(200).json({ success: true, data: items });
    }catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });
    }
}

async function ShowTestById (req, res, next)  {

    try {
        const {testId} = req.query
        const items = await Item.findOne({testId: testId});
        console.log('asyncHandlertest items: ' , items);
      
        return res.status(200).json({ success: true, data: items });
    }catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });
    }
}

async function ShowAllClasses (req, res, next)  {

    try {
        const items = await Item.find();
        console.log('asyncHandlertest items: ' , items);
        
        let result = items.reduce((prev, el) =>{
            if(prev.some(o => o.classId == el.classId  && o.ClasseName == el.ClasseName))
                 return prev;
            return [...prev, {classId:el.classId, ClasseName: el.ClasseName}]
        }, []);

        console.log('asyncHandlertest result: ' , result);
        return res.status(200).json({ success: true, data: result });
    }catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });
    }
}

async function ShowTestsByClassId (req, res, next)  {

    try {
        const {classId} = req.query

        const item = await Item.find({classId})
        console.log('asyncHandlertest items: ' , item);
      
        return res.status(200).json({ success: true, data: item });
    }catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });
    }
}

async function GradeCalculation (req, res, next)  {
    try {
    const {AnswerId} = req.query
    const items = await Item.findOne({testId: AnswerId});
    console.log('asyncHandlertest items: ' , items);
    return res.status(200).json({ success: true, data: items });
    }catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });
        }
}



// async function CreateTest (req, res, next)  {
//     try {
//         console.log("here update")
//         const body = req.body;
//         const question = body.question
//          console.log(question);
//          const item = await Item.create(question);
//     }catch (err) {
// 		console.log("the error is: "+err)
// 		console.log(err)
//         return res.status(400).json({ error: err });
//         }
// }
async function CreateTest (req, res, next)  {
    try {
        console.log("here update")
        const body = req.body;
        console.log('body', body);

        const test = body.data
        test.testId = uuidv4(); 
        test.questions.map(question => {
            question.questionId = uuidv4(); 

            question.ansers.map(awnsers => {
                awnsers.AnswerId = uuidv4(); 
                return awnsers;
            })

            return question;

        })

         const item = await Item.create(test);
        //console.log("testIdnew = " + body.data.testId);


        //const question = req.testId
        //console.log("question = " + question);
         return res.status(200).json({data: item})
    }catch (err) {
		console.log(err)
		console.log("the error is: "+err)
        return res.status(400).json({ error: err });
        }
}
 



module.exports = {
    ShowTestById,
    ShowAllClasses,
    ShowAllTest,
    ShowTestsByClassId,
    GradeCalculation,
    CreateTest
};