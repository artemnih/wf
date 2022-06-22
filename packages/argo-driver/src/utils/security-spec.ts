import {SecuritySchemeObject, ReferenceObject} from '@loopback/openapi-v3';

require('dotenv').config();
const argoConfig = require('config');

export const OPERATION_SECURITY_SPEC = [{bearerAuth: []}];
export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};
export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
  openId: {
    type: 'openIdConnect',
    openIdConnectUrl: argoConfig.services.auth.authUrl + '/auth/' + argoConfig.services.auth.tenant + '/.well-known/openid-configuration',
  },
};