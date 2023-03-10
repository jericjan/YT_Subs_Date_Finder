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
        alert("You have not authorized yet lmao")
    } else {

        var running = true
        var pageToken = ""
        var responseText = ""
        var foundChannels = 0
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
            var totalSubs = jsoned['pageInfo']['totalResults']

            document.querySelector("#channels").innerHTML = ""
            const template = document.getElementById("li_template");
            const elements = new Set();
            for (var x of jsoned['items']) {
                var title = x['snippet']['title']
                var date = x['snippet']['publishedAt']
                var pfp = x['snippet']['thumbnails']['default']['url']
                var channelID = x['snippet']['channelId']
                // responseText += title + " - "
                // responseText += new Date(date) + "\n\n"

                var element = template.content.firstElementChild.cloneNode(true);

                element.querySelector(".channelTitle").textContent = title;
                element.querySelector(".channelDate").textContent = new Date(date);
                element.querySelector(".pfpDiv > pfp").src = pfp;
                element.querySelector(".channelContainer.").href = "https://www.youtube.com/channel/" + channelID
                elements.add(element);
                


                // channelName = document.createElement("h1")
                // channelName.innerHTML = title
                // subDate = document.createElement("a")
                // subDate.innerHTML = new Date(date)
                // document.querySelector("body").appendChild(channelName)
                // document.querySelector("body").appendChild(subDate)
            }

            document.querySelector("ul").append(...elements);

            foundChannels += jsoned['items'].length
            document.querySelector("#progress").innerHTML = `${foundChannels} / ${totalSubs}`

            if ("nextPageToken" in jsoned) {
                pageToken = "&pageToken=" + jsoned['nextPageToken']
            } else {
                running = false
            }

        }
        // var myblob = new Blob([responseText], {
        //     type: 'text/plain;charset=utf8'
        // });
        // var blobUrl = URL.createObjectURL(myblob);
        // window.open(blobUrl)
    }
}




document.querySelector('#getSubsButton').onclick = function () {
    getResponse()
}
