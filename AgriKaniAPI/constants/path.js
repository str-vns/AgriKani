const { CONVERSATION, CATEGORY, TYPE, ORDER } = require("./resource");

module.exports = {
    USERS: "/users",
    USER_ID: "/users/:id",
    SINGLE_USER: "/user/:id",

    RESTORE_ID: "/restore/users/:id", // Restore user route
    SOFTDELETE_USER_ID: "/users/softdel/:id", // Soft delete user route

    RESTORE_ID: "/restore/users/:id",
    WISH_USER_ID: "/wish/users/:productId/:id",
    WISH_ID: "/wish/:id",
    LOGIN: "/signin",
    LOGOUT: "/signout",
    PRODUCTS: "/products",
    PRODUCTS_ID: "/products/:id",
    PRODUCTS_EDIT_ID: "/products/edit/:id",
    PRODUCTS_SOFTDEL_ID: "/products/softdel/:id",
    COOP_ONLY_PRODUCTS_ID: "/products/coop/:id",
    RESTORE_PRODUCT_ID: "/restore/products/:id",
    IMAGE_PRODUCT_DELETE: "/products/image/:id/:imageId",
    PRODUCT_ARCHIVE_ID: "/products/archive/:id",
    CONVERSATION: "/t",
    CONVERSATION_ID: "/t/:id",
    RESTORE_CONVERSATION_ID: "/restore/t/:id",
    MESSAGE: "/m",
    MESSAGE_ID: "/m/:id",
    SHIPPING: "/shipping",
    SHIPPING_ID: "/shipping/:id",
    ADDRESS: "/address",
    ADDRESS_ID: "/address/:id",
    FARM: "/farm",
    FARM_ID: "/farm/:id",
    IMAGE_FARM_DELETE: "/farm/image/:id/:imageId",
    RESTORE_FARM_ID: "/restore/farm/:id",
    COMMENT: "/products/comment",

    POST: "/p",
    POST_ID: "/p/:id",
    RESTORE_POST_ID: "/restore/p/:id",
    POST_USER_ID: "/p/user/:id",

    SHARE_POST: "/s",
    SHARE_POST_ID: "/s/:id",
    RESTORE_SHARE_POST_ID: "/restore/share/:id",
    OTP: "/send-otp",
    ORDER: "/order",
    ORDER_ID: "/order/:id",
    ORDER_USER_ID: "/order/user/:id",
    ORDER_STATUS_EDIT:"/order/edit/:orderId",
    ORDER_DELETE:"/order/delete/:orderId",
    CATEGORY: "/category",
    CATEGORY_ID: "/category/:id",
    TYPE: "/type",
    TYPE_ID: "/type/:id",

    
     // Blog Routes
     BLOG: "/blog",                // Route to create and get blogs
     BLOG_ID: "/blog/:id",          // Route to update, delete, and get a single blog
     RESTORE_BLOG_ID: "/restore/blog/:id",  // Route to restore a deleted blog
     BLOG_USER_ID: "/blog/user/:id", 



}