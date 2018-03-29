# Bangumi crawler

A crawler for bangumi.tv. Can collect bangumi data(exclude game, manga, music, etc...) and store it in MongoDB.

## Usage

### Preparation

Require node.js >= 7.6.0

```bash
cd <paht-to-project> && npm install
```

After all packages installed

```bash
cp config.default.js config.js && vi config.js
```

Now you can change the config.

```js
mongoDB: {
    user: 'user',
    password: 'password',
    host: 'localhost',
    port: '27017',
    db: 'db'
},
start: 1,
end: 241493
```

You should change the MongoDB info according to your MongoDB's option and the start and end bangumi ID.

### Start crawling

```bash
nohup node app.js &!
```

By default, it will scan from the start id you set to the end id you set. After crawling, a file named failedList.txt will be created. It contains IDs with errors(such as network error).

You can also use a file to input the IDs you want to scan, for example

```bash
nohup node app.js -f list.txt &!
```

Ids in the input file should be separate by ",". You can use the failedList.txt as a input file.

## License

[The MIT License](https://github.com/QShen3/BangumiCrawler/tree/master/LICENSE)