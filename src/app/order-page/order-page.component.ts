import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MenuData, ShoppingCart, ShoppingCartMsg, getMenuMsg } from '../@models/order.model';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [HttpClientModule, NgFor, NgIf, DecimalPipe, NgClass],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css'
})
export class OrderPageComponent implements OnInit{
  router = inject(Router);
  // 菜單列表
  menuData: MenuData[] = [];
  // 單品是否打折
  isDiscount = true;
  // 分頁數量
  pageNum: number[] = [];
  // 每個分頁幾筆資料
  perPage = 6;
  // 當前資料的分頁
  nowPage = 1;
  // 菜單分類 - 薯條
  menuFries: MenuData[] = [];
  // 菜單分類 - 漢堡
  menuHamburger: MenuData[] = [];
  // 當前顯示菜單
  menuNow: MenuData[] = [];
  // 菜單 Option 的 class
  optionActive = {
    all: 'active',
    fries: '',
    hamburger: ''
  }
  // 購物車內的商品
  shoppingCartData: ShoppingCart[] = [];
  // 購物車是否有修改資料
  isEdit = false;
  // 結帳總金額
  checkOutPrice = 0;
  // 是否開啟購物車
  openCart = false;

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    // 獲取菜單
    this.http.get<getMenuMsg>('/menu').subscribe( res => {
      this.menuData = res.data;
      // 排序列表
      this.menuData.sort((x ,y) => {
        let a = Number(x.title.slice(6));
        let b = Number(y.title.slice(6));
        return a - b;
      })
      // 計算分頁數量
      let count = Math.ceil(this.menuData.length / this.perPage)
      for(let i = 0; i < count; i++) {
        this.pageNum.push(i+1)
      }
      // 菜單分類整理
      this.menuFries = this.menuData.filter( item => {
        return item.title.includes("薯條");
      })
      this.menuHamburger = this.menuData.filter( item => {
        return item.title.includes("漢堡");
      })
      // 初始顯示菜單
      this.menuNow = this.menuData;
    })
    // 若有登入抓取使用者的購物車
    let url = '';
    if(localStorage.getItem('username') && localStorage.getItem('password')) {
      let url = `/menu/${localStorage.getItem('username')}&${localStorage.getItem('password')}`;
      this.http.get<ShoppingCartMsg>(url).subscribe(res => {
        this.shoppingCartData = res.data;
      })
    } else if (localStorage.getItem('username') || localStorage.getItem('password')) {
      this.router.navigate(['auth']);
    }

  }

  // 菜單分頁切換
  nowPageTo(nowPage: number){
    this.nowPage = nowPage;
  }
  // 菜單分頁往前
  prevPage() {
    if(this.nowPage > 1) {
      this.nowPage--
    }
  }
  // 菜單分頁往後
  nextPage() {
    if(this.nowPage < this.pageNum.length) {
      this.nowPage++
    }
  }

  // 菜單分類切換
  menuOption(select: string) {
    this.nowPage = 1; // 切換時先將分頁換到第一頁
    switch (select) {
      case 'all':
        this.menuNow = this.menuData;
        this.optionActive = {
          all: 'active',
          fries: '',
          hamburger: ''
        }
        break;
      case 'fries':
        this.menuNow = this.menuFries;
        this.optionActive = {
          all: '',
          fries: 'active',
          hamburger: ''
        }
        break;
      case 'hamburger':
        this.menuNow = this.menuHamburger;
        this.optionActive = {
          all: '',
          fries: '',
          hamburger: 'active'
        }
        break;
    }
  }

  // 新增商品到購物車
  addToCart(item: MenuData) {
    // 確認是否有登入，有登入才能使用功能
    if(!localStorage.getItem('username')) {
      let loginReply = confirm("登入後即可操作");
      if(loginReply){
        this.router.navigate(['auth']);
      }else {
        return;
      }
    }
    this.isEdit = true; // 避免購物車未變動而一直發送更新請求
    const order:ShoppingCart = {
      title : item.title,
      price : item.price,
      isDiscount : item.isDiscount,
      discountOff : item.discountOff,
      count : 1,
      totalPrice : item.price 
    }
    this.shoppingCartData.push(order)
    // 統計數量
    for(let i = 0; i < this.shoppingCartData.length; i++){
      for(let j = 0; j < this.shoppingCartData.length; j++){
        if(this.shoppingCartData[i].title == this.shoppingCartData[j].title && i != j){
          if(this.shoppingCartData[i].count){
            this.shoppingCartData[i].count += this.shoppingCartData[j].count;
            this.shoppingCartData[j].count = 0;
          }
        }
      }
    }
    // 篩選數量不為 0 的資料
    let dataShoppingCount: ShoppingCart[] = this.shoppingCartData.filter(item => item.count != 0);
      // 增加總價格屬性
    dataShoppingCount.forEach(item => {
      item.totalPrice = item.count * Math.floor(item.price * item.discountOff);
    })
    // 排序列表
    dataShoppingCount.sort((x ,y) => {
      let a = Number(x.title.slice(6));
      let b = Number(y.title.slice(6));
      return a - b;
    })
    // 更新
    this.shoppingCartData.length = 0;
    this.shoppingCartData.push(...dataShoppingCount);
  }
  // 購物車商品數量減一
  subCartNumber(index: number) {
    this.isEdit = true; // 避免購物車未變動而一直發送更新請求
    this.shoppingCartData[index].count--;
    if(this.shoppingCartData[index].count == 0) {
      this.shoppingCartData.splice(index, 1);
    } else {
      this.shoppingCartData[index].totalPrice = this.shoppingCartData[index].count * Math.floor(this.shoppingCartData[index].price * this.shoppingCartData[index].discountOff);
    }
    if(this.shoppingCartData.length == 0) {
      console.log(123)
      this.openCart = false;
      
    }
  }
  // 購物車商品數量加一
  addCartNumber(index: number) {
    this.isEdit = true; // 避免購物車未變動而一直發送更新請求
    if(this.shoppingCartData[index].count < 50) {
      this.shoppingCartData[index].count++;
      this.shoppingCartData[index].totalPrice = this.shoppingCartData[index].count * Math.floor(this.shoppingCartData[index].price * this.shoppingCartData[index].discountOff);
    }
  }

  // 開啟購物車表格
  openCartStatus() {
    if(this.cartTotalNumber) {
      this.openCart = ! this.openCart;
    }
    if(this.isEdit) {
      let url = `/menu/${localStorage.getItem('username')}&${localStorage.getItem('password')}/shoppingCart`;
      this.http.patch<ShoppingCart[]>(
        url,
        JSON.stringify(this.shoppingCartData),
        {headers: {'Content-Type': 'application/json'}}
      ).subscribe();
      this.isEdit = false; // 避免購物車未變動而一直發送更新請求
    }
  }


  // 結帳總金額

  get checkoutPrice() {
    return this.shoppingCartData.reduce((acc, cur) => {
      return acc + cur.totalPrice;
    }, 0);
  }
  // 購物車商品總數量
  get cartTotalNumber() {
    return this.shoppingCartData.reduce((acc, cur) => {
      return acc + cur.count;
    }, 0);
  }
}