const dtime = require('time-formater');
const { Bangumi, Episode } = require('../models');

const size = 100;

(async () => {
    for(let i=0; ; i++){
        let bangumis = await Bangumi.find().limit(size).skip(i * size).exec();

        if(bangumis.length < size){
            break;
        }

        console.log(i);

        for(let bangumi of bangumis){
            //console.log(bangumi.name_cn);
            try{
                await bangumi.update({
                    air_year: bangumi.air_date ? parseInt(bangumi.air_date.split('-')[0]) : undefined,
                    air_month: bangumi.air_date ? parseInt(bangumi.air_date.split('-')[1]) : undefined,
                    air_weekday: bangumi.air_date ? parseInt(dtime(bangumi.air_date).format('d')) || 0 : undefined,
                    ep_count: bangumi.ep ? bangumi.ep.length : 0,
                    sp_count: bangumi.sp ? bangumi.sp.length : 0,
                });

                for(let episodeElement of bangumi.ep){
                    await Episode.findByIdAndUpdate(episodeElement.id, {bgm_id: bangumi._id}).exec();
                }
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

