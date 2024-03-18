import Joi, { ObjectSchema } from 'joi';

type AtLeastOnePropertyOf<T> = {
  [K in keyof T]: { [L in K]: T[L] } & { [L in Exclude<keyof T, K>]?: T[L] };
}[keyof T];

type RequestObjectSchema = {
  params: ObjectSchema;
  query: ObjectSchema;
  body: ObjectSchema;
};

type RequestSchema = AtLeastOnePropertyOf<RequestObjectSchema>;

export type MethodSchema = {
  get?: RequestSchema;
  post?: RequestSchema;
  patch?: RequestSchema;
  delete?: RequestSchema;
};

export type EndpointConfig = {
  schemas: MethodSchema;
};

type EndpointsConfig = { [key: string]: EndpointConfig };

const endpointsConfig: EndpointsConfig = {
  '/api/v1/account/:id': {
    schemas: {
      get: {
        params: Joi.object().keys({
          id: Joi.number().required(),
        }),
      },
      patch: {
        body: Joi.object().keys({
          name: Joi.string(),
          email: Joi.string().email(),
          phone: Joi.string(),
          address: Joi.string(),
        }),
      },
      delete: {
        params: Joi.object().keys({
          id: Joi.number().required(),
        }),
      },
    },
  },
  '/api/v1/account': {
    schemas: {
      post: {
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required().email(),
          phone: Joi.string(),
          address: Joi.string(),
        }),
      },
    },
  },
};

export const getSchemaConfig = (path: string): EndpointConfig | null => {
  return endpointsConfig[path] || null;
};
