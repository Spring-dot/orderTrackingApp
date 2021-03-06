import * as actions from "./constants";

export const initialUser = {
  fullname:'',
  address:'',
  telephone:'',
  email:'',
  password:'',
  neighborhood:'',
  city:''
};

export const initialState = {
  cart: [],
  toggleMenu: false,
  itemQty: 1,
  itemModalStatus: false,
  itemAddedMsg: false,
  itemSelected: {},
  orderSent: false,
  orderSentMsg: false,
  newUser: initialUser,
  createUserFlagStatus: false,
  loggedUser: {
    information: initialUser,
    orders: [],
    uid: '',
  },
  userIsLogged: false,
  updateUserInfoModal: false,
  updateUserInfo: initialUser,
  deleteUserModal: false,
  moveTrigger: false,
  removeTrigger: false,
};

const update_item = (array, item, operation) => {
  const newArray = array.slice();
  if (operation === "add") {
    newArray[item].qty = newArray[item].qty + 1;
  } else {
    if (newArray[item].qty > 1) {
      newArray[item].qty = newArray[item].qty - 1;
    }
  }
  return newArray;
};

const removePassword = (userInformation) => {
  const info = userInformation
  delete info.information.password
  return info
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    /** UI COMPONENTS */
    case actions.TOGGLE_MENU:
      return {
        ...state,
        toggleMenu: !state.toggleMenu,
      };
    /** SHOPPING CART */
    case actions.ADD_TO_CART:
      const product = action.product;
      product.qty = action.qty;
      return {
        ...state,
        cart: state.cart.concat(product),
      };
    case actions.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((product) => product.id !== action.product.id),
      };
    case actions.EMPTY_CART:
      return {
        ...state,
        cart: [],
      };
    case actions.UPDATE_UNIT_PRODUCT_IN_CART:
      return {
        ...state,
        cart: update_item(state.cart, action.index, action.op),
      };
    /** MENU ITEMS */
    case actions.ADD_UNIT:
      return {
        ...state,
        itemQty: state.itemQty + 1,
      };
    case actions.REMOVE_UNIT:
      if (state.itemQty <= 1) {
        return state;
      } else {
        return {
          ...state,
          itemQty: state.itemQty - 1,
        };
      }
    case actions.RESET_UNITS:
      return {
        ...state,
        itemQty: initialState.itemQty,
      };
    case actions.ITEM_MODAL:
      return {
        ...state,
        itemModalStatus: action.itemModal,
      };
    case actions.ITEM_ADDED_TO_CART_MSG:
      return {
        ...state,
        itemAddedMsg: action.itemAddedMsg,
      };
    case actions.ITEM_SELECTED: {
      return {
        ...state,
        itemSelected: action.product,
      };
    }
    case actions.ORDER_SENT: {
      return {
        ...state,
        orderSent: true,
      };
    }
    case actions.ORDER_SENT_MSG: {
      return {
        ...state,
        orderSentMsg: action.status,
      };
    }
    /** USERS */
    case actions.NEW_USER_FORM: {
      return{
        ...state,
        newUser: action.name === 'all' ? action.value : {...state.newUser, [action.name]: action.value}
      }
    }
    case actions.CREATE_USER_FLAG:
      return{
        ...state,
        createUserFlagStatus: action.status
      }
    case actions.LOGGED_USER:
      return{
        ...state,
        loggedUser: removePassword(action.user),
        newUser: initialState.newUser,
        userIsLogged: true,
        createUserFlagStatus: false
        }
    case actions.USER_IS_LOGGED:
      if(action.status!== state.userIsLogged){
        return{
          ...state,
          loggedUser: !action.status ? initialState.loggedUser : state.loggedUser,
          userIsLogged: action.status
        }
      }
      else{
        return state
      }
    case actions.UPDATE_USER_INFO_MODAL:{
      return{
        ...state,
        updateUserInfoModal: action.status
      }
    }
    case actions.UPDATE_USER_INFO:{
      return{
        ...state,
        updateUserInfo: action.param === 'all' ?
          action.value :
          {
            ...state.updateUserInfo,
            [action.param]: action.value
          }
      }
    }
    case actions.DELETE_USER_MODAL:
      return{
        ...state,
        deleteUserModal: action.status
      }
    case actions.DELETED_USER_TRIGGERS:
      if(action.status === 'deletedUser'){
        return{
          ...state,
          deleteUserModal: false,
          userIsLogged: false,
          loggedUser: initialState.loggedUser,
          moveTrigger: false,
          removeTrigger: false,
        }
      }
      else if (action.status === "moveToDeletedUsers"){
        return {
          ...state,
          moveTrigger: true,
          removeTrigger: false
        }
      }
      else if (action.status === "removeFromUsers"){
        return {
          ...state,
          moveTrigger: false,
          removeTrigger: true
        }
      }
      break
    default:
      return state;
  }
};
