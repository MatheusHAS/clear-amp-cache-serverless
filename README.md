# clear-amp-cache-serverless
Service to clear cache for Accelerated Mobile Pages on all Content Delivery Network (CDN) servers.

## Information
This guide helps you who already have [Accelerated Mobile Pages (AMP)](https://amp.dev/about/how-amp-works/), to update your content more quickly.

To use google `/update-cache`, you need generate 1 RSA key pair. To generate, follow [this guide of google](https://developers.google.com/amp/cache/update-cache#rsa-keys)

After generate you pair, you need move file `private-key.pem` to `src/assets` folder. 

## Setup

```bash
npm install
# or
yarn install
```

## Configure
Open in your editor the file `env.dev.yml` and update only `SITE_DOMAIN` for your website address.

## Run service offline

```bash
$ npm start
# or
$ yarn start
```

if you have success to run, you will receive a message similar to this:
```bash
serverless offline --stage=dev

offline: Starting Offline: dev/sa-east-1.
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                                                                         │
   │   POST | http://localhost:3000/dev/amp/clear-cache                      │
   │   POST | http://localhost:3000/2015-03-31/functions/clearCache/invocations   │
   │                                                                         │
   └─────────────────────────────────────────────────────────────────────────┘

offline: [HTTP] server ready: http://localhost:3000 🚀
offline:
offline: Enter "rp" to replay the last request
```

## Use
After run service, locate your endpoint, by default is: `http://localhost:3000/dev/amp/clear-cache`

and send `POST` request to your endpoint with body
```json
{
  "urls": ["/path/to/your/page/amp"]
}
```
where `urls` is one array of `amp path pages` 

## Todo
- [ ] add to run using [Docker](https://www.docker.com/)

## Dependencies
| Name  | Link  |
|---|---|
| node | [here](https://nodejs.org/en/) |
| axios | [here](https://www.npmjs.com/package/axios) |
| middy | [here](https://www.npmjs.com/package/middy) |
| serverless | [here](https://serverless.com/framework/docs/getting-started/) |
| serverless-offline  | [here](https://www.npmjs.com/package/serverless-offline) |
