const Animation = require('./db.js').animation

var Image = {
    large: { type: String },
    common: { type: String },
    medium: { type: String },
    small: { type: String },
    grid: { type: String }
}

var image = new Object();
image.large = "http://qvideo-1252071327.file.myqcloud.com/pic/default/306_435.jpg";
image.common = "http://qvideo-1252071327.file.myqcloud.com/pic/default/150_213.jpg";
image.medium = "http://qvideo-1252071327.file.myqcloud.com/pic/default/100_142.jpg";
image.small = "http://qvideo-1252071327.file.myqcloud.com/pic/default/78_100.jpg";
image.grid = "http://qvideo-1252071327.file.myqcloud.com/pic/default/48_48.jpg";

const count = 11142;
//const count = 1;
function change(i) {
    if (i >= count) {
        console.log("All finished!");
        process.exit(0);
    }
    Animation.find().skip(i).limit(1).exec().then((doc) => {
        if( doc[0].bangumiId == "152365" ){
            //console.log(doc[0].image);
        }
        if (doc[0]._doc.image == null || doc[0]._doc.image == undefined) {
            doc[0]._doc.image = image;
            doc[0].markModified("image");
            //doc[0].image.set("large", "http://qvideo-1252071327.file.myqcloud.com/pic/default/306_435.jpg");
            return saveDoc(doc[0]);
        }
        else {
            console.log("documents " + i + " " + doc[0].name + " has image");
            change(i + 1);
        }
    }).then((doc) => {
        if(doc == undefined || doc ==null){
            return;
        }
        console.log("documents " + i + "" + doc.name + "\'s image has changed");
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