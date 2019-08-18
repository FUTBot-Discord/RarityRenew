const request = require("request-promise");
const cron = require('node-cron');
const format = require('date-fns/format');
const pool = require("./functions/rethinkdb");
const r = require("rethinkdb");
const roptions = require("./config.js").roptions;

cron.schedule('15,45 * * * *', () => {
    console.log(`=====================================================`);
    console.log(`Started renewing rarities at ${format(new Date(), 'DD-MM-YY HH:mm:ss:SSS')}`);
    init(roptions);
    console.log(`Stopped renewing rarities at ${format(new Date(), 'DD-MM-YY HH:mm:ss:SSS')}`);
});

async function init(a) {
    const listSkip = await getSkipList();
    const listChange = await getChangeList();

    let listRarities = await getRarityList(a);
    listRarities = await changeRarities(listChange, listRarities);
    listRarities = await skipRarities(listSkip, listRarities);

    clearTable()
        .then(insertRarities(listRarities));
}

async function getRarityList(roptions) {
    const data = await request(roptions);
    const response = JSON.parse(data);
    return response.dynamicRarities;
}

async function insertRarities(listRarities) {
    for (let keyRarity in listRarities) {
        let valueRarity = listRarities[keyRarity];
        await pool.run(r.table("rarities").insert({ id: `${keyRarity}`, rarity: `${valueRarity}` }));
    }
}

async function clearTable() {
    return await pool.run(r.table("rarities").delete());
}

async function getSkipList() {
    const d = await pool.run(r.table("rarities2skip"));
    return d;
}

async function getChangeList() {
    const d = await pool.run(r.table("rarities2change"));
    return d;
}

function changeRarities(listChange, listRarities) {
    for (i = 0; i < listChange.length; i++) {
        const itemChange = listChange[i];
        listRarities[itemChange.id] = itemChange.rarity;
    }
    return listRarities;
}

function skipRarities(listSkip, listRarities) {
    for (let keyRarity in listRarities) {
        let valueRarity = listRarities[keyRarity];
        for (i = 0; i < listSkip.length; i++) {
            if (valueRarity.startsWith(listSkip[i].rarity)) delete listRarities[keyRarity];
        }
    }
    return listRarities;
}