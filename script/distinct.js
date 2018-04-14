const mongoose = require('mongoose');

const { Crt } = require('../models');

const size = 100;

(async () => {
    for (let i = 0; ; i++) {
        let crts = await Crt.find().limit(size).skip(i * size).exec();

        if (crts.length < size) {
            break;
        }

        console.log(i);

        for (let crt of crts) {
            try{
                let objIdSet = new Set();
                for(let objId of crt.cv){
                    objIdSet.add(objId.toString());
                }
                crt.cv = [];
                for(let objId of objIdSet.values()){
                    crt.cv.push(mongoose.Types.ObjectId(objId));
                }
                await crt.save();
            }
            catch(err){
                console.error(err);
                break;
            }
        }
    }
    console.log('finish');
    process.exit(0);
})();