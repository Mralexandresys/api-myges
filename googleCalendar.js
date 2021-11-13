const fs = require('fs').promises;
const readline = require("readline-sync")
const { google } = require('googleapis');



const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const TOKEN_PATH = 'token.json';

async function getAuthorize() {
    let credentials = await getCredentials()
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    try {
        let tokenFile = await fs.readFile(TOKEN_PATH, "utf8")
        oAuth2Client.setCredentials(JSON.parse(tokenFile))
        return oAuth2Client
    } catch (err) {
        console.log("error code :" + err.code)
        if (err.code === "ENOENT") {
            console.info("token not fund")
            console.info("generate token")
            await getAccessToken(oAuth2Client)
            return oAuth2Client
        } else {
            console.log(err)
            process.exit(-1)
        }
    }
}


async function getCredentials() {
    try {
        let credentials = await fs.readFile('credentials.json')
        return JSON.parse(credentials);

    } catch (err) { console.log('Error loading client secret file:', err) }
}


async function getAccessToken(oAuth2Client) {
    try {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        let codeRead = readline.question('Enter the code from that page here: ')
        let token = (await oAuth2Client.getToken(codeRead)).tokens
        oAuth2Client.setCredentials(token);
        await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
        console.info('Token stored to', TOKEN_PATH)
        return oAuth2Client;
    } catch (err) {
        console.error('Error : ', err);
        process.exit(-1)
    }
}

async function listEventsBetweenDate(auth, date) {
    const calendar = google.calendar({ version: 'v3', auth });

    return (await calendar.events.list({
        calendarId: process.env.CALENDAR_ID,
        timeMin: date.startDate.toISOString(),
        timeMax: date.endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    })).data.items;
}

async function deleteEvent(auth, events) {
    const calendar = google.calendar({ version: 'v3', auth });
    await Promise.all(events.map(async (event) => {
        for (let i = 0; i < 5; i++) {
            let params = {
                calendarId: process.env.CALENDAR_ID,
                eventId: event.id,
            };
            try {
                let result = await calendar.events.delete(params)
                break;
            } catch (error) {
                if (error.errors[0].reason === "rateLimitExceeded") {
                    await (new Promise(resolve => setTimeout(resolve, 1000 * i + Math.random() * (10000 - 1000) + 1000)))
                } else {
                    throw new Error("error api google : " + error)
                }
            }
        }

    }));
}

async function insertEventByMyGes(auth, events) {
    const calendar = google.calendar({ version: 'v3', auth });
    await Promise.all(events.map(async (eventMyGes) => {
        for (let i = 0; i < 5; i++) {

            let description = ""
            let listElement = ["matiere", "intervenant", "salle", "type", "modality"]
            listElement.forEach(element => {
                description = description + eventMyGes[element] + '<br>'
            });
            var event = {
                'summary': eventMyGes.matiere.split(':')[1],
                'description': description,
                'start': {
                    'dateTime': eventMyGes.start
                },
                'end': {
                    'dateTime': eventMyGes.end
                }
            }
            try {
                await calendar.events.insert({
                    auth: auth,
                    calendarId: process.env.CALENDAR_ID,
                    resource: event,
                })
                break;
            } catch (error) {
                if (error.errors[0].reason === "rateLimitExceeded") {
                    await (new Promise(resolve => setTimeout(resolve, 1000 * i + Math.random() * (10000 - 1000) + 1000)))
                } else {
                    throw new Error("error api google : " + error)
                }
            }
        }
    }));
}


module.exports = {
    getAuthorize: getAuthorize,
    listEventsBetweenDate: listEventsBetweenDate,
    insertEventByMyGes: insertEventByMyGes,
    deleteEvent: deleteEvent
}
