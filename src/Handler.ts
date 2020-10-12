import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiResponse } from './ApiResponse';

enum Action {
  ADD = '$add',
  UPDATE = '$update',
  DELETE = '$remove'
}

const ID_KEY = '_id';
const DELETE_KEY = '_delete';
const NO_INDEX = '-1';

class Handler {
  private document: Record<string, any>;

  constructor() {
    this.document = {};
  }

  public async generateUpdateStatement(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
      const parsedBody = JSON.parse(event.body ?? '');
      // Validate Inputs
      if (!parsedBody.document) {
        return ApiResponse.status400({ error: 'Document is required' });
      }
      if (!parsedBody.mutations || !parsedBody.mutations.length) {
        return ApiResponse.status400({ error: 'Mutations are required and should be an array' });
      }

      this.document = parsedBody.document;

      const response: Record<string, any>[] = [];
      parsedBody.mutations.forEach((mutation: Record<string, any>) => {
        response.push(this.flatten(mutation));
      });
      return ApiResponse.status200({ data: response });
    } catch (error) {
      return ApiResponse.status500(error.message);
    }
  }

  private flatten<T extends Record<string, any>>(
    object: T,
    path: string | null = null,
    separator = '.',
  ): T {
    try {
      return Object.keys(object).reduce((acc: T, key: string): T => {
        if (key !== ID_KEY) {
          let index = key;
          if (path && !isNaN(Number(key))) {
            // Search for index with DFS algorithm
            index = this.depthFirstSearchIndex(this.document, object[key][ID_KEY]).toString();
          }
          if (index === NO_INDEX) {
            // Add Statement
            const newPath = [path].filter(Boolean).join(separator);
            return { ...acc, [Action.ADD]: { [newPath]: [object[key]] } };
          }
          if (this.hasDeleteKey(object[key])) {
            // delete Statement
            const newPath = [path, index].filter(Boolean).join(separator);
            return { ...acc, [Action.DELETE]: { [newPath]: object[key][DELETE_KEY] } };
          }
          // Update Statement
          const newPath = [path, index].filter(Boolean).join(separator);
          return typeof object?.[key] === 'object'
            ? { ...acc, ...this.flatten(object[key], newPath, separator) }
            : { ...acc, [Action.UPDATE]: { [newPath]: object[key] } };
        }
        return { ...acc };
      }, {} as T);
    } catch (error) {
      throw new Error('Something wrong happened with flatten method');
    }
  }

  private depthFirstSearchIndex<T extends Record<string, any>>(object: T, _id: number): number {
    let index = -1;
    if (Array.isArray(object)) {
      index = object.findIndex((item: any) => item[ID_KEY] === _id);
      if (index < 0) {
        for (const item of object) {
          index = this.depthFirstSearchIndex(item, _id);
          if (index >= 0) break;
        }
      }
    } else {
      Object.keys(object).forEach((key) => {
        if (Array.isArray(object[key])) index = this.depthFirstSearchIndex(object[key], _id);
      });
    }
    return index;
  }

  private hasDeleteKey<T extends Record<string, any>>(object: T): boolean {
    return object[DELETE_KEY] ?? false;
  }
}

const handler = new Handler();
export const generateUpdateStatement = handler.generateUpdateStatement.bind(handler);
