const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BangumiSchema = new Schema({
    name: { type: String },
    name_cn: { type: String },
    summary: { type: String },
    images: {
        large: { type: String },
        common: { type: String },
        medium: { type: String },
        small: { type: String },
        grid: { type: String },
    },
    staff: [{
        name: { type: String },
        name_cn: { type: String },
        jobs: [{ type: String }],
        info: { type: Schema.Types.ObjectId, ref: 'Staff' }
    }],
    crt: [{ type: Schema.Types.ObjectId, ref: 'Crt' }],
    ep: [{
        name: { type: String },
        name_cn: { type: String },
        status: { type: Number, default: 0 }, //0: not air, 1: air
        info: { type: Schema.Types.ObjectId, ref: 'Episode' }
    }],
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now },
    views: { type: Number }
});

BangumiSchema.index({ name: 1 });
BangumiSchema.index({ name_cn: 1 });

BangumiSchema.pre('save', function (next) {
    let now = new Date();
    this.update_time = now;
    next();
});

mongoose.model('Bangumi', BangumiSchema);