const url = "https://api.coincap.io/v2";

const getAssets = () => {
    return callFetch(`${url}/assets?limit=20`)
}

const getAsset = (coin) => {
    return callFetch(`${url}/assets/${coin}`)
}

const getAssetHistory = (coin) => {
    const now = new Date();
    const end = now.getTime()
    now.setDate(now.getDate() - 1)
    const start = now.getTime()

    return callFetch(`${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`)
}

const getMarkets = (coin) => {
    return callFetch(`${url}/assets/${coin}/markets?limit=5`)
}

const getExchange = (id) => {
    return callFetch(`${url}/exchanges/${id}`)
}

const callFetch = (urlInt) => {
    return fetch(urlInt)
    .then(res => res.json())
    .then(res => res.data )
    .catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
}

export default{ getAssets, getAsset, getAssetHistory, getMarkets, getExchange }

