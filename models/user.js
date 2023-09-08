'use strict';
const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcryptjs'),
	SALT_WORK_FACTOR = 10;

	const gradesSchema = new Schema({		
		testId: String,
		testName: String,
		classId:Number,
		ClasseName:String,
		grade:Number,
		dateTest: String})
const UserSchema = new Schema({
	name: {first: {
			type: String,
			required: false,},
		last: {
			type: String,
			required: false,}},
	password: {
		type: String,
		required: false,},
	email: {
		type: String,
		required: false,
		dropDups: true,
		unique: true,
		index: true},
	grades:{
		type: [gradesSchema],
		required: false}});


UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err);


		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err);
			this.password = hash;
			next();
		});
	});
});

UserSchema.pre('update', function (next) {
	if (!this._update.password) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err);
			this.password = hash;
			next();
		});
	});
});


UserSchema.methods.validPassword = (password, thisPass) => bcrypt.compareSync(password, thisPass);
UserSchema.statics.userStudySchedule = function ({ filter = {}, search,limit = 5000 }) {
	if (search) filter = helper.searchFilter(search, UserSchema.paths);
	return this.find(filter).limit(limit).populate("studyingScheduleID");
};

// all the 'pre' function must before the model function
const userModel = mongoose.model('user', UserSchema);

userModel.validPassword = (password, thisPass) => bcrypt.compareSync(password, thisPass);

module.exports = userModel;