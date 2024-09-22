const { CONVERSATION } = require("./resource");

module.exports = {
    USERS: "/users",
    USER_ID: "/users/:id",
    RESTORE_ID: "/restore/users/:id",
    LOGIN: "/signin",
    LOGOUT: "/signout",
    PRODUCTS: "/products",
    PRODUCTS_ID: "/products/:id",
    RESTORE_PRODUCT_ID: "/restore/products/:id",
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
    RESTORE_FARM_ID: "/restore/farm/:id",
    COMMENT: "/products/comment",
    POST: "/p",
    POST_ID: "/p/:id",
    RESTORE_POST_ID: "/restore/p/:id",
    POST_USER_ID: "/p/user/:id"
}