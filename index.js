const request = require("request-promise");
const cron = require('node-cron');
const format = require('date-fns/format');
const pool = require("./functions/rethinkdb");
const r = require("rethinkdb");
const roptions = require("./config.js").roptions;


cron.schedule('15,45 * * * *', () => {
    console.log(`=====================================================`);
    console.log(`Started renewing proxies at ${format(new Date(), 'DD-MM-YY HH:mm:ss:SSS')}`);
    init(roptions);
    console.log(`Stopped renewing proxies at ${format(new Date(), 'DD-MM-YY HH:mm:ss:SSS')}`);
});

async function init(a) {
    await clearTable();
    const data = await getProxyList(a);
    await insertProxies(data);
}

async function getProxyList(roptions) {
    var data = await request(roptions);
    data = data.split("\n");
    return data;
}

async function insertProxies(proxyList) {
    for (i = 0; i < proxyList.length; i++) {
        var length = proxyList[i].length - 3;
        await pool.run(r.table("proxies").insert({ address: `${proxyList[i].substring(0, length)}` }));
    }
}

async function clearTable() {
    return await pool.run(r.table("proxies").delete());
}