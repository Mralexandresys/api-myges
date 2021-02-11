const puppeteer = require('puppeteer');

async function getTokenMyGes() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://www.myges.fr/');
	// await page.waitForNavigation()
	await Promise.all([
		page.click('a.btn-lg.btn.btn-blue'),
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
	]);

	//console.log(await page.url())

	await page.$eval('input[name=username]', (el,userName) => el.value = userName,process.env.USER_LOGIN);
	await page.$eval('#password', (el,userPassword) => el.value = userPassword, process.env.USER_PASSWORD);

	await Promise.all([
		page.click('input[name=submit]'),
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
	]);

	let cookies = await page.cookies();
	let sessionId = cookies.find(element => element.name === "JSESSIONID").value;
	//const client = await page.target().createCDPSession();
	//await page.screenshot({ path: 'example.png' });
	//console.log((await client.send('Network.getAllCookies')).cookies)
	let token = await page.$eval('input[name=\'javax.faces.ViewState\']', el => el.value);

	await browser.close();
	return {
		sessionId: sessionId,
		token: token
	};
}
exports.getTokenMyGes = getTokenMyGes;
