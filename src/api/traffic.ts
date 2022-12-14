import {buildWebSocketURL, getURLAndInit} from '../misc/request-helper';

const endpoint = '/traffic';
const textDecoder = new TextDecoder('utf-8');

const Size = 150;

const traffic = {
    labels: Array(Size),
    // labels: [],
    up: Array(Size),
    down: Array(Size),

    size: Size,
    subscribers: [],
    appendData(o) {
        this.up.push(o.up);
        this.down.push(o.down);
        const t = new Date();
        const l = '' + t.getMinutes() + t.getSeconds();
        this.labels.push(l);
        if (this.up.length > this.size) this.up.shift();
        if (this.down.length > this.size) this.down.shift();
        if (this.labels.length > this.size) this.labels.shift();

        this.subscribers.forEach((f) => f(o));
    },

    subscribe(listener) {
        this.subscribers.push(listener);
        return () => {
            const idx = this.subscribers.indexOf(listener);
            this.subscribers.splice(idx, 1);
        };
    },
};

let fetched = false;
let decoded = '';

function parseAndAppend(x) {
    traffic.appendData(JSON.parse(x));
}

function pump(reader) {
    return reader.read().then(({done, value}) => {
        const str = textDecoder.decode(value, {stream: !done});
        decoded += str;

        const splits = decoded.split('\n');

        const lastSplit = splits[splits.length - 1];

        for (let i = 0; i < splits.length - 1; i++) {
            parseAndAppend(splits[i]);
        }

        if (done) {
            parseAndAppend(lastSplit);
            decoded = '';

            // eslint-disable-next-line no-console
            console.log('GET /traffic streaming done');
            fetched = false;
            return;
        } else {
            decoded = lastSplit;
        }
        return pump(reader);
    });
}

// 1 OPEN
// other value CLOSED
// similar to ws readyState but not the same
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
let wsState;

function fetchData(apiConfig) {
    if (fetched || wsState === 1) return traffic;
    wsState = 1;
    const url = buildWebSocketURL(apiConfig, endpoint);
    const ws = null;
    newWebSocket(ws, url);
    if(wsState == 3){fetchDataWithFetch(apiConfig);};
    // const ws = new WebSocket(url);
    // ws.addEventListener('error', function (_ev) {
    //     wsState = 3;
    //     console.log(_ev)
    //     ws.close();
    // });
    // ws.addEventListener('close', function (_ev) {
    //     wsState = 3;
    //     newWebSocket(ws, url);
    //     fetchDataWithFetch(apiConfig);
    // });
    // ws.addEventListener('message', function (event) {
    //     parseAndAppend(event.data);
    // });
    return traffic;
}

let timer: number;

function newWebSocket(ws: WebSocket, url: string) {
    timer = setTimeout(function () {
        if (wsState == 1) {
            clearTimeout(timer);
        }else {
            console.log("traffic ws timeout reconect")
            newWebSocket(ws, url);
        }
    }, 1000);
    try {
        if (ws) {
            ws.close();
        }
    }catch (e) {

    };
    try {
        ws = new WebSocket(url);
        ws.addEventListener('error', () => (wsState = 3, ws.close()));
        ws.addEventListener('close', function (_ev) {
            wsState = 3;
        });
        ws.addEventListener('message', (event) => parseAndAppend(event.data));
        wsState = 1;
    }catch (e) {
        console.log(e);
    }
}

function fetchDataWithFetch(apiConfig) {
    if (fetched) return traffic;
    fetched = true;
    const {url, init} = getURLAndInit(apiConfig);
    fetch(url + endpoint, init).then(
        (response) => {
            if (response.ok) {
                const reader = response.body.getReader();
                pump(reader);
            } else {
                fetched = false;
            }
        },
        (err) => {
            // eslint-disable-next-line no-console
            console.log('fetch /traffic error', err);
            fetched = false;
        }
    );
    return traffic;
}

export {fetchData};
