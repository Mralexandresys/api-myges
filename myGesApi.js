const axios = require('axios')
const qs = require('qs');
const xml2js = require('xml2js')
const HTMLParser = require('node-html-parser');
const URI = "https://www.myges.fr"
const parser = new xml2js.Parser({ explicitArray: false });


async function getWeekCalendar(token) {
    try {
        let data = qs.stringify({
            'javax.faces.partial.ajax': true,
            'javax.faces.source': 'calendar:myschedule',
            'javax.faces.partial.execute': 'calendar:myschedule',
            'javax.faces.partial.render': 'calendar:myschedule',
            'calendar:myschedule': 'calendar:myschedule',
            'calendar:myschedule_start': 1617573600000,
            'calendar:myschedule_end': 1618178400000,
            'calendar': 'calendar',
            'calendar:myschedule_view': 'agendaWeek',
            'javax.faces.ViewState': token.token
        });

        let config = {
            method: 'post',
            url: 'https://www.myges.fr/student/planning-calendar',
            headers: {
                'Connection': 'keep-alive',
                'Accept': 'application/xml, text/xml, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
                'Faces-Request': 'partial/ajax',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Sec-GPC': '1',
                'Origin': 'https://www.myges.fr',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.myges.fr/student/planning-calendar',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cookie': `JSESSIONID=${token.sessionId};`
            },
            data: data
        };
        let response = await axios(config)
        let xml = await parser.parseStringPromise(response.data)
        let calendar = xml['partial-response']['changes']['update'][0]['_']
        let calendarParss = JSON.parse(calendar)
        return calendarParss
    } catch (error) {
        console.log(error)
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
        console.log("exit")
        process.exit(1)
    }

}


async function getWeekCalendar2(token) {
    try {
        let data = qs.stringify({
            'javax.faces.partial.ajax': true,
            'javax.faces.source': 'calendar:myschedule',
            'javax.faces.partial.execute': 'calendar:myschedule',
            'javax.faces.partial.render': 'calendar:myschedule',
            'calendar:myschedule': 'calendar:myschedule',
            'calendar:myschedule_start': 1617573600000,
            'calendar:myschedule_end': 1618178400000,
            'calendar': 'calendar',
            'calendar:myschedule_view': 'agendaWeek',
            'javax.faces.ViewState': token.token
        });

        let config = {
            method: 'post',
            url: 'https://www.myges.fr/student/planning-calendar',
            headers: {
                'Connection': 'keep-alive',
                'Accept': 'application/xml, text/xml, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
                'Faces-Request': 'partial/ajax',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Sec-GPC': '1',
                'Origin': 'https://www.myges.fr',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.myges.fr/student/planning-calendar',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cookie': `JSESSIONID=${token.sessionId};`
            },
            data: data
        };
        let response = await axios(config)
        console.log(response.data)
        let xml = await parser.parseStringPromise(response.data)
        console.log(xml)
        let calendar = xml['partial-response']['changes']['update'][0]['_']
        let calendarParss = JSON.parse(calendar)
        return calendarParss
    } catch (error) {
        console.log(error)
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }
        console.log("exit")
        
    }

}

async function getCurrentWeekCalendar(token) {

    let data = qs.stringify({
        "javax.faces.partial.ajax": "true",
        "javax.faces.source": "calendar:myschedule",
        "javax.faces.partial.execute": "calendar:myschedule",
        "javax.faces.partial.render": "calendar:myschedule",
        "calendar:myschedule": "calendar:myschedule",
        "calendar": "calendar",
        "calendar:myschedule_view": "agendaWeek",
        'javax.faces.ViewState': token.token,
        'calendar:myschedule_view': 'agendaWeek'
    });

    let config = {
        method: 'post',
        url: URI + '/student/planning-calendar',

        headers: {
            'Cookie': `JSESSIONID=${token.sessionId}`,
            'Content-Type': 'text/plain'
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
            'Cookie': `JSESSIONID=${token.sessionId};`,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: data
    };
    let response = await axios(config)
    return response.data
}


async function getInfoEventById(token, id) {
    if (!id) {
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
            'Cookie': `JSESSIONID=${token.sessionId};`,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
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

    let list = ["matiere", "intervenant", "salle", "type", "modality"]

    let jsonInfoEvent = {}

    list.forEach(element => {
        let text = root.querySelector(`#${element}`).parentNode.parentNode.structuredText
        text = text.replace("\n", " ").replace("&amp;", "&").replace("&quot;", '"');
        Object.assign(jsonInfoEvent, { [`${element}`]: text })
    });

    return jsonInfoEvent;

}


module.exports = {
    getWeekCalendar: getWeekCalendar,
    getWeekCalendar2: getWeekCalendar2,
    getNextWeekCalendar: getNextWeekCalendar,
    getCurrentWeekCalendar: getCurrentWeekCalendar,
    getInfoEventById: getInfoEventById
}