// © 2016-2023 Resurface Labs Inc.

const { URL } = require('url');
const { HttpRequestImpl, HttpResponseImpl } = require('resurfaceio-logger');

module.exports.processEvent = (lambdaEvent) => {
    const request = new HttpRequestImpl();
    const response = new HttpResponseImpl();

    const url = new URL(lambdaEvent.nativeURL);
    request.url = url.pathname;
    request.hostname = url.hostname;
    request.protocol = url.protocol;

    request.method = lambdaEvent.nativeHttpMethod;
    if (lambdaEvent.requestHeaders) {
        for (const key of Object.keys(lambdaEvent.requestHeaders)) {
            request.addHeader(key, lambdaEvent.requestHeaders[key]);
        }
    }
    if (lambdaEvent.queryParameters) {
        for (const key of Object.keys(lambdaEvent.queryParameters)) {
            request.addQueryParam(key, lambdaEvent.queryParameters[key]);
        }
    }
    
    response.statusCode = lambdaEvent.responseCode;
    if (lambdaEvent.nativeResponseHeaders) {
        for (const key of Object.keys(lambdaEvent.nativeResponseHeaders)) {
            response.addHeader(key, lambdaEvent.nativeResponseHeaders[key]);
        }
    }
    
    return {
        request: request,
        response: response,
        request_body: lambdaEvent.nativeRequestPayload || "",
        response_body: lambdaEvent.nativeResponsePayload || "",
        interval: lambdaEvent.providerTime
    }
}
