const client = google.accounts.oauth2.initTokenClient({
    client_id: '154323543875-baq9eeiqmsetge8fidvcgap9toi8jkfb.apps.googleusercontent.com',
    callback: (response) => {
   console.log(response)
  },
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });
  client.requestAccessToken();