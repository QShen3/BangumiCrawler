const Animation = require('./db.js').animation

const count = 11142
//const count = 1;
function change(i){
    if(i >= count){
        console.log("All finished!");
        process.exit(0);
    }
    Animation.find().skip(i).limit(1).exec().then((doc) => {
        //console.log(doc[0]._id);
        doc[0].bangumiId = (doc[0].bangumiId).toString();
        doc[0].markModified("bangumiId");
        return saveDoc(doc[0]);
    }).then((doc) => {
        console.log("We have finished " + i + " documents!");
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