const http = require('http');
const urls = require('url');

const USAGE_LOGGERS_URL = "PASTE URL HERE"
const target = urls.parse(USAGE_LOGGERS_URL);
const url_options = {
    host: target.host.split(':')[0],
    port: target.port,
    path: target.path,
    method: 'POST',
    headers: {
        'Content-Encoding': 'identity',
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': `Resurface/0.1 (AWS Lambda)`
    }
};

exports.handler = async (event) => {
    // TODO implement
    const msg = { evt: event };
    const response = {
        statusCode: 200,
        message: ""
    };
    return new Promise((resolve) => {
        try {
            const request = http.request(url_options, (resp) => {
                response.message = {
                    status: resp.statusCode,
                    content: msg
                };
                resolve(JSON.stringify(response));
            });
            request.on('error', (err) => {
                response.message = err;
                resolve(JSON.stringify(response));
            });
            request.write(JSON.stringify(msg));
            request.end();
        } catch (e) {
            resolve(e);
        }
    });
};
