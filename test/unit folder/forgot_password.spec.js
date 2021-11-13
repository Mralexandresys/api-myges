const { getTokenMyGes } = require("./../../getTokenMyGes");
const myGesApi = require("./../../myGesApi");


const dotenv = require("dotenv").config();

jest.setTimeout(30000);

let token;

test("getToken test", async  () => {
    "Token getting"
        let token = await getTokenMyGes()
        expect(token.token).toBeDefined()
        expect(token.sessionId).toBeDefined()
        global.__TOKEN__ =token;
});

test("Token test", async  () => {
        expect(global.__TOKEN__.token).toBeDefined()
        expect(global.__TOKEN__.sessionId).toBeDefined()
});


test("Token test Global var", async  () => {
    expect(global.__TOKEN__.token).toBeDefined()
    expect(global.__TOKEN__.sessionId).toBeDefined()
});
/*

test("test getCurrentWeekCalendar ", async  () => {
    let data = await myGesApi.getCurrentWeekCalendar(global.__TOKEN__);
    console.log(data)
    expect(data).toBeDefined()
});*/

test("test getWeekCalendar2() ", async  () => {
    console.log(global.__TOKEN__)
    let data = await myGesApi.getWeekCalendar2(global.__TOKEN__);
    console.log(data)
    expect(data).toBeDefined()
});

