const fs = require('fs');
const urllib = require('urllib');

const { Bangumi, Crt, Actor, Staff, Episode, BroadCaster, Network } = require('./models/index');
const config = require('./config');

const failedList = [];
var count = 0;

function resolveDate(input) {
    if (input.indexOf('-') >= 0) {
        return input;
    }
    else if (input.indexOf('.') >= 0) {
        return input.split('.').reverse().join('-');
    }
    else if (input.indexOf('年') >= 0) {
        return input.replace('年', '-').replace('月', '-').replace('日', '');
    }
}

function resolveDuration(input) {
    if (input.indexOf(':') >= 0) {
        let duration = input.split(':');
        if(duration.length == 3){
            return (parseInt(duration[0]) || 0) * 3600 + (parseInt(duration[1]) || 0) * 60 + (parseInt(duration[2]) || 0);
        }
        else if(duration.length == 2){
            return parseInt(duration[0]) * 60 + parseInt(duration[1]);
        }
        else {
            return 0;
        }
    }
    else if (input.indexOf('m') >= 0) {
        let hour = 0;
        if (input.indexOf('h') >= 0) {
            input = input.split('h');
            hour = parseInt(input[0]);
            input = input[1];
        }
        let minute = parseInt(input.replace('m', ''));
        return hour * 3600 + minute * 60;
    }
    else {
        return 0;
    }
}

async function getDoc(bangumiId) {
    try {
        var { data, res } = await urllib.request(`http://api.bgm.tv/subject/${bangumiId}?responseGroup=large`, { gzip: true });
    }
    catch (err) {
        console.error(`${bangumiId}: ${err.message}`);
        failedList.push(bangumiId);
        return;
    }
    if (res.statusCode != 200) {
        if ([301, 302, 303, 304].indexOf(res.statusCode) >= 0) {
            console.log(`${bangumiId}: 3XX`);
            return;
        }
        console.error(`${bangumiId}: ${res.statusCode}`);
        failedList.push(bangumiId);
        return;
    }

    try {
        var bgmObject = JSON.parse(data);
    }
    catch (err) {
        console.error(`${bangumiId}: ${err.message}`);
        failedList.push(bangumiId);
        return;
    }

    if (bgmObject.type !== 2) {
        console.error(`${bangumiId}: not bangumi`);
        return;
    }

    console.log(`${bgmObject.id}: ${bgmObject.name} | ${bgmObject.name_cn || ''}`);

    let bangumi = new Bangumi({
        name: bgmObject.name,
        name_cn: bgmObject.name_cn,
        summary: bgmObject.summary,
        images: bgmObject.images,
    });
    bangumi.air_date = resolveDate(bgmObject.air_date);
    bangumi.other_website.push({
        name: 'Bangumi',
        url: `http://bangumi.tv/subject/${bangumiId}`,
        id: bangumiId
    });

    for (let staffObject of (bgmObject.staff || [])) {
        let staff = await Staff.findOne({ name: staffObject.name }).exec();
        if (!staff) {
            staff = new Staff({
                name: staffObject.name,
                name_cn: staffObject.name_cn,
                images: staffObject.images,
            });
            staff.info = {};
            if (staffObject.info && staffObject.info.gender) {
                staff.info.gender = staffObject.info.gender;
            }
            staff.jobs = staff.jobs.concat(staffObject.jobs);
        }
        else {
            staff.jobs = Array.from(new Set(staff.jobs.concat(staffObject.jobs)));
        }
        try {
            staff = await staff.save();
        }
        catch (err) {
            console.error(`${bangumiId}: ${err.message}`);
            failedList.push(bangumiId);
            return;
        }
        bangumi.staff.push({
            name: staff.name,
            name_cn: staff.name_cn,
            jobs: staffObject.jobs,
            id: staff._id
        });
    }

    for (let crtObject of (bgmObject.crt || [])) {
        let crt = await Crt.findOne({ name: crtObject.name }).exec();
        if (!crt) {
            crt = new Crt({
                name: crtObject.name,
                name_cn: crtObject.name_cn,
                images: crtObject.images,
            });
            crt.info = {};
            if (crtObject.info && crtObject.info.gender) {
                crt.info.gender = crtObject.info.gender;
            }
        }
        for (let actorObject of (crtObject.actors || [])) {
            let actor = await Actor.findOne({ name: actorObject.name }).exec();
            if (!actor) {
                actor = new Actor({
                    name: actorObject.name,
                    name_cn: actorObject.name_cn,
                    images: actorObject.images
                });
                try {
                    actor = await actor.save();
                }
                catch (err) {
                    console.error(`${bangumiId}: ${err.message}`);
                    failedList.push(bangumiId);
                    return;
                }
            }
            if(crt.cv.indexOf(actor._id) == -1){
                crt.cv.push(actor._id);
            }          
        }
        crt.cv = Array.from(new Set(crt.cv));
        try {
            crt = await crt.save();
        }
        catch (err) {
            console.error(`${bangumiId}: ${err.message}`);
            failedList.push(bangumiId);
            return;
        }
        bangumi.crt.push(crt._id);
    }

    for (let epObject of (bgmObject.eps || [])) {
        let episode = new Episode({
            name: epObject.name,
            name_cn: epObject.name_cn,
            duration: resolveDuration(epObject.duration),
            air_date: resolveDate(epObject.airdate),
            desc: epObject.desc,
            status: epObject.status === 'Air' ? 1 : 0
        });
        try {
            episode = await episode.save();
        }
        catch (err) {
            console.error(`${bangumiId}: ${err.message}`);
            failedList.push(bangumiId);
            return;
        }
        if (epObject.type == 0) {
            bangumi.ep.push({
                title: `第${epObject.sort}话`,
                name: episode.name,
                name_cn: episode.name_cn,
                status: episode.status,
                id: episode._id
            });
        }
        else if (epObject.type == 1) {
            bangumi.sp.push({
                title: `第${epObject.sort}话`,
                name: episode.name,
                name_cn: episode.name_cn,
                status: episode.status,
                id: episode._id
            });
        }
    }

    try {
        bangumi = await bangumi.save();
    }
    catch (err) {
        console.error(`${bangumiId}: ${err.message}`);
        failedList.push(bangumiId);
        return;
    }
    console.log(`${bgmObject.name} | ${bgmObject.name_cn || ''} has been inserted.`);

    return;
}

(async () => {
    let pos = process.argv.indexOf('-f');
    if(pos >= 0){
        let file = process.argv[pos + 1];
        let list = fs.readFileSync(file).toString();
        list = list.split(',');
        for(let i of list){
            await getDoc(i);
        }
        fs.writeFileSync('./failedList.txt', failedList.toString());
    }
    else{
        for (let i = config.start; i <= config.end; i++) {
            await getDoc(i);
        }
        fs.writeFileSync('./failedList.txt', failedList.toString());
    }

    process.exit(0);
})();