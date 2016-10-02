/*Loding json data file*/
function loadData(callback) {

    var xobj = new XMLHttpRequest();
    xobj.open('GET', 'tweet.html', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/*Load data.json again for data processing on frontend*/
function loadContent(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/*
* Function will return formated tweet text
*/
function returnTweetText(data) {
    
    /*Manage mentions*/
    var mentions = [];
    var finalText = data;
    
    var re = /(@[\w]+)/g;
    var m;

    while ((m = re.exec(data)) != null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        
        finalText = finalText.replace(m[0],'<a href="https://twitter.com/'+m[1]+'">'+m[0]+'</a>');
    }
    
    /*Manage Links*/
    var re = /(((ftp|https|http?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
    
    while ((m = re.exec(data)) != null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        
        finalText = finalText.replace(m[0],'<a href="'+m[0]+'">'+m[0]+'</a>');
    }

    return finalText;
}


/*
* Function will return formated tweet img
*/
function returnTweetImg(data) {
    var content = document.createElement('div');
    content.classList = 'media mt2';
    
    var container = document.createElement('div');
    container.className = 'eleContainer';
    if(data.type === 'photo') {
        container.appendChild(createImage(data.media_url));
        
    } else if(data.type === 'animated_gif') {
        container.innerHTML = createVideo(data.video_info.variants[0].url, data.media_url, '');
    }
    
    content.appendChild(container);
    return content;
}

function createImage(src, alt, title) {
    var img= document.createElement('img');
    img.src= src;
    if (alt != null) img.alt= alt;
    if (title != null) img.title= title;
    return img;
}

function createVideo(source, image, fallback) {
    
    return '<video poster="'+image+'" autoplay loop>'+
        '<source src="'+source+'" type=\'video/mp4; codecs="avc1.4D401E, mp4a.40.2"\'>'+
        '<p>This is fallback content to display for user agents that do not support the video tag.</p>'+
        '</video>';
}

/*Global month array for renaming month number*/
var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
function getTweetTime(createdAt) {
    var d = new Date(createdAt);
    
    return monthNames[d.getMonth()] + ' ' + d.getDate();
}


document.addEventListener('DOMContentLoaded', function() {
    /*Loading static html content*/
    loadData(function (response) {
        var ele = document.getElementById('tweets');
        
        ele.innerHTML = response;
    });
    
    /*Loading main data*/
    loadContent(function (response) {
        
        var tweets = JSON.parse(response).content;
        
        var currEle = '';
        var timeEle = '';
        var tweetCount = 0;
        var photoCount = 0;
        var followingCount = 0;
        var followerCount = 0;
        
        tweets.forEach(function(tweet){
            var data = '';
            currEle = document.getElementById(tweet.id+'-content');
            
            if(currEle == null)
                return;
            
            currEle.innerHTML = returnTweetText(tweet.text);
                        
            if(typeof tweet.extended_entities !== 'undefined' && tweet.extended_entities.media !== 'undefined') {
                var imgData = returnTweetImg(tweet.extended_entities.media[0]);
                
                currEle.appendChild(imgData);
                
                /*Counting only pics/videos available in data set.*/
                photoCount++;
            }
            
            /*Change time content*/
            timeEle = document.getElementById(tweet.id+'-time');
            
            timeEle.innerHTML = getTweetTime(tweet.created_at);
            
            /*Manage Counts*/
            tweetCount++;
            /*If I am following tweete*/
            if(tweet.user.following)
                followingCount++;
        });
        
        /*Set Counts*/
        document.getElementById('tweetsCount').innerHTML = tweetCount;
        document.getElementById('picsCount').innerHTML = photoCount;
        document.getElementById('followingCount').innerHTML = followingCount;
    });
}, false);