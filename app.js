const puppeteer = require('puppeteer');
const express = require('express');
const cron = require('node-cron');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const timeout = require("connect-timeout");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(timeout("60s"));
app.use(express.static("public"));
dotenv.config();
mongoose.connect(
	"mongodb+srv://" + process.env.DBUSER + ":" + process.env.DBPASSWORD + ":@cluster0-0cl3l.mongodb.net/test?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

const userSchema = new mongoose.Schema({
	name: {type: String},
	password: {type: String},
	sessions: {type: Array},
});

const User = mongoose.model("User", userSchema);

function joinSession(name, email, duration, id) {
	async function session() {
		const browser = await puppeteer.launch({
			// headless: false,
			// executablePath: '/usr/bin/google-chrome',
			args: ['--no-sandbox', '--use-fake-ui-for-media-stream']
		});
		const page = await browser.newPage();
		await page.goto(id, {waitUntil: 'networkidle2'});
		try {
			await page.waitForSelector('#smartJoinButton');
			await page.click('#smartJoinButton');
		}
		catch {
			session()
		}
		try {
			await page.waitForSelector('input', {timeout: 10000});
		}
		catch {
			console.log('Most likely the element is loaded')
		}
		try {
			await page.keyboard.type(name, {delay: 200})
			await page.keyboard.press('Tab')
			await page.keyboard.type(email, {delay: 200})
			await page.keyboard.press('Tab')
			await page.keyboard.press('Enter')
			await page.waitFor(5000)
			await page.keyboard.press('Enter')
			await page.waitFor(5000)
			await page.keyboard.press('Enter')
			await page.waitFor(10000)
			await page.keyboard.press('Enter')
			await page.waitFor(duration*1000)
			await page.close()
		}
		catch {
			await page.close()
			res.render("fallback");
		}
		finally {
			await page.close()
			res.render("fallback");
		}
	};
	try {
		session();
		
	}
	catch {
		console.log("Error occured in the server.")
		res.render("fallback");
		// session();
	}
}

// cron.schedule('30 9 * * 1-5', () => {test();})
app.post('/joinSession/:user_id', (req, res) => {
	const userId = req.params.user_id;
});

app.post('/joinSession', (req, res) => {
	console.log(req.body);
	const {name, email, duration, id} = req.body;
	joinSession(name, email, duration, id);
	res.render("joined");
})

app.get('/', (req, res) => {
	res.render("index");
})

var port = process.env.PORT || 8000;

app.listen(port, process.env.IP, function (req, res) {
    console.log(`The Backend Service is running at the port ${port}`);
});