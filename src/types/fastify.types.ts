export interface Request {
  Body: Body;
  Querystring: Query;
  Params: Params;
  Headers: {
    Authorization: string;
  };
}

export interface Body {
  user: string;
  domain: string;
  secret: string;
}

export interface Params {
  user?: string;
  domain?: string;
  secret?: string;
}

export interface Query {
  domain?: string;
  secret?: string;
}
