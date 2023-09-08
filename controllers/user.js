'use strict';
const { getMaxListeners } = require('process');
const Item = require('../models/user')
const {user} = require('../models/user')

const Test = require('../models/TestM');
const mongoose = require('mongoose'),
	crypto = require('crypto'),
	defaultAdd = require('./index').default_add,
	q = require('q'),
{KJUR} = require('jsrsasign');
const ObjectId = require('mongoose').Types.ObjectId;

console.log('userModel',Item)


// function addUser(User, data = {}) {
// 	const item = Item.create(User);
// 		emailFilter = data.email ? [{email: data.email}] : [],
// 		filter = {$or: [...(emailFilter), ...(phoneFilter), ...(tzFilter)]}
// 	return new Promise((resolve, reject) =>
// 		User.findOne(filter)
// 		.then(user => {
// 			if (user) reject({message: 'user already exists', code: 422});
// 			resolve({data, toDefault: true})
// 		}).catch(reject)
// 	)
// }


// exports.addUser = asyncHandler(async (req, res, next) => {
//     const item = await Item.create(req.body);
//     res.status(201).json({
//         success: true,
//         data: item
//     });
// }
// );

async function  asyncHandler (req, res, next)  {
	console.log('hooo11');
   console.log(req.body);
   const body = req.body;
   const data = {
		email : body.email,
		name: body.name,
		password: body.password 
	}
	console.log(data);
	const item = await Item.create(data);
 
}

exports.addUser = asyncHandler;





exports.add = asyncHandler;


async function asyncHandlerLogin (req, res, next)  {

    try {
		const {email, password } = req.body;
        //const items = await Item.find({email});
		console.log('asyncHandlerLogin email: ' , email);
		console.log('asyncHandlerLogin password: ' , password);

		const items = await Item.findOne({email}).exec();

		console.log('asyncHandlerLogin items: ' , items);
		console.log('asyncHandlerLogin items.password: ' , items. password);
		console.log('asyncHandlerLogin items.email: ' , items.email);

		const isVaild = Item.validPassword(password,items.password)
		console.log('asyncHandlerLogin isVaild: ' , isVaild);

        if (!items || !items.password || !password || !isVaild) {
            return res.status(404).json({ success: false });
        }
        return res.status(200).json({ success: true, data: items });
    } catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });


    }

};

exports.loginUser = asyncHandlerLogin;

async function findUser (req, res, next)  {
	try {
		const {email, password } = req.body;

		console.log('findUser body',req.body)
		
		console.log('findUser email: ' , email);
		
		const user =  await Item.findOne({email}).exec();
		console.log('findUser user: ' , user);

		return res.status(200).json({result: user}); 

	}catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });

	}
};
exports.findUser = findUser;

async function checkGrade (req, res, next)  {
	try {
		const {email, testId , testAnser} = req.body;
		console.log('checkGrade',req.body)
		const checkGradeUser = await Item.findOne({email}).exec();
		const test = await Test.findOne({testId}).exec();
		console.log('checkGrade user: ' , checkGradeUser);
		console.log('checkGrade test: ' , JSON.stringify(test));
		console.log('testAnser' , testAnser);

		let counterRightansers = 0;

		Object.entries(testAnser).map(([key, value]) => {
			console.log('[key, value]',[key, value])
			if(!value || (Array.isArray(value) && !value.filter(item => item).length)) return;
			const currQuestion = test.questions.find(question => question.questionText === key);
			console.log('currQuestion',currQuestion)

			if(currQuestion) {
				const currAnser = currQuestion.ansers.filter(anser => {
					if(!Array.isArray(value)) return anser.AnswerText === value
					const result = value.find(currValue => {
						console.log('currValue',currValue)
						console.log('anser.AnswerText',anser.AnswerText)
						return currValue === anser.AnswerText
					})
					console.log('result',result);
					return result
				})
				
				console.log('currAnser1',currAnser)
				if(currAnser.every(item => item && item.isTrue)){
					counterRightansers++;
					console.log('counterRightansers',counterRightansers)
				}
			}

		});

		const newGrade =		{ 
			testId,
			grade: (counterRightansers / Object.entries(testAnser).length) * 100,
			testName:test.testName,
			ClasseName:test.ClasseName,
			classId: test.classId,
			dateTest: new Date().toLocaleString()
			
		}
		console.log('newGrade',newGrade)
		console.log('checkGradeUser',checkGradeUser)

		checkGradeUser.grades = [
			...checkGradeUser.grades,
			newGrade]

		// console.log('user.grades',user.grades)
		console.log('userModel',Item)

		const result = await checkGradeUser.save();
	    return res.status(200).json({result}); 

	}catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });

	}
};
exports.checkGrade = checkGrade;

async function asyncHandlerGrade (req, res, next)  {
	try {
		const {email, password } = req.body;

		const USER_GREDE = await Item.findOne({email}).exec();
		const GRADE= await Item.find({grades}.exec());
		console.log('asyncHandlerLogin items: ' , GRADE);
		console.log('asyncHandlerLogin items: ' , USER_GREDE);
		console.log('asyncHandlerLogin items.password: ' , USER_GREDE. password);
		console.log('asyncHandlerLogin items.email: ' , USER_GREDE.email);

	}catch{
		console.log(err)
        return res.status(400).json({ error: err });

	}
};
exports.UserGrade = asyncHandlerGrade;


async function asyncHandlerGetUsers (req, res, next)  {

    try {
		

		const items = await Item.find().exec();


        if (!items) {
            return res.status(404).json({ success: false });
        }
        return res.status(200).json({ success: true, data: items });
    } catch (err) {
		console.log(err)
        return res.status(400).json({ error: err });


    }

};

exports.getUser = asyncHandlerGetUsers;














const filter = function (User, {filter = {}, search, skip = 0, limit = 50, keys = [], sort = {}}) {

	const dotenv = require('dotenv');
	dotenv.config();
	const {paths} = User.schema;
	const types = {};
	Object.keys(paths)
	.filter(property => paths[property].selected !== false)
	.map(property => {
		const p = property.split('.');
		types[p[0]] = (p[1] ? 'Object' : paths[property].instance);
	});
	keys = keys.filter(k => types[k]).join(' ');
	if (search) filter = helper.searchFilter(search, paths);
	if (Object.keys(filter).includes('studyingScheduleID')) {
		let _id = filter.studyingScheduleID.toString();
		filter = {...filter, studyingScheduleID: new ObjectId(_id)}
	}
	let Aggregate = User.aggregate([
		{
			$match: filter
		}
	]);
	let promises = [];
	Aggregate.project({
		name: '$name',
		email: '$email',
		perm: '$perm',
		registedDate: '$registedDate',
		testsNum: {$cond: {if: {$isArray: "$tests"}, then: {$size: "$tests"}, else: 0}},
		studyingScheduleID: "$studyingScheduleID",
		credits: "$credits",
		studyPlace: "$studyPlace",
		tests: '$tests'
	});
	Aggregate.lookup({
		from: 'studying_schedules',
		localField: 'studyingScheduleID',
		foreignField: '_id',
		as: 'studyingSchedule'
	})
	if (!isEmptyObject(sort)) {
		Aggregate.sort(sort);
	}
	Aggregate.skip(skip);
	Aggregate.limit(limit);
	promises.push(Aggregate);
	promises.push(User.count(filter));

	return q.all(promises)
	.then(async ([users, count]) => {
		for (const _user of users) {
			_user.average = getUserTestAvg(_user.tests)
			if ((_user.studyingScheduleID || 0).toString() === process.env.VEHAAREV_NA_STUDYING_SCHDULE_ID)
				_user.credits = await SumCreditsService.getUserCredit(_user.tests, _user._id);
			delete _user.tests
		}
		if (sort.average)
			users.sort((_user1, _user2) => {
				if (_user1.average < _user2.average)
					return -1 * sort.average
				if (_user1.average > _user2.average)
					return 1 * sort.average
				return 0;
			})
		return q({data: users, info: {count, types}});
	})
	.catch(err => q.reject(err));


};

exports.filter = filter;


