var express = require('express');
var bodyParser = require('body-parser');
var logfmt = require('logfmt');

var slackService = require('./lib/slackService');
var bitbucketParser = require('./lib/bitbucketParser');

var port = Number(process.env.PORT) || 5000;

var app = express();
app.use(logfmt.requestLogger());
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Set your repository\'s Pull Request POST hook to this page\'s URL.');
});

app.post('*', function (req, res) {
    channel = req.path.substring(1);

    var message = bitbucketParser.generateMessage(req.body);

    if (message !== undefined) {
        slackService.sendMessage(message, channel);
    }

    res.status(200).end();
});

app.listen(port, function () {
    console.log('BitBucket PR Hook bridge listening on:', port);
});
