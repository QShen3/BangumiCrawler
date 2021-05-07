import mongodb from "mongodb";
import urllib from "urllib";
import range from "range"
import config from "./config.js";

const uri = (() => {
    if (config.mongoDB.user != '' && config.mongoDB.password != '') {
        return `mongodb://${config.mongoDB.user}:${config.mongoDB.password}@${config.mongoDB.host}:${config.mongoDB.port}`;
    }
    else {
        return `mongodb://${config.mongoDB.host}:${config.mongoDB.port}`;
    }
})();

const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function main() {
    await client.connect();

    const database = client.db(config.mongoDB.db);
    const anime = database.collection("anime");
    const game = database.collection("game");

    let bangumiList = range.range(config.start, config.end + 1);

    for (let i of bangumiList) {
        try {
            var {data, res} = await urllib.request(`http://api.bgm.tv/subject/${i}?responseGroup=large`, { gzip: true });
        } catch (err) {
            console.error(`${i}: ${err.message}`);
            bangumiList.push(i);
            continue;
        }
        if (res.statusCode != 200) {
            if ([301, 302, 303, 304].indexOf(res.statusCode) >= 0) {
                console.log(`${i}: redirect`);
                continue;
            }
            console.error(`${i}: ${res.statusCode}`);
            bangumiList.push(i);
            continue;
        }

        try {
            var bangumiObject = JSON.parse(data);
            if (bangumiObject.type == 2) {
                await anime.insertOne(bangumiObject);
            } else if (bangumiObject.type == 4) {
                await game.insertOne(bangumiObject);
            } else {
                console.log(`${i}: Not anime or game`);
                continue;
            }
        } catch (err) {
            console.error(`${i}: ${err.message}`);
            if (err.message.includes("E11000")) {
                continue;
            }
            bangumiList.push(i);
            continue;
        }
        console.log(`${i}: ${bangumiObject.name} | ${bangumiObject.name_cn || ''} has been inserted.`);
    }
}

main().catch(console.dir).finally(() => {
    client.close();
});
