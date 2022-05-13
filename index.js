const { URL } = require('url');
const {
    HttpLogger,
    HttpMessage,
    HttpRequestImpl,
    HttpResponseImpl
} = require('resurfaceio-logger');

let logger = new HttpLogger({rules: 'include debug'});

exports.handler = async (event) => {
    const request = new HttpRequestImpl();
    const response = new HttpResponseImpl();
    const url = new URL(event.nativeURL);
    
    request.hostname = url.hostname;
    request.protocol = url.protocol;
    request.url = url.pathname;
    
    request.method = event.nativeHttpMethod;
    
    for (const key of Object.keys(event.requestHeaders)) {
        request.addHeader(key, event.requestHeaders[key]);
    }
    
    for (const key of Object.keys(event.queryParameters)) {
        request.addQueryParam(key, event.queryParameters[key]);
    }
    
    response.statusCode = event.responseCode;
    
    for (const key of Object.keys(event.nativeResponseHeaders)) {
        response.addHeader(key, event.nativeResponseHeaders[key]);
    }
    const now = Date.now().toString();
    const interval = event.providerTime;
    return HttpMessage.send(
        logger,
        request,
        response,
        event.nativeResponsePayload,
        event.nativeRequestPayload,
        now,
        interval
    );    
};
