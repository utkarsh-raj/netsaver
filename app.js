const puppeteer = require('puppeteer');
const express = require('express');
const cron = require('node-cron');

const app = express();

function test() {
	async function session() {
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--use-fake-ui-for-media-stream']
		});
		const page = await browser.newPage();
		await page.goto('https://meetingsapac47.webex.com/meet/pr1657319592', {waitUntil: 'networkidle2'});
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
			await page.keyboard.type('Test', {delay: 200})
			await page.keyboard.press('Tab')
			await page.keyboard.type('utkarsh@iiitnr.edu.in', {delay: 200})
			await page.keyboard.press('Tab')
			await page.keyboard.press('Enter')
			await page.waitFor(5000)
			await page.keyboard.press('Enter')
			await page.waitFor(5000)
			await page.keyboard.press('Enter')
			await page.waitFor(10000)
			await page.keyboard.press('Enter')
			setTimeout(() => {}, 60000*60)
			await page.close()
		}
		catch {
			await page.close()
		}
		finally {
			await page.close()
		}
	};
	try {
		session();
		
	}
	catch {
		console.log("Error occured in the server.")
		res.send("Error occured")
		// session();
	}
}

// cron.schedule('30 9 * * 1-5', () => {test();})
app.get('/hello', (req, res) => {
	console.log('The hello route has started');
	test();
	res.json({"message": "The function is running"});
})

var port = process.env.PORT || 8000;

app.listen(port, process.env.IP, function (req, res) {
    console.log(`The Backend Service is running at the port ${port}`);
});