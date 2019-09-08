const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//this is the mongoDB database
const dbRoute = 'mongodb+srv://rfbrady:coheed@cluster0-tsbwl.mongodb.net/test?retryWrites=true&w=majority';

//connects our backend code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true});

let db = mongoose.connection;

db.once('open', () => console.log('connected to database'));

//checks if connection with database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error'));

//only made for logging
//bodyparse, parses request body to be a readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

//this is our get method
//this method fetches all available data in our database
router.get('/getData', (req,res) => {
	Data.find((err, data) => {
		if (err) return res.json({ success: false, error: err});
		return res.json({ success: true, data: data});
	});
});

//this is our update method
//this method overwrites existing data in our database
router.post('/updateData', (req,res) => {
	const {id, update} = req.body;
	Data.findByIdAndUpdate(id, update, (err) => {
		if (err) return res.json({ success:false, error:err});
		return res.json({success: true});
	});
});

//this is our create method
//use to add new data to database
router.post('/putData', (req, res) => {
	let data = new Data();
	const {id, message} = req.body;

	if ((!id && id!== 0) || !message){
		return res.json({
			success: false,
			error: 'INVALID INPUTS',
		});
	}
	data.message = message;
	data.id = id;
	data.save((err) => {
		if (err) return res.json({ success: false, error: err});
		return res.json({succes: true});
	});
});

// append /api for http requests
app.use('/api', router);

//launch backend to a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
