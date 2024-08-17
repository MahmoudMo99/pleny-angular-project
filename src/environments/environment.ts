const DOMAIN = 'https://dummyjson.com/';

export const environment = {
  domain: DOMAIN,
  loginUrl: `${DOMAIN}auth/login`,
  categoriesUrl: `${DOMAIN}products/category-list`,
  productsUrl: `${DOMAIN}products`,
  categoryProductsUrl: `${DOMAIN}products/category/`,
  searchProductsUrl: `${DOMAIN}products/search`,
};
