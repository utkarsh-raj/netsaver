const puppeteer = require('puppeteer');
const cron = require('node-cron');

function test() {
	async function session() {
		const browser = await puppeteer.launch({
			headless: false,
			executablePath: '/usr/bin/google-chrome',
			args: ['--no-sandbox', '--use-fake-ui-for-media-stream']
		});
		const page = await browser.newPage();

		await page.goto('https://meetingsapac47.webex.com/meet/pr1657319592', {waitUntil: 'networkidle2'});

		await page.waitForSelector('#smartJoinButton');
		await page.click('#smartJoinButton');

		// const response = Promise.all([
		// 		page.waitForNavigation({waitUntil: 'domcontentloaded'}),
		// 		page.keyboard.type('Hello'),
		// 	]);

		try {
			await page.waitForSelector('input', {timeout: 5000});
		}
		catch {
			console.log('Most likely the element is loaded')
		}


		await page.keyboard.type('Utkarsh', {delay: 200})
		await page.keyboard.press('Tab')
		await page.keyboard.type('test@gmail.com', {delay: 200})
		await page.keyboard.press('Tab')
		await page.keyboard.press('Enter')
		// setTimeout(() => {console.log('Waiting for nav')}, 5000)
		// await page.waitForNavigation({waitUntil: 'domcontentloaded'})
		await page.waitFor(3000)
		await page.keyboard.press('Enter')
		// setTimeout(() => {console.log('Waiting for nav')}, 5000)
		await page.waitFor(3000)
		await page.keyboard.press('Enter')


		
		

	};
	// session().then((data) => {
	// 	console.log("Check", data);
	// 	if (data === null) {setTimeout(test, 1000)};
	// });
	session();
}

cron.schedule('30 9 * * 1-5', () => {test();})
// test();