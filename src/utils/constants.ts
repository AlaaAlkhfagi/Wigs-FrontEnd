export const ARTICLE_PER_PAGE = 10;

const PRODUCTION_DOMAIN = "http://localhost:5000/api/v1";
const DEVELOPMENT_DOMAIN = "http://localhost:5000/api/v1";

export const DOMAIN = process.env.NODE_ENV === 'production' 
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;
