const playlistDB = require('../db/playlist')
const pinDB = require('../db/pin')
const recordDB = require('../db/record')
const { encodeURL, decodeURL } = require('./cryptoUtils')
const axios = require('axios');
const lyricdb = require("../db/lyric.js");
async function onLoaded() {
    return true
}
async function searchLyrics(keyword) {
    let res = await lyricdb.searchLyric(keyword)
    res = res
        .map(x => ({
            artist: x.artist,
            name: x.title,
            id: x.songId,
            source: "poka",
            lyric: x.lyric
        }))
        .filter(x => x.lyric != '[00:00.000]')
    return { lyrics: res };
}


async function getCover(data) {
    let url = decodeURL(data)
    if (url) {
        return (await axios.get(url, {
            responseType: 'stream',
        })).data
    } else {
        return null
    }
}
async function getPlaylists(userId) {
    return ({
        playlists: [
            ...(await playlistDB.getParsedUserPlaylists(userId)),
            { name: "最近聽過", source: "poka", id: "listenedRecently", image: `/img/playlist/listenedRecently.jpg` }
        ]
    })
}
async function getPlaylistSongs(id, userId) {
    if (id == 'listenedRecently') {
        return ({
            songs: (await recordDB.fetchListenedRecently(userId)),
            playlists: [{
                name: "最近聽過",
                source: "poka",
                id: "listenedRecently"
            }]
        })
    }
    else {
        return (await playlistDB.getParsedUserPlaylistById(id, userId))
    }
}
async function getHome(userId) {
    let pins = {
        title: 'home_pins',
        source: "poka",
        icon: "push_pin",
        artists: [],
        composers: [],
        folders: [],
        playlists: [],
        albums: []
    };
    let pinsData = await pinDB.getPins(userId)
    pinsData.map(x => {
        try {
            pins[{ artist: 'artists', composer: 'composers', folder: 'folders', playlist: 'playlists', album: 'albums' }[x.type]].push(x)
        }
        catch (e) {
            throw new Error(`${e} ${JSON.stringify(x)}`);
        }
    })
    return [pins]
}
module.exports = {
    name: "poka",
    enabled: true,
    onLoaded,
    searchLyrics,
    getPlaylists,
    getPlaylistSongs,
    getHome,
    getCover,
};