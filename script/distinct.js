const { Crt } = require('../models');

const size = 100;

(async () => {
    for (let i = 0; ; i++) {
        let crts = await Crt.find().limit(size).skip(i * size).exec();

        if (crt.length < size) {
            break;
        }

        console.log(i);

        for (let crt of crts) {
            try{
                await crt.update({
                    cv: Array.from(new Set(crt.cv))
                });
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