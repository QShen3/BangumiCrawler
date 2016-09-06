const urllib_sync = require('urllib-sync');
const fs = require('fs');
const Animation = require('./db.js').animation

for( let i=158316; i<158326; i++){
    try{
        var res = urllib_sync.request('http://api.bgm.tv/subject/' + i + '?responseGroup=large');
    }
    catch(e){
        console.log(e);
        fs.writeFileSync('failed.txt', i + ' request' + '\n');
        continue;
    }
    
    if(res.status != 200){
        fs.appendFileSync('failed.txt', i + ' request res' + '\n');
        continue;
    }
    try{
        var item = JSON.parse(res.data);
    }
    catch(e){
        console.log(e);
        fs.writeFileSync('failed.txt', i + ' json parse' + '\n');
        continue;
    }   
    
    console.log(i + ' ' + item.name_cn + ' ' + item.name + (item.type===2?'':' pass'));

    if(item.type !== 2){
        continue;
    }

    let animation = new Animation();

    animation.name = item.name;
    animation.name_cn = item.name_cn;
    animation.bangumiId = item.id;
    animation.summary = item.summary;
    //animation.airDate = item.air_date;
    let airDate = item.air_date.split('-');
    animation.airDate = new Date();
    animation.airDate.setFullYear(parseInt(airDate[0]), parseInt(airDate[1]), parseInt(airDate[2]))
    animation.airWeekday = item.air_weekday;
    /*animation.image.large = item.image.large;
    animation.image.common = item.image.common;
    animation.image.medium = item.image.medium;
    animation.image.small = item.image.small;
    animation.image.grid = item.image.grid;*/
    animation.image = item.images;
    animation.bangumiScore = item.rating.score;
    for(let j in item.eps){
        if(item.eps[j].type !== 0){
            continue;
        }
        airDate = item.eps[j].airdate.split('-');
        let date = new Date();
        date.setFullYear(parseInt(airDate[0]), parseInt(airDate[1]), parseInt(airDate[2]));
        animation.epsoid.push({
            name: item.eps[j].name,
            name_cn: item.eps[j].name_cn,
            duration: item.eps[j].duration,
            airDate: airDate,
            desc: item.eps[j].desc,
            video: []
        })
    }
    for(let j in item.staff){
        for(let k in item.staff[j].jobs){
            switch(item.staff[j].jobs[k]){
                case '原作':
                animation.original.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '导演':
                animation.director.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '脚本':
                animation.script.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '分镜':
                animation.storyboard.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '演出':
                animation.production.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '音乐':
                animation.music.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '人物设定':
                animation.characterDesign.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '系列构成':
                animation.seriesConfiguration.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '美术监督':
                animation.artDirector.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '色彩设计':
                animation.colorDesign.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '作画监督':
                animation.animationDirector.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '摄影监督':
                animation.photographyDirector.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '原画':
                animation.originalPicture.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '剪辑':
                animation.originalPicture.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '企画':
                animation.planning.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '音响监督':
                animation.soundDirector.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                case '动画制作':
                animation. animationProduction.push({
                    name: item.staff[j].name,
                    name_cn: item.staff[j].name_cn
                });
                break;
                default:
                console.log('Miss' + item.staff[j].jobs[k]);
            }
        }
    }
    for(let j in item.crt){
        for(let k in item.crt[j].actors){
            animation.voiceActor.push(item.crt[j].actors[k].name);
        }
    }

    animation.save(function(err){
        if(err){
            console.log('db err ' + err);
            fs.writeFileSync('failed.txt', i + ' db' + '\n');
        }
        else{
            fs.writeFileSync('succesed.txt', i + '\n');
        }
    })
}