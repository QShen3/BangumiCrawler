const Animation = require('./db.js').animation

const count = 11142;
//const count = 1;
function change(i){
    if(i >= count){
        console.log("All finished!");
        process.exit(0);
    }
    Animation.find().skip(i).limit(1).exec().then((doc) => {
        /*doc[0].views = 0;
        doc[0].weeklyViews = 0;
        doc[0].monthlyViews = 0;
        doc[0].yearlyViews = 0;
        doc[0].state = "serializing";
        doc[0].type = "tv";
        doc[0].quarter = "1";*/
        doc[0].state = "ended";
        /*for(let i in doc[0].epsoid){
            doc[0].epsoid[i].views = 0;
        }*/
        return saveDoc(doc[0]);
    }).then((doc) => {
        console.log("We have finished " + i + " documents! " + doc.name);
        change(i + 1);
    }).catch((err) => {
        console.error(err);
    })
}

//change(0);
Animation.find({state: "serializing"}).exec().then((doc) => {

        let promises = new Array();
        for(let i in doc){
            doc[i].state = "ended";
            promises.push(saveDoc(doc[i]));
        }
        return Promise.all(promises);
    }).then((docs) => {
        console.log("We have finished " + docs.length);
    }).catch((err) => {
        console.error(err);
    })

function saveDoc(doc) {
    return new Promise((resolve, reject) => {
        doc.save((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(doc);
            }
        })
    })
}