export const excludeField = ["searchTerm", "sort", "fields", "page", "limit"];
export const cacheKeys = {
  OTP_EXPIRATION: 2 * 60,
  USER_LIST: "userList:GET:/all-users",
  PRODUCT_LIST: "productList:GET:/all-products",
  ORDER_LIST: "orderList:GET:/all-orders",
  // অন্য যেকোন সার্ভিসের key এখানে add করবেন
};
