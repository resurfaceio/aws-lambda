const { HttpLogger, HttpMessage } = require('resurfaceio-logger');
const { processEvent } = require('./lib/softwareag')

let logger = new HttpLogger({rules: 'include debug'});

exports.handler = async (event) => {
    const now = Date.now().toString();
    const call = processEvent(event);
    
    return HttpMessage.send(
        logger,
        call.request,
        call.response,
        call.response_body,
        call.request_body,
        now,
        call.interval
    );    
};
