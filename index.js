// © 2016-2023 Resurface Labs Inc.

const { HttpLogger, HttpMessage } = require('resurfaceio-logger');
const { processEvent } = require('./lib/' + process.env.EVENT_SOURCE);

const RESPONSE_BODY_LIMIT = 1024 * 1024;
let environment = {
    rules: process.env.USAGE_LOGGERS_RULES,
    body_limit: process.env.USAGE_LOGGERS_LIMIT || RESPONSE_BODY_LIMIT,
    queue: process.env.USAGE_LOGGERS_QUEUE
};
let logger = new HttpLogger(environment);

exports.handler = async (event) => {
    const now = Date.now().toString();
    const call = processEvent(event);
    const response_body = call.response_body;
    if (response_body.length > environment.body_limit) {
        response_body = `{"overflowed: ${response_body.length}"}`;
    }

    return HttpMessage.send(
        logger,
        call.request,
        call.response,
        response_body,
        call.request_body,
        now,
        call.interval
    );    
};
