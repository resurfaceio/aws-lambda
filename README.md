# aws-lambda
Capture API calls from your API Gateway to your own <a href="https://resurface.io">security data lake</a> using AWS Lambda.

[![License](https://img.shields.io/github/license/resurfaceio/aws-lambda)](https://github.com/resurfaceio/aws-lambda/blob/master/LICENSE)
[![Contributing](https://img.shields.io/badge/contributions-welcome-green.svg)](https://github.com/resurfaceio/aws-lambda/blob/master/CONTRIBUTING.md)

## Contents

- [Deployment](#deployment)
- [Capturing API Calls](#capturing-api-calls)
- [Environment Variables](#environment-variables)
- [Protecting User Privacy](#protecting-user-privacy)

## Deployment

### Automatic deployment

Click the **Launch Stack** button below to deploy all necessary resources as a _CloudFormation_ stack:

[![Launch AWS Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=apisec-lambda&templateURL=https%3A%2F%2Fapisec-cf-templates.s3.amazonaws.com%2Fcapture%2Flambda%2Flambda.json)

This creates, configures and deploys a _Lambda_ function with its corresponding _CloudWatch_ log group, together with a basic _IAM_ role and policy for lambda execution.

Select the **Event Source**, and enter the **Resurface URL** and **Resurface Rules** parameters. Each corresponds to the `EVENT_SOURCE`, `USAGE_LOGGERS_URL`, and `USAGE_LOGGERS_RULES` [environment variables](#environment-variables), respectively.

Take note of function name as well as its URL. Both can be found on the `Outputs` tab once CloudFormation finishes the stack deployment.

### Manual deployment

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
- Using the AWS console, go to the **Code** section of your lambda function. Click **Upload from**, then **.zip file**, and select the the `lambda-logger.zip` file that you just created.
- Add the [necessary environment variables](#environment-variables) `USAGE_LOGGERS_URL` and `EVENT_SOURCE` in accordance to your use case.

## Capturing API Calls

### Software AG webMethods API Gateway

- Create a new AWS alias if it doesn't exist already by navigating to **Administration > AWS Configuration > Add new AWS account** in your webMethods gateway.
- Navigate to **Administration > Destinations > Custom destinations** and create an [AWS Lambda custom destination](https://docs.webmethods.io/api/10.12.0/webmethods_api_cloud__api_gateway_user_s_guide/chapter14/#how-do-i-publish-data-to-an-aws-lambda-function-using-custom-destination).
- Go to **Policies > Global policies** and enable the **Transaction logging** global policy.
- Configure the **Transaction logging** policy by navigating to **Policies > Transaction logging > Log Invocation**. Once there,
  - Enable **Store Request Headers**, **Store Request Payload**, **Store Response Headers**, and **Store Response Payload**.
  - Set **Log Generation Frequency** to `Always`.
  - Select the AWS Lambda custom destination that was just created.
- Make calls to an active API endpoint. Verify that data flows into Resurface accordingly.

## Environment Variables

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
<small>&copy; 2016-2024 <a href="https://resurface.io">Graylog, Inc.</a></small>
