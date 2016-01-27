/*
https://developers.facebook.com/docs/graph-api/reference/v2.5/group
https://developers.facebook.com/docs/graph-api/reference/user/groups/
https://developers.facebook.com/docs/graph-api/reference/v2.5/group/feed
https://developers.facebook.com/tools/explorer/145634995501895/
*/
var FB = require('fb');
var Twitter = require('twitter');
var Nedb = require('nedb');
var twts = new Nedb({
    filename: 'datatwitterbot.db',
    autoload: true
});
var groups = {
    'ionic2': ['1166969206665154']
};
var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});
FB.setAccessToken('CAACEdEose0cBAB8JgFNc8rjtNMTS3TKraQww6nB33wvJaGSie05eHfSZCZAG4oTdvD4dZCFUaUg3CQGVIaxmneGeI1zObSXxXCBSIZA5yFZA9plWOhdNo3ZBSCQcBQDx2p3Yq16Gsi98La1cknZC84CmWZCYb6yor2q5I1tZAUE02FDkaAbKM7G4TanzxjHcwV7ZCtyncouZASBcDsRrGY9btxu');
/**/
/**/
var Facebook = {};
Facebook.groups = function(fields) {
    FB.api("/me?fields=groups{" + fields + "}", function(res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log(res);
    });
}

Facebook.feed = function(id) {
        FB.api("/" + id + "/feed", function(res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }
            console.log(res);
        });
    }
    /*Post on Ionic Dev Pará*/
Facebook.post = function(id, msg) {
    console.log(id, msg);
    var body = msg;
    FB.api(id + '/feed', 'post', {
        message: body
    }, function(res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log('Post Id: ' + res.id);
    });
}

var SocialBot = {};
SocialBot.searchTweets = function(key) {
    client.get('search/tweets', {
        q: key
    }, function(error, tweets, response) {
        for (o in tweets.statuses) {
            if (tweets.statuses[o].text.indexOf('http') !== -1) {
                SocialBot.showtwitters(key, tweets.statuses[o]);
            }
        }
    });
};
SocialBot.publishtwiter = function(msg) {
    client.post('statuses/update', {
        status: msg
    }, function(error, tweet, response) {
        console.log(error);
        if (error) throw error;
        console.log(tweet);
        console.log(response);
    })
};

SocialBot.showtwitters = function(key, obj) {
    twts.find({
        id: obj.id
    }, function(err, docs) {
        if (docs.length === 0) {
            twts.insert({
                id: obj.id
            }, function(err) {});
            Facebook.post(groups[key], obj.text);
            // SocialBot.publishtwiter(obj.text);
        }
    });
}

SocialBot.searchTweets('ionic2');
