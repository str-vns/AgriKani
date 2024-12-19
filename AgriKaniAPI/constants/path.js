
module.exports = {
  //User
  USERS: "/users",
  USER_ID: "/users/:id",
  SINGLE_USER: "/user/:id",
  USER_DEVICE_TOKEN: "/deviceToken",
  RESTORE_ID: "/restore/users/:id",
  SOFTDELETE_USER_ID: "/users/softdel/:id",
  RESTORE_ID: "/restore/users/:id",
  WISH_USER_ID: "/wish/users/:productId/:id",
  WISH_ID: "/wish/:id",

  //Auth
  LOGIN: "/signin",
  LOGOUT: "/signout",

  //Product
  PRODUCTS: "/products",
  PRODUCTS_ID: "/products/:id",
  PRODUCTS_EDIT_ID: "/products/edit/:id",
  PRODUCTS_SOFTDEL_ID: "/products/softdel/:id",
  COOP_ONLY_PRODUCTS_ID: "/products/coop/:id",
  RESTORE_PRODUCT_ID: "/restore/products/:id",
  IMAGE_PRODUCT_DELETE: "/products/image/:id/:imageId",
  PRODUCT_ARCHIVE_ID: "/products/archive/:id",
  PRODUCT_ACTIVE_ID: "/products/active/:id",

  //Conversation
  CONVERSATION: "/t",
  CONVERSATION_ID: "/t/:id",
  RESTORE_CONVERSATION_ID: "/restore/t/:id",
  MESSAGE: "/m",
  MESSAGE_ID: "/m/:id",

  //Shipping
  SHIPPING: "/shipping",
  SHIPPING_ID: "/shipping/:id",
  ADDRESS: "/address",
  ADDRESS_ID: "/address/:id",

  //cooperative
  FARM: "/farm",
  FARM_ID: "/farm/:id",
  COOP_USER_ORDERS_ID: "/coop/ordersList/:id",
  COOP_ID_ORDERS: "/coop/orders/:id",
  COOP_ID_UPDATE_ORDERS: "/coop/orders/edit/:id",
  IMAGE_FARM_DELETE: "/farm/image/:id/:imageId",
  RESTORE_FARM_ID: "/restore/farm/:id",
  COOP_ID: "/coop/:id",
  COOP: "/coop",
  COOP_INACTIVE: "/no-approve/coop",
  COOP_ACTIVE: "/yes-approve/coop/:id",
  COOP_DISAPPROVE: "/disapprove/coop/:id",


  //Comment
  COMMENT: "/products/comment",

  //Post
  POST: "/p",
  POST_ID: "/p/:id",
  RESTORE_POST_ID: "/restore/p/:id",
  POST_USER_ID: "/p/user/:id",
  APPROVE_POST: "/p/approve/:id",
  POST_STATUS_APPROVE: "/approve/p",
  SHARE_POST: "/s",
  SHARE_POST_ID: "/s/:id",
  RESTORE_SHARE_POST_ID: "/restore/share/:id",

  //OTP
  OTP: "/send-otp",

  //Order
  ORDER: "/order",
  ORDER_ID: "/order/:id",
  ORDER_USER_ID: "/order/user/:id",
  ORDER_STATUS_EDIT: "/order/edit/:orderId",
  ORDER_DELETE: "/order/delete/:orderId",
  ORDER_RECEIPT: "/order/receipt/:orderId",
  ORDER_STATUS_EDIT: "/order/edit/:id",
  ORDER_DELETE: "/order/delete/:id",

  //Category
  CATEGORY: "/category",
  CATEGORY_ID: "/category/:id",

  //Type
  TYPE: "/type",
  TYPE_ID: "/type/:id",

  //Blog
  BLOG: "/blog",
  BLOG_ID: "/blog/:id",
  RESTORE_BLOG_ID: "/restore/blog/:id",
  BLOG_USER_ID: "/blog/user/:id",

  //Dashboard
  DAILYSALES_REPORT: "/order/daily",
  WEEKLY_SALES_REPORT: "/order/weekly",
  MONTHLY_SALES_REPORT: "/order/monthly",
  TOTAL_USERS: "/users/count",
  TOTAL_TYPE_USERS: "/users/type",
  RANKED_PRODUCTS: "/products/ranked",

  //Notification
  NOTIFICATION: "/notification",
  NOTIFICATION_ID: "/notification/:id",
  NOTIFICATION_READ: "/notification/read/:id",
  NOTIFICATION_READ_ALL: "/notification/read/all/:id",

  //Inventory
  INVENTORY: "/inventory",
  INVENTORY_ID: "/inventory/:id",
  INVENTORY_ACTIVE_ID: "/inventory/active/:id",
  INVENTORY_INACTIVE_ID: "/inventory/inactive/:id",

  //member
  MEMBER: "/member",
  MEMBER_ID: "/member/:id",
  MEMBER_APPROVED_ID: "/member/approved/:id",
  MEMBER_DISAPPROVED_ID: "/member/disapproved/:id",

  //Test
  TEST_ID: "/test/:id",
  TEST: "/test",

  //member
  MEMBER: "/member",
  MEMBER_ID: "/member/:id",
  MEMBER_APPROVED_ID: "/member/approved/:id",
  MEMBER_DISAPPROVED_ID: "/member/disapproved/:id",
  
};
