import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {  ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout-top',
  standalone: true,
  imports: [NgClass, NgIf, RouterLink],
  templateUrl: './layout-top.component.html',
  styleUrl: './layout-top.component.css'
})
export class LayoutTopComponent implements OnInit {
  // 依賴注入
  router = inject(Router);

  activatedRoute = inject(ActivatedRoute);
  // 隱藏後的導覽菜單顯示狀態
  topMenuStatus = false;
  // 登入狀態
  loginStatus = false;
  
  ngOnInit(): void {
    
  }
  ngDoCheck() {
    if(localStorage.getItem('username')) {
      this.loginStatus = true;
    }
  }
  // 滾動到指定位置 - 開頭
  goHeader(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  // 滾動到指定位置 - #Secret
  goSecret(){
    setTimeout(() => {
      window.scrollTo({
        top: 357,
        behavior: 'smooth'
      })
    }, 100);
  }
  // 滾動到指定位置 - #Chef
  goChef(){
    setTimeout(() => {
      window.scrollTo({
        top: 985,
        behavior: 'smooth'
      })
    }, 100);
  } 
  // 滾動到指定位置 - #Address
  goAddress(){
    setTimeout(() => {
      window.scrollTo({
        top: 1752,
        behavior: 'smooth'
      })
    }, 100);
  }
  
  // 登入登出按鈕
  logout() {
    // 登入中觸發
    if(this.loginStatus == true) {
      let logoutReply = confirm("您是否要登出");
      if(logoutReply){
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        this.loginStatus = false;
        this.router.navigate(['home']);
      } else {
        return
      }
    } else {
      // 為登入時導向登入頁面
      this.router.navigate(['auth']);
    }
  }
}
