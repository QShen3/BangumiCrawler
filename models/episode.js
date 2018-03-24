const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
    name: { type: String },
    name_cn: { type: String },
    duration: { type: Number },
    air_date: { type: Date },
    desc: { type: String },
    status: { type: Number, default: 0 }, //0: not air, 1: air
    staff: [{
        name: { type: String },
        name_cn: { type: String },
        jobs: [{type: String}],
        info: { type: Schema.Types.ObjectId, ref: 'Staff' }
    }]
});

EpisodeSchema.index({ name: 1 });
EpisodeSchema.index({ name_cn: 1 });

mongoose.model('Episode', EpisodeSchema);