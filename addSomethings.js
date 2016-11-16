const Animation = require('./db.js').animation

const count = 11142;
//const count = 1;
function change(i){
    if(i >= count){
        console.log("All finished!");
        process.exit(0);
    }
    Animation.find().skip(i).limit(1).exec().then((doc) => {
        doc[0].views = 0;
        doc[0].weeklyViews = 0;
        doc[0].monthlyViews = 0;
        doc[0].yearlyViews = 0;
        doc[0].state = "serializing";
        doc[0].type = "tv";
        doc[0].quarter = "1";
        for(let i in doc[0].epsoid){
            doc[0].epsoid[i].views = 0;
        }
        return saveDoc(doc[0]);
    }).then((doc) => {
        console.log("We have finished " + i + " documents! " + doc.name);
        change(i + 1);
    }).catch((err) => {
        console.error(err);
    })
}

change(0);

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