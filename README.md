# resurfaceio-aws-lambda
Log API requests and responses with AWS Lambda

//TODO

## Testing

- Clone repo
```bash
git clone https://github.com/resurfaceio/aws-lambda.git
cd aws-lambda
```
- Install dependencies
```bash
npm install resurfaceio-logger --save
```
- Make zip file
```bash
zip -r resurface.zip *
```

- Create new Lambda function
- Go to the Code tab, and click _Upload from_, then _.zip file_ and upload `resurface.zip`
- Add `USAGE_LOGGERS_URL` environment variable pointing to Resurface `/message` endpoint
- Configure Software AG API management plaftorm/webMethods API gateway:
  - Create new AWS alias (the software ag one, not the actual aws one) if it doesn't exist already: _Administration_ > _AWS Configuration_ > _Add new AWS account_
  - Create an [AWS Lambda custom destination](https://docs.webmethods.io/api/10.12.0/webmethods_api_cloud__api_gateway_user_s_guide/chapter14/#how-do-i-publish-data-to-an-aws-lambda-function-using-custom-destination): _Administration_ > _Destinations_ > _Custom destinations_
  - Enable `Transaction logging` global policy
  - Configure `Transaction logging` policy and enable `Store Request Headers`, `Store Request Payload`, `Store Response Headers` and `Store Response Payload`. Set `Log Generation Frequency` to `Always`. Select you AWS Lambda custom destination: _Policies_ > _Transaction logging_ > _Log Invocation_
- Make calls to an active API endpoint. Verify that data flows into Resurface accordingly.
