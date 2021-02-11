const dotenv = require("dotenv").config();

const { getTokenMyGes } = require("./getTokenMyGes");
const myGesAPI = require("./myGesApi");
const googleCalendar = require("./googleCalendar");





(async () => {


	let nbWeek = process.env.NUMBER_WEEK
	let date = await getDate(nbWeek)
	console.info("date : " , date)
	let MyGesEvents = await getListEventByMyGes(nbWeek)
	console.log("Number event find in MyGes : ", MyGesEvents.length)
	await setUpInCalendar(date,MyGesEvents)


})();

async function getDate(NbWeek){
	let currentDate = new Date()
	let startDate = getMonday(currentDate)
	console.log(Intl.DateTimeFormat().resolvedOptions().timeZone )
	let endDate = getSunday(currentDate)
	endDate.setDate(endDate.getDate(endDate)+7*NbWeek)
	return { startDate, endDate }
}

function getMonday(date) {
	d = new Date(date);
	var day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
	return new Date(d.setDate(diff));
}
function getSunday(date) {
	d = new Date(date);
	var day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? 1:7); // adjust when day is sunday
	return new Date(d.setDate(diff));
}


async function getListEventByMyGes(nbWeek){
	let TotalEvents= []
	console.info("Get token MyGes")
	let token = await getTokenMyGes()
	console.info("token find : " , token)
	console.info("process get calendar")
	await myGesAPI.getCurrentWeekCalendar(token)
	for (let i = 0; i < nbWeek; i++) {
		const week = await myGesAPI.getWeekCalendar(token)
		const events = week.events
		//console.log(weeks)
			for (let index = 0; index < events.length; index++) {
				const event = events[index];
				Object.assign(event, await myGesAPI.getInfoEventById(token,event.id))
				//console.log(event)
				TotalEvents.push(event)
			}
		await myGesAPI.getNextWeekCalendar(token)
	}
	
	return TotalEvents
}

async function setUpInCalendar(date,MyGesEvents) {
	//console.log('setUpInCalendar '+MyGesEvents)
	console.info("Press for Google Calendar")
	let auth = await googleCalendar.getAuthorize()
	let events = await googleCalendar.listEventsBetweenDate(auth,date);
	
	console.info("delete old events")
	await googleCalendar.deleteEvent(auth,events)
	console.info("Insert to google Calendar")
	await googleCalendar.insertEventByMyGes(auth,MyGesEvents)
	
}
