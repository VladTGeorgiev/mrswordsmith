import { RequestHandler } from 'express';
import { ValidationResult } from 'joi';
import { getSchemaConfig, MethodSchema } from './account';
import logger from '../../../../lib/logger';
import { HTTPStatusCode, replyWithError } from '../../../utils/apiResponse';
import { appError, AppErrorSeverity } from '../../../../lib/errors';

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: true,
};

export const validateSchema = (path: string): RequestHandler => {
  const endpointConfig = getSchemaConfig(path);

  if (!endpointConfig) {
    const message = `No schema found for path: ${path}`;
    logger.error('Request validation', message);

    throw appError(AppErrorSeverity.CRITICAL, 'Request validation', message);
  }

  return (req, res, next) => {
    const method = req.method.toLowerCase() as keyof MethodSchema;

    const methodSchema = endpointConfig.schemas[method];
    if (!methodSchema) return next();

    for (const [field, schema] of Object.entries(methodSchema)) {
      const reqField = field as 'params' | 'body' | 'query';
      const { error, value }: ValidationResult<any> = schema.validate(
        req[reqField],
        validationOptions
      );

      if (error) {
        logger.warn('Request validation', `${JSON.stringify(error.details)}`);

        return replyWithError(res, 'Validation Error', HTTPStatusCode.BAD_REQUEST, error.details);
      }

      req[reqField] = value;
    }

    return next();
  };
};
