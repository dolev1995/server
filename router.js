'use strict';
const defaultController = require("./controllers/user"),
	path = require('path'),
	multer = require('multer'),
	upload = multer({dest: 'uploads/'}),
	User = require('./models/user'),
	fs = require("fs")

	const testController = require("./controllers/TestC");



	

const router = (app, express) => {

	// API
	// ==============================================
	app.post('/api/:collection/:action*?', (req, res) => {
		console.log('/api/:collection/:action')
		const {action} = req.params,
			funcName = action || "add";
		apiHandler(req, res, funcName, req.body);
	});
	
	// app.get('/test', (req, res) => {
	// 	console.log('/test')

	// 	defaultController.addUser(req,res).then(() => res.status(200).send({}));

	// });
	app.post('/user/add/test', (req, res) => {
		console.log('/user/add/test')
		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		defaultController.addUser(req,res).then(() => res.status(200).send({}));

	});

	app.post('/user/check/test', (req, res) => {
		console.log('/user/check/test')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return defaultController.checkGrade(req,res)//.then(() => res.status(200).send({}));

	});
	app.post('/user/check/test/grade', (req, res) => {
		console.log('/user/check/test/grade')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return defaultController.findUser(req,res) //.then(() => res.status(200).send({}));

	});

	app.post('/user/login/test', (req, res) => {
		console.log('/user/login/test')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return defaultController.loginUser(req,res)//.then(() => res.status(200).send({}));

	});
	app.get('/ShowAllTest', (req, res) => {
		console.log('/ShowAllTest')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return testController.ShowAllTest(req,res)//.then(() => res.status(200).send({}));

	});

	app.get('/ShowAllTest', (req, res) => {
		console.log('/ShowAllTest')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return testController.Test(req,res)//.then(() => res.status(200).send({}));

	});

	app.get('/ShowAllClasses', (req, res) => {
		console.log('/ShowAllClasses')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return testController.ShowAllClasses(req,res)//.then(() => res.status(200).send({}));

	});

	app.get('/ShowTestsByClassId', (req, res) => {
		console.log('/ShowTestsByClassId')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return testController.ShowTestsByClassId(req,res)//.then(() => res.status(200).send({}));

	});
	app.get('/ShowTestById', (req, res) => {
		console.log('/ShowTestById')

		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return testController.ShowTestById(req,res)//.then(() => res.status(200).send({}));

	});
	


	app.get('/test', (req, res) => {
		console.log("/test");
		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return testController.Test(req,res)//.then(() => res.status(200).send({}));

	});
	app.get('/ShowGrade', (req, res) => {
		console.log("/ShowGrade");
		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return defaultController.UserGrade(req,res)//.then(() => res.status(200).send({}));

	});



	app.post('/CreateTest', (req, res) => {

		try{
		console.log("/CreateTest");
		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		// testController.CreateTest(req,res).then(() => res.status(200).send({}));



		return testController.CreateTest(req,res);
		}
		catch(e){
			console.log(e);
		}
	});

	app.get('/GradeCalculation', (req, res) => {
		console.log("/GradeCalculation");
		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return testController.Test(req,res)//.then(() => res.status(200).send({}));

	});

	app.get('/Getuser', (req, res) => {
		console.log("Getuser ");
		// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

		return defaultController.getUser(req,res)//.then(() => res.status(200).send({}));

	});
	// app.get('/GetuserNames', (req, res) => {
	// 	console.log("GetuserNames ");
	// 	// res.header("Access-Control-Allow-Origin", "http://localhost:3000,localhost:3000,http://localhost:3001,localhost:3001");

	// 	return defaultController.GetuserNames(req,res)//.then(() => res.status(200).send({}));

	// });



	const apiHandler = (req, res, funcName, data) => {
		try {
			let useDefaultController = true, controller;
			const {collection} = req.params,
				model = (collection === 'general' ? data : require(`./models/${collection}`));
			//are controller and action exist? if yes rum them else run default controller
			console.log("*******func isss = "+ funcName);
			if (fs.existsSync(`./controllers/${collection}.js`)) {
				controller = require(`./controllers/${collection}`);
				if (typeof controller[funcName] === "function") {
					useDefaultController = false;
					controller[funcName](model, data).then(result => {
						if (!result.toDefault)
							return res.status(200).send(result);
						//run default controller again
						defaultController[`default_${funcName}`](model, result.data).then(result => {
							res.status(200).send(result)
						}).catch(err => {
							if (!err.code || err.code >= 500)
								printError(err, req);
							res.status(err.code || 500).send(err)
						});


					}).catch(err => {
						if (!err.code || err.code >= 500)
							printError(err, req);
						res.status(err.code || 500).send(err)
					});
				}
			}

			if (useDefaultController) {
				defaultController[`default_${funcName}`](model, data).then(result => {
					res.status(200).send(result)
				}).catch(err => {
					if (!err.code || err.code >= 500)
						printError(err, req);
					res.status(err.code || 500).send(err)
				});
			}

		} catch (err) {
			if (!err.code || err.code >= 500)
				printError(err, req);
			res.status(err.code || 500).send({"error": "שגיאה כללית"})
		}
	};

};






    const printError = (e, req) => {
        console.error(`Error: ${new Date().toLocaleString()} : ${e.message}.\n stack: ${e.stack} \n  GET params: ${JSON.stringify(req.params)} \n POST parmars: ${JSON.stringify(req.body)}`)
    };


    module.exports = router;