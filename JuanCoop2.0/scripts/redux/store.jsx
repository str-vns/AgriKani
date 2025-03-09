import {
    legacy_createStore as createStore,
    combineReducers,
    applyMiddleware,
  } from "redux";
  import { thunk } from "redux-thunk";
  
  import cartItems from "@redux/Reducers/cartItems";
  import { orderReducer, orderCoopReducer, orderShippedReducer, historyDeliveryCoopReducer, coopdashboardReducer, overalldashboardReducer, onlinePaymentReducer, getPaymentReducer} from "./Reducers/orderReducer";
  import { OTPReducer, RegisterReducer, userReducer, EditProfileReducer, getUsersReducers, AllUsersReducer, 
    userDeviceTokenReducer,  checkEmailReducer, otpForgotPasswordReducer, googleLoginReducer } from "@redux/Reducers/userReducers";
  import { reducerProduct, reducerCoop, reducerCoopProduct, reducerCreateProduct, reducerEditProduct, reducerDelResProduct } from "@redux/Reducers/productReducers";
  import { HereMapReducer, MapBoxRouteReducer } from "@redux/Reducers/locationReducers";
  import { coopReducer, coopAllReducer, coopOrderReducer, coopOrderUpdateReducer, coopActiveReducer } from "@redux/Reducers/coopReducers";
  import { addressReducer } from "@redux/Reducers/addressReducer";
  import { typeListReducer,typeCreateReducer,typeUpdateReducer,typeDeleteReducer } from "@redux/Reducers/typeReducers";
  import { categoryListReducer,categoryCreateReducer,categoryEditReducer,categoryDeleteReducer} from "@redux/Reducers/categoryReducers";
  import { conversationListReducer, conversationCreateReducer } from "@redux/Reducers/conversationReducers";
  import { messageListReducer, sendMessageReducer } from "@redux/Reducers/messageReducers";
  import { commentcreateReducers } from "./Reducers/commentReducers";
  import { reducerBlog, reducerSingleBlog, reducerCreateBlog, reducerEditBlog, reducerDelBlog } from "@redux/Reducers/blogReducer";
  import { sendNotificationReducers, getNotificationReducers, readNotificationReducers } from "@redux/Reducers/notificationReducers";
  import { inventoryCreateReducer, singleInventoryReducer } from "@redux/Reducers/inventoryReducer";
  import { memberListReducer, memberApiReducer } from "@redux/Reducers/memberReducer";
  import { driverApiReducer, driverListReducer, onlyApprovedDriverReducer, driverProfileReducer } from "@redux/Reducers/driverReducer";
  import { deliveryListReducer, deliveryApiReducer, deliveryCompleteReducer, deliveryHistoryReducer } from "@redux/Reducers/deliveryReducers";
  import { cancelledReducerApi, cancelledReducer } from "@redux/Reducers/cancelledReducer";
  import { walletReducer } from "@redux/Reducers/walletReducer";
  import { transactionReducer, transactionAPIReducer } from "@redux/Reducers/transactionReducer";
  import postReducer from "./Reducers/postReducer";
  import salesReducer from "./Reducers/salesReducer"; 
  import rankedReducer from "./Reducers/rankReducers";


  const reducers = combineReducers({
    cartItems: cartItems,
    orders: orderReducer,
    otp: OTPReducer,
    register: RegisterReducer,
    allProducts: reducerProduct,
    singleCoop: reducerCoop,
    userOnly: userReducer,
    EditProfile: EditProfileReducer,
    Geolocation: HereMapReducer,
    Coop: coopReducer,
    CoopProduct: reducerCoopProduct,
    addresses: addressReducer,
    types: typeListReducer,
    typesCreate: typeCreateReducer,
    typesUpdate: typeUpdateReducer,
    typesDelete: typeDeleteReducer,
    categories: categoryListReducer,
    createCategories:categoryCreateReducer,
    updateCategories: categoryEditReducer,
    deleteCategories:categoryDeleteReducer,
    createProduct: reducerCreateProduct,
    UpdateProduct: reducerEditProduct,
    ResDelProduct: reducerDelResProduct,
    converList: conversationListReducer,
    getThemUser: getUsersReducers,
    getMessages: messageListReducer,
    sendMessages: sendMessageReducer,
    createComment: commentcreateReducers, 
    allUsers: AllUsersReducer,
    allofCoops: coopAllReducer,
    allBlogs: reducerBlog, 
    singleBlog: reducerSingleBlog, 
    createBlog: reducerCreateBlog, 
    updateBlog: reducerEditBlog, 
    deleteBlog: reducerDelBlog, 
    createConversation: conversationCreateReducer,
    coopOrders: coopOrderReducer,
    upOrders: coopOrderUpdateReducer,
    coopdashboards: coopdashboardReducer,
    overalldashboards: overalldashboardReducer,
    post: postReducer,
    sales: salesReducer,
    rank: rankedReducer,
    udeviceToken: userDeviceTokenReducer,
    sendNotification: sendNotificationReducers,
    coopOrdering: orderCoopReducer,
    getNotif: getNotificationReducers,
    readNotif: readNotificationReducers,
    invent: inventoryCreateReducer,
    coopActive: coopActiveReducer,
    sinvent: singleInventoryReducer,
    memberList: memberListReducer,
    memberApi: memberApiReducer,
    driverApi: driverApiReducer,
    driverList: driverListReducer,
    deliveryList: deliveryListReducer,
    deliveryComplete: deliveryCompleteReducer,
    orderShipped: orderShippedReducer,
    deliveredhistory: historyDeliveryCoopReducer,
    onlyApprovedDriver: onlyApprovedDriverReducer,
    deliveryApi: deliveryApiReducer,
    deliveryHistory: deliveryHistoryReducer,
    checkDuplication: checkEmailReducer,
    otpForgot: otpForgotPasswordReducer,
    MapBoxRoute: MapBoxRouteReducer,
    driverProfile: driverProfileReducer,
    googleLogin: googleLoginReducer,
    cancelled: cancelledReducer,
    cancelledApi: cancelledReducerApi,
    onlinePay: onlinePaymentReducer,
    getPayment: getPaymentReducer,
    getWallet: walletReducer,
    transaction: transactionReducer,
    transactionAPI: transactionAPIReducer,
  });
  
  const store = createStore(reducers, applyMiddleware(thunk));
  
  export default store;