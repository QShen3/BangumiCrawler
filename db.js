const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var user = "QShen";
var password = "szy19960423mongo";
//var url = "localhost/QVideo"
var url = "qshen.cc/QVideo"
mongoose.connect('mongodb://' + user + ':' + password + '@' + url);

var db = mongoose.connection;
db.on('error', function (err) {
    console.error(err);
});

var Image = {
        large: { type: String},
        common: { type: String},
        medium: { type: String},
        small: { type: String},
        grid: { type: String}
    }


var video = {
        from: { type: String},
        from_cn: { type: String},
        from_logo: { type: String},
        id: { type: String},
        url: { type: String}
    }


var staff = {
        name: { type: String},
        name_cn: { type: String}
    }


var epsoid = {
        name: { type: String},
        name_cn: { type: String},
        duration: { type: String},
        airDate: { type: Date},
        desc: { type: String},
        views: { type: Number, default: 0},
        video: { type: [video]}
    }


var animationSchema = new mongoose.Schema(
    {
        name: { type: String },
        name_cn: { type: String},
        bangumiId: {type: String},
        summary: {type: String},
        airDate: { type: Date},
        updateDate: {type: Date, default: Date.now},
        airWeekday: { type: String},
        views: { type: Number, default: 0},
        weeklyViews: { type: Number, default: 0},
        monthlyViews: { type: Number, default: 0},
        yearlyViews: { type: Number, default: 0},
        state: { type: String},
        type: { type: String},
        quarter: { type: String},
        image: {
            large: String,
            common: String,
            medium: String,
            small: String,
            grid: String
        },
        creatDate: { type: Date, default: Date.now},
        bangumiScore: { type: String},
        epsoid: { type: [epsoid]},
        original: { type: [staff]},
        director: { type: [staff]},
        script: { type: [staff]},
        storyboard: { type: [staff]},
        production: { type: [staff]},
        music: { type: [staff]},
        characterDesign: { type: [staff]},
        seriesConfiguration: { type: [staff]},
        artDirector: { type: [staff]},
        colorDesign: { type: [staff]},
        animationDirector: { type: [staff]},
        photographyDirector: { type: [staff]},
        originalPicture: { type: [staff]},
        edit: { type: [staff]},
        planning: { type: [staff]},
        soundDirector: { type: [staff]},
        animationProduction: { type: [staff]},
        voiceActor: { type: [String]}
    }
)

var animation = mongoose.model('Animations', animationSchema);

module.exports.animation = animation;