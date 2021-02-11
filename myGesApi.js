const axios = require('axios')
const qs = require('qs');
const xml2js = require('xml2js')
const HTMLParser = require('node-html-parser');
const URI = "https://www.myges.fr"
const parser = new xml2js.Parser({ explicitArray: false });


async function getWeekCalendar(token) {

    let data = qs.stringify({
        'javax.faces.partial.ajax': 'false',
        'javax.faces.source': 'calendar:myschedule',
        'javax.faces.partial.execute': 'calendar:myschedule',
        'javax.faces.partial.render': 'calendar:myschedule',
        'calendar:myschedule_start': 1612738800000,
        'calendar:myschedule_end': 1613343600000,
        'calendar:myschedule': 'calendar:myschedule',
        'calendar': 'calendar',
        'calendar:myschedule_view': 'agendaWeek',
        'javax.faces.ViewState': token.token
    });

    let config = {
        method: 'post',
        url: URI + '/student/planning-calendar',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `JSESSIONID=${token.sessionId};`
        },
        data: data
    };
    let response = await axios(config)
    let xml = await parser.parseStringPromise(response.data)

     let calendar = xml['partial-response']['changes']['update'][0]['_']
     let calendarParss = JSON.parse(calendar)
    return calendarParss
}

async function getCurrentWeekCalendar(token) {

    let data = qs.stringify({
        'javax.faces.partial.ajax': 'true',
        'javax.faces.source': 'calendar:nextMonth',
        'javax.faces.partial.execute': '@all',
        'javax.faces.partial.render': 'calendar:myschedule calendar:currentDate calendar:currentWeek calendar:campuses calendar:lastUpdate',
        'calendar': 'calendar',
        'javax.faces.ViewState': token.token,
        'calendar:myschedule_view': 'agendaWeek'
    });

    let config = {
        method: 'post',
        url: URI + '/student/planning-calendar',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `JSESSIONID=${token.sessionId};`
        },
        data: data
    };
    let response = await axios(config)





    return response.data
}

async function getNextWeekCalendar(token) {

    let data = qs.stringify({
        'javax.faces.partial.ajax': 'true',
        'javax.faces.source': 'calendar:nextMonth',
        'javax.faces.partial.execute': '@all',
        'javax.faces.partial.render': 'calendar:myschedule calendar:currentDate calendar:currentWeek calendar:campuses calendar:lastUpdate',
        'calendar:nextMonth': 'calendar:nextMonth',
        'calendar': 'calendar',
        'javax.faces.ViewState': token.token,
        'calendar:myschedule_view': 'agendaWeek'
    });

    let config = {
        method: 'post',
        url: URI + '/student/planning-calendar',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `JSESSIONID=${token.sessionId};`
        },
        data: data
    };
    let response = await axios(config)
    return response.data
}


async function getInfoEventById(token, id) {
    if(!id){
        throw new Error("no id")
        process.exit(1);
    }
    let data = qs.stringify({
        'javax.faces.partial.ajax': 'true',
        'javax.faces.source': 'calendar:myschedule',
        'javax.faces.partial.execute': 'calendar:myschedule',
        'javax.faces.partial.render': 'dlg1',
        'javax.faces.behavior.event': 'eventSelect',
        'javax.faces.partial.event': 'eventSelect',
        'calendar:myschedule_selectedEventId': id,
        'calendar': 'calendar',
        'calendar:myschedule_view': 'agendaWeek',
        'javax.faces.ViewState': token.token,
    });

    let config = {
        method: 'post',
        url: URI + '/student/planning-calendar',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `JSESSIONID=${token.sessionId};`
        },
        data: data
    };


    let response = await axios(config)
    let xml = await parser.parseStringPromise(response.data)

    let infoEvent = xml['partial-response']['changes']['update'][0]['_']

    let infoEventParssHtml = HTMLParser.parse(infoEvent)




    return getInfoInHtml(infoEventParssHtml)
}


async function getInfoInHtml(html) {

    const root = HTMLParser.parse(html)

    let list = ["matiere","intervenant","salle","type","modality"]

    let jsonInfoEvent= {}

    list.forEach(element => {
        let text = root.querySelector(`#${element}`).parentNode.parentNode.structuredText
        text = text.replace("\n", " ").replace("&amp;", "&").replace("&quot;", '"');
        Object.assign(jsonInfoEvent, { [`${element}`]: text})
    });

    return jsonInfoEvent;

}


module.exports = {
    getWeekCalendar: getWeekCalendar,
    getNextWeekCalendar: getNextWeekCalendar,
    getCurrentWeekCalendar: getCurrentWeekCalendar,
    getInfoEventById: getInfoEventById
}