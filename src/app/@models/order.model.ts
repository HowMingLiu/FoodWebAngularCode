// 獲取菜單資料訊息
export interface getMenuMsg {
  code: string,
  msg: string,
  data: [{
    photoSrc: string,
    title: string,
    engTitle: string,
    price: number,
    isDiscount: boolean,
    discountOff: number,
  }]
}
// 菜單資料
export interface MenuData {
  photoSrc: string,
  title: string,
  engTitle: string,
  price: number,
  isDiscount: boolean,
  discountOff: number,
}
// 購物車內的資料
export interface ShoppingCart {
  title : string;
  price : number;
  isDiscount : boolean;
  discountOff : number;
  count : number;
  totalPrice : number;
}
// 獲取使用者購物車資料訊息
export interface ShoppingCartMsg {
  code: string,
  msg: string,
  data: [{
    title : string;
    price : number;
    isDiscount : boolean;
    discountOff : number;
    count : number;
    totalPrice : number;
  }]
}