'use strict';
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const ansersSchema = new Schema({		
	AnswerId:String,
	AnswerText:String,
	isTrue:Boolean
})


const TestSchema = new Schema({
	testId: String,
	testName: String,
	classId:Number,
	ClasseName:String,
	questions:{
		type:Array,
		questionId:String,
		questionText:String,
		ansers:[ansersSchema]
	}
});
 


const testModel = mongoose.model('Test', TestSchema, 'Test');
module.exports = testModel;
