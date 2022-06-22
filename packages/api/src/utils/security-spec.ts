import {SecuritySchemeObject, ReferenceObject} from '@loopback/openapi-v3';

require('dotenv').config();
const argoConfig = require('config');

export const OPERATION_SECURITY_SPEC = [{oauth2: []}];
export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};
export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  oauth2: {
    type: 'oauth2',
    flows: {
      authorizationCode: {
        authorizationUrl: argoConfig.services.auth.authUrl + '/auth/' + argoConfig.services.auth.tenant + '/authorize',
        tokenUrl: argoConfig.services.auth.authUrl + '/auth/' + argoConfig.services.auth.tenant + '/oidc/token',
        scopes: {
          'openid': 'openid',
          'offline_access': 'offline_access',
        },
      },
    },
  },
};