console.time("got artists");
const artists = ["Black Box Revelation", "Vance Joy", "Bastille", "Elbow", "Paul Kalkbrenner", "Weezer", "Bring Me The Horizon", "The Cure", "Tool", "Beirut", "Tourist LeMC", "Bear's Den", "Macklemore", "Florence + The Machine", "Mumford & Sons", "Yungblud", "Balthazar", "Greta Van Fleet", "Muse", "New Order"]
//use %20 for space in search
const rp = require('request-promise');


const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer BQAJtCnX3k2dvqAZQaB09SO4Qrz0DGKVA1o0h959FMu9w14iqn8O_MuRtfnGn8KM-y5DL1xexYhWN6qQHHqpdW3HCAS9hq2tynNQHX9_4gGAY5GytmFD82xR2LDwspFBzAzfEMYlcJYNKKrPGbaqILXcpXjICgWQBgYnMtDbWvq_DLYZN9xMPkZ3SPXtmbIgLpPSdZd1KPpwu-4tiPQZlYXbITKCmaEObA9lzTVrozJ6JyKPQzGFw6DS-JXX-vUn8yNM4YBkOh4wai_YSqI'
};

let options = {
    url: 'https://api.spotify.com/v1/search?q=Black%20Box%20Revelation&type=artist&market=BE&limit=1',
    headers: headers
};

// create a list of encoded artists
let encodedArtists = [];
artists.forEach(element => {
    encodedArtists.push(encodeURIComponent(element.trim()));
});

// create a list of all the artists id's
let artistIds = [];
// getId takes an encoded name and returns the id
async function getAllIds(list){
    const promises = [];
    for (let i = 0; i < list.length; i++) {
        //artistIds.push(await getId(list[i]));
        const getPromise = getId(list[i]);
        promises.push(getPromise);
    }
    return await Promise.all(promises);
}
async function getId(element){
    options["url"] = 'https://api.spotify.com/v1/search?q=' + element + '&type=artist&market=SE';
    let id = await rp(options).catch(e => console.log(e));
    return JSON.parse(id)["artists"]["items"][0]["id"];
}

// get top tracks
var trackHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer BQC0oviH1n4ySOzO63Z43hd2ecp-7zfT82CRGs4PXhcwL_csuPhhgeBH7K7f6NkuVSysvIJcaYaC0QBdYGTsTaxUuaSPkUiHWZHypbVHH9I51WXzuh4bWdOvBePHyzPeuTsdYWoHTpIve_-EAQOTmxgu9SDNyIqrOp3lFgQPZNlDtLePMusNW3bQvURHFFThLs9UQh-H-YGkN0sedpN0VMidw8R-sB3Ro646bpsIe0nKPadM5Gv5KP5yGA5EHG4LisVCzmvNsWr3V0lnlJo'
};

var trackOptions = {
    url: 'https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/top-tracks?country=BE',
    headers: headers
};
let playlistIds = [];
async function getTracks(a){
    trackOptions['url'] = 'https://api.spotify.com/v1/artists/'+ a +'/top-tracks?country=BE';
    let track = await rp(trackOptions).catch(e => console.log(e));
    return JSON.parse(track);
}

async function addSongsToPlaylist(list){
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer BQAJtCnX3k2dvqAZQaB09SO4Qrz0DGKVA1o0h959FMu9w14iqn8O_MuRtfnGn8KM-y5DL1xexYhWN6qQHHqpdW3HCAS9hq2tynNQHX9_4gGAY5GytmFD82xR2LDwspFBzAzfEMYlcJYNKKrPGbaqILXcpXjICgWQBgYnMtDbWvq_DLYZN9xMPkZ3SPXtmbIgLpPSdZd1KPpwu-4tiPQZlYXbITKCmaEObA9lzTVrozJ6JyKPQzGFw6DS-JXX-vUn8yNM4YBkOh4wai_YSqI'
    };

    var options = {
        url: 'https://api.spotify.com/v1/playlists/0dku26sRKdFVemrFIcMfEk/tracks?uris=spotify%3Atrack%3A2wpZq7sSxrP8PL6kDtdAoE',
        method: 'POST',
        headers: headers
    };
    // create a string with all uris
    for (let i = 0; i < list.length; i++) {
        console.log("adding track " + i);
        options['url'] = 'https://api.spotify.com/v1/playlists/0dku26sRKdFVemrFIcMfEk/tracks?uris=spotify%3Atrack%3A' + list[i];
        rp(options).catch(e => console.log(e));
        await sleep(100);
    }
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

getAllIds(encodedArtists)
    .then(r => {
        artistIds = r;
    })
    .then(async () => {
        const promises = [];
        for (let i = 0; i < artistIds.length; i++) {
            const getPromise = getTracks(artistIds[i]);
            promises.push(getPromise);
        }
        let tracks = await Promise.all(promises);
        //a list of 10 tracks by artists
        let allTracks = [];
        for (let i = 0; i < tracks.length; i++) {
            for (let j = 0; j < tracks[i]["tracks"].length; j++) {
                allTracks.push(tracks[i]["tracks"][j]["id"]);
            }
        }
        // list of all ids
        console.log(allTracks);
        //for (let i = 0; i < allTracks.length; i++) {
            addSongsToPlaylist(allTracks).catch(e => console.log(e));
        //}


    })
    .then(() => console.timeEnd("got artists"));

