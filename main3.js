const urllib_sync = require('urllib-sync');
const fs = require('fs');
const Animation = require('./db.js').animation

var input = fs.readFileSync("failed.txt").toString().split('\n');
for(let i = 0; i < input.length; i++){
    input[i] = parseInt(input[i]);
}


function get(i){
    try{
        var res = urllib_sync.request('http://api.bgm.tv/subject/' + input[i] + '?responseGroup=large');
    }
    catch(e){
        console.log(e);
        fs.appendFileSync('failed2.txt', input[i] + ' request' + '\n');
        i++;
        if(i < input.length){
            get(i);
            return;
        }
        return;
    }
    
    if(res.status != 200){
        fs.appendFileSync('failed2.txt', input[i] + ' request res' + '\n');
        i++;
        if(i < input.length){
            get(i);
            return;
        }
    }
    try{
        var item = JSON.parse(res.data);
    }
    catch(e){
        console.log(e);
        fs.appendFileSync('failed.txt2', input[i] + ' json parse' + '\n');
        i++;
        if(i < input.length){
            get(i);
            return;
        }
    }   
    
    console.log(input[i] + ' ' + item.name_cn + ' ' + item.name + (item.type===2?'':' pass'));

    if(item.type !== 2){
        i++;
        if(i < input.length){
            get(i);
            return;
        }
    }

    let animation = new Animation();

    animation.name = item.name;
    animation.name_cn = item.name_cn;
    animation.bangumiId = item.id;
    animation.summary = item.summary;
    
    /*let airDate = item.air_date.split('-');
    animation.airDate = new Date();
    animation.airDate.setFullYear(parseInt(airDate[0]), parseInt(airDate[1]), parseInt(airDate[2]))*/
    let airDate = item.air_date.split('-');
    if(airDate.length == 1){
        airDate = item.air_date.split('.');
        animation.airDate = new Date();
        animation.airDate.setFullYear(parseInt(airDate[2]), parseInt(airDate[1]), parseInt(airDate[0]))
    }
    else{
        animation.airDate = new Date();
        animation.airDate.setFullYear(parseInt(airDate[0]), parseInt(airDate[1]), parseInt(airDate[2]))
    }
    
    animation.airWeekday = item.air_weekday;
    animation.image = item.images;
    animation.bangumiScore = item.rating.score;
    for(let j in item.eps){
        if(item.eps[j].type !== 0){
            continue;
        }
        airDate = item.eps[j].airdate.split('-');
        let date = new Date();
        if(item.eps[j].airdate == ""){

        }
        else if(airDate.length == 1){
            airDate = item.eps[j].airdate.split('.');           
            date.setFullYear(parseInt(airDate[2]), parseInt(airDate[1]), parseInt(airDate[0]));
        }
        else{
            date.setFullYear(parseInt(airDate[0]), parseInt(airDate[1]), parseInt(airDate[2]));
        }
       
        animation.epsoid.push({
            name: item.eps[j].name,
            name_cn: item.eps[j].name_cn,
            duration: item.eps[j].duration,
            airDate: date,
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

    fs.appendFileSync('ready.txt', input[i] + ' ' + item.name_cn + ' ' + item.name + '\n');
    animation.save(function(err){
        if(err){
            console.log('db err ' + err);
            fs.appendFileSync('failed2.txt', input[i] + ' db' + '\n');
        }
        else{
            fs.appendFileSync('succesed.txt', input[i] + '\n');
        }
        i++;
        if(i < input.length){
            get(i);
            return;
        }
    })
}

get(0);