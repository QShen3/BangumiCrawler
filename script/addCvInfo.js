const mongoose = require('mongoose');

const { Crt } = require('../models');

const size = 100;

(async () => {
    for (let i = 0; ; i++) {
        let crts = await Crt.find().limit(size).skip(i * size).populate('cv', 'name name_cn', 'Actor').exec();

        if (crts.length < size) {
            break;
        }

        console.log(i);

        for (let crt of crts) {
            try{
                let cvs = [];
                for(let cv of crt.cv){
                    cvs.push({
                        name: cv.name,
                        name_cn: cv.name_cn,
                        id: cv._id
                    });
                }
                crt.cv = cvs;
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