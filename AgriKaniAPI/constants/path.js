const { DRIVER, IMAGE } = require("./resource");

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
  CHECK_EMAIL: "/check-email",
  CHECK_DRIVER_EMAIL: "/check-driver-email",
  OTP_FORGOT_PASSWORD: "/otp-forgot-password",
  RESET_PASSWORD: "/reset-password",
  FORGOR_PASSWORD_WEB: "/reset-Password-Web",
  RESET_PASSWORD_WEB: "/resetPassword/:resetToken",
  GOOGLE_LOGIN_WEB: "/google-login-web",
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
  ADDRESS_FETCH_ID: "/address/fetch/:id",

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
  COOP_SHIPPING: "/orders/shipping/:id",
  COOP_DELIVERY: "/orders/delivery/:id",
  COOP_DELIVERY_HISTORY_ID: "/orders/delivery/history/:id",
  FARM_ID_INFO: "/farm/info/:id",
  //Comment
  COMMENT: "/products/comment",
  COMMENT_COOP: "/cooperative/comment",
  COMMENT_COURIER: "/courier/comment",
  
  //Post
  POST_CREATE: "/p/create",
  POST: "/p",
  POST_UPDATE_ID: "/p/update/:id",
  POST_DELETE_ID: "/p/delete/:id",
  POST_SOFT_ID: "/p/softdel/:id",
  RESTORE_POST_ID: "/restore/p/:id",
  POST_USER_ID: "/p/user/:userId",
  POST_ID: "/p/:id",
  POST_STATUS_APPROVE: "/approve/p",
  APPROVE_POST: "/p/approve/:id",
  IMAGE_POST_DELETE: "/p/image/:postId/:imageId",
  LIKE_POST: "/p/like/:id",

  POST_UPDATE_POST: "/p/update/:id",
  POST_USER_ID: "/p/user/:id",
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
  CATEGORY_EDIT: "/category/edit/:id",
  CATEGORY_DELETE: "/category/delete/:id",

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
  COOP_DASHBOARD: "/coopdashboard/:id", 
  OVERALL_DASHBOARD: "/overalldashboard", 

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
  INVENTORY_PRODUCT_ID: "/inventory/product/:id",
  INVENTORY_UPDATE_ID: "/inventory/update/:id",
  INVENTORY_STOCK_CHECK: "/inventory/stock",
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
  MEMBERLIST: "/memberlist/:id",
  MEMBER_ID: "/member/:id",
  MEMBER_INACTIVE: "/member/inactive/:id",
  MEMBER_APPROVED_ID: "/member/approved/:id",
  MEMBER_DISAPPROVED_ID: "/member/disapproved/:id",
  
  //Delivery
  DELIVERY: "/delivery",
  DELIVERY_ID: "/delivery/:id",
  DELIVERY_TRACK_ID: "/delivery/track/:id",
  DELIVERY_DRIVER_ID: "/delivery/driver/:id",
  DELIVERY_QR_CODE: "/delivery/qr/:id",
  DELIVERY_HISTORY_ID: "/delivery/history/:id",
  DELIVERY_COMPLETE_ID: "/delivery/complete/:id",

  //Driver
  DRIVER: "/driver",
  DRIVER_ID: "/driver/:id",
  DRIVER_DISAPPROVED: "/driver/disapproved",
  DRIVER_APPROVED_ID: "/driver/approved/:id",
  DRIVER_DISAPPROVED_ID: "/driver/disapproved/:id",
  DRIVER_COOP_ID: "/driver/coop/:id",
  DRIVER_COOP_ONLY_APPROVED_ID: "/driver/coop/approved/:id",
  DRIVER_DELIVERY_THIS_MONTH: "/driver/delivery/month/:id",
  DRIVER_ASSING_LOCATION: "/driver/location/:id",
  DRIVER_MAX_CAPACITY: "/driver/capacity/:id",
  DRIVER_IS_AVAILABLE: "/driver/available/:id",
  DRIVER_REMOVE_LOCATION: "/driver/remove/location/:id",
  DRIVER_SINGLE_ID: "/driver/single/:id",

  //Cancelled
  CANCELLED: "/cancelled",
  CANCELLED_ID: "/cancelled/:id",
  CANCELLED_ORDER_ID: "/cancelled/order/:id",
  CANCELLED_ORDER: "/cancelled/order",

  //Senior
  SENIOR: "/senior",
  SENIOR_ID: "/senior/:id",
  SENIOR_DISAPPROVED: "/senior/disapproved",
  SENIOR_APPROVED: "/senior/approved",
  SENIOR_APPROVED_ID: "/senior/approved/:id",
  SENIOR_DISAPPROVED_ID: "/senior/disapproved/:id",

  //Pwd
  PWD: "/pwd",
  PWD_ID: "/pwd/:id",
  PWD_DISAPPROVED: "/pwd/disapproved",
  PWD_APPROVED: "/pwd/approved",
  PWD_APPROVED_ID: "/pwd/approved/:id",
  PWD_DISAPPROVED_ID: "/pwd/disapproved/:id",

  POST_ADD_COMMENT: "/post/comment",
  POST_GET_COMMENT: "/post/:postId",
  // POST_UPDATE_COMMENT: "/post/:postId/comments/update/:commentId",
  // POST_DELETE_COMMENT: "/post/:postId/comments/delete/:commentId",

  ONLINE_PAYMENT: "/pay",
  ONLINE_PAYMENT_ID: "/pay/:id",

  WALLET: "/wallet",
  WALLET_ID: "/wallet/:id",
  TRANSACTION: "/transaction",
  TRANSACTION_ID: "/transaction/:id",
  TRANSACTION_PENDING: "/transaction/pending",
  TRANSACTION_SUCCESS: "/transaction/success",
  TRANSACTION_USER_ID: "/transaction/user/:id",
  REFUND_PENDING: "/refund/pending",
  REFUND_SUCCESS: "/refund/success",
  REFUND_ID: "/refund/:id",
};

