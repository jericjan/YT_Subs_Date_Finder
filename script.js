window.yt_access_token = ""

const client = google.accounts.oauth2.initTokenClient({
    client_id: '154323543875-baq9eeiqmsetge8fidvcgap9toi8jkfb.apps.googleusercontent.com',
    callback: (response) => {
        window.yt_access_token = response.access_token
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
});

document.querySelector('#authorizeButton').onclick = function () {
    client.requestAccessToken();
};

async function getResponse() {
    if (window.yt_access_token == "") {
        alert("YOu have authorized yet lmao")
    } else {

        var running = true
        var pageToken = ""
        var responseText = ""
        while (running == true) {
            var url = "https://content-youtube.googleapis.com/youtube/v3/subscriptions?channelId=UCJ8IcSP4kUl8VTedFlHkM4A&part=contentDetails%2C%20snippet&maxResults=50"
            if (pageToken != "") {
                url += pageToken
            }
            var response = await fetch(url, {
                "headers": {
                    "authorization": "Bearer " + window.yt_access_token,
                },
                "method": "GET",
            })
            var jsoned = await response.json()
            for (var x of jsoned['items']) {
                var title = x['snippet']['title']
                var date = x['snippet']['publishedAt']
                responseText += title + " - "
                responseText += new Date(date) + "\n\n"
            }
            if ("nextPageToken" in jsoned) {
                pageToken = "&pageToken=" + jsoned['nextPageToken']
            } else {
                running = false
            }

        }
        var myblob = new Blob([responseText], {
            type: 'text/plain;charset=utf8'
        });
        var blobUrl = URL.createObjectURL(myblob);
        window.open(blobUrl)
    }
}




document.querySelector('#getSubsButton').onclick = function () {
    getResponse()
}
