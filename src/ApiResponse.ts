import { APIGatewayProxyResult } from 'aws-lambda';

export class ApiResponse {
  static status200(body: { [key: string]: any }): APIGatewayProxyResult {
    return {
      statusCode: 200,
      body: JSON.stringify(body, null, 2),
    };
  }

  static status400(body: { [key: string]: any }): APIGatewayProxyResult {
    return {
      statusCode: 400,
      body: JSON.stringify(body, null, 2),
    };
  }

  static status500(body: { [key: string]: any }): APIGatewayProxyResult {
    return {
      statusCode: 500,
      body: JSON.stringify(body, null, 2),
    };
  }
}
