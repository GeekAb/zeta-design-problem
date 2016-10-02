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


document.addEventListener('DOMContentLoaded', function() {
   loadData(function (response) {
        var ele = document.getElementById('tweets');
        
        ele.innerHTML = response;
    });
}, false);