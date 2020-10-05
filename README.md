# Serverless Node.js generateUpdateStatement in TypeScript

For this take home project I used a different node starter. This uses Serverless, node.js and TypeScript.
Because the API is used internally, there is no need to validate tokens, or make a login or signup endpoint. 
So I choose this [starter](https://github.com/AnomalyInnovations/serverless-nodejs-starter) to show how we can implement Typescript and OOP in a lambda function with serverless. This API could be deployed in AWS with a proper configuration and used as a service.

### Requirements

- [Install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)

### Installation

To create a new Serverless project.

``` bash
$ serverless install --url https://github.com/mtoscan/generate-update-statement-typescript --name my-project
```

Enter the new directory

``` bash
$ cd my-project
```

Install the Node.js packages

``` bash
$ npm install
```

### Usage

To run a function on your local

``` bash
$ serverless invoke local --function hello
```

To simulate API Gateway locally using [serverless-offline](https://github.com/dherault/serverless-offline)

``` bash
$ serverless offline start
```

### Running Tests

Run your tests using

``` bash
$ npm test
```

I'm using Jest to run the tests. You can read more about setting up your tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content).


### List of changes or Improvements pending
- Improve type definitions to avoid use of any.
- More unit test cases
- Add environment variables
- Config serverless to deploy to AWS

### Postman File
You can import the file `Backend_Take_Home.postman_collection.json` in your postman app. You will find a collection of post request using the same data used in the test cases. Is required to simulate the API Gateway locally with serverless offline.