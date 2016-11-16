const Animation = require('./db.js').animation

const count = 11141

function correct(i){
    if(i >= count){
        console.log("All finished!");
        process.exit(0);
    }
    Animation.find().skip(i).limit(1).exec().then((doc) => {
        doc[0].airDate.setMonth(doc[0].airDate.getMonth() - 1);
        doc[0].markModified("airDate");
        doc[0].updateDate = Date();
        return saveDoc(doc[0]);
    }).then((doc) => {
        console.log("We have finished " + i + " documents!");
        correct(i + 1);
    }).catch((err) => {
        console.error(err);
    })
}

correct(0);

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