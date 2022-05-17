# resurfaceio-aws-lambda
Easily log API requests and responses to your own [system of record](https://resurface.io/).

## Requirements

- docker
- [Resurface](https://resurface.io/installation) (free Docker container)
- An AWS subscription might be required in order to deploy AWS Lambda functions.

## Set up

### Automatic set up

Click the **Launch Stack** button below to deploy all necessary resources as a _CloudFormation stack_:

[![Launch AWS Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=resurface-lambda&templateURL=https%3A%2F%2Fresurfacetemplates.s3.us-west-2.amazonaws.com%2Flambda.json)

This creates, configures and deploys a _Lambda Function_ with its corresponding _CloudWatch_ log group, together with a basic _IAM_ role and policy for lambda execution.

Select the **Event Source**, and enter the **Resurface URL** and **Resurface Rules** parameters. Each corresponds to [the `EVENT_SOURCE`, `USAGE_LOGGERS_URL`, and `USAGE_LOGGERS_RULES` environment variables](#environment-variables), respectively.

Take note of function name as well as its URL. Both can be found on the `Outputs` tab once CloudFormation finishes the stack deployment.

### Manual set up

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
zip -r logger-lambda.zip *
```
- Create new Lambda function. Remember to enable the function URL when creating the function. Take note of this URL as well as the function's name.
- Using the AWS console, go to the _Code_ section of your lambda function. Click _Upload from_, then _.zip file_, and select the the `lambda-logger.zip` file that you just created.
- Add the [necessary environment variables](#environment-variables) `USAGE_LOGGERS_URL` and `EVENT_SOURCE` in accordance to your use case.

## Capturing API Calls

### Software AG webMethods API Gateway

- Create a new AWS alias if it doesn't exist already by navigating to _Administration_ > _AWS Configuration_ > _Add new AWS account_ in your webMethods gateway.
- Navigating to _Administration_ > _Destinations_ > _Custom destinations_ and create an [AWS Lambda custom destination](https://docs.webmethods.io/api/10.12.0/webmethods_api_cloud__api_gateway_user_s_guide/chapter14/#how-do-i-publish-data-to-an-aws-lambda-function-using-custom-destination).
- Go to _Policies_ > _Global policies_ and enable the **Transaction logging** global policy.
- Configure the **Transaction logging** policy by navigating to _Policies_ > _Transaction logging_ > _Log Invocation_. Once there,
  - Enable `Store Request Headers`, `Store Request Payload`, `Store Response Headers`, and `Store Response Payload`.
  - Set `Log Generation Frequency` to `Always`.
  - Select the AWS Lambda custom destination that you just created.
- Make calls to an active API endpoint. Verify that data flows into Resurface accordingly.

## Environment variables

This lambda function has access to five environment variables, but only two of them are required for the logger to work properly.

#### ✔ All API calls must be parsed according to the structure of the incoming data
The environment variable `EVENT_SOURCE` stores a string that identifies the library to use when parsing data from each incoming event. For example, by setting the variable to `"softwareag"`, the function is then able to read event data sent by the Software AG webMethods API Gateway. See [capturing data from custom events](/API.md) for more info on the current available event sources, as well as how to adapt this function to your own event sources.
#### ✔ All API calls are sent to the database running inside a docker container
The environment variable `USAGE_LOGGERS_URL` stores this address, which by default should be the string `"http://localhost:7701/message"`. See [running Resurface locally](https://resurface.io/docs#running-on-docker)) for more info.
#### ✔ All API calls are filtered using a set of rules (Optional)
The environment variable `USAGE_LOGGERS_RULES` stores these [logging rules](#protecting-user-privacy) as a string. Even though this variable is optional, it is recommended to set it to `"include debug"` or `"allow_http_url"` when trying the lambda function for the first time.
#### ✔ Reponse bodies are logged up to a certain size (Optional)
If you are working with large response payloads and don't want to log the whole thing, you can use the environment variable `USAGE_LOGGERS_LIMIT`. It stores an integer value corresponding to the number of bytes after which a response body will not be logged (by default, this upper limit is 1 MiB).
#### ✔ The Logger can be disabled without deleting the lambda function (Optional)
By setting the environment variable `USAGE_LOGGERS_DISABLE` to `true` the logger will be disabled and no API calls will be logged.


## Protecting User Privacy

Loggers always have an active set of <a href="https://resurface.io/logging-rules">rules</a> that control what data is logged
and how sensitive data is masked. All of the examples above apply a predefined set of rules (`include debug`),
but logging rules are easily customized to meet the needs of any application.

<a href="https://resurface.io/logging-rules">Logging rules documentation</a>

---
<small>&copy; 2016-2022 <a href="https://resurface.io">Resurface Labs Inc.</a></small>
