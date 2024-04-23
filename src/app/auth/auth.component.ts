import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { loginMsg } from '../@models/account.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NgIf, FormsModule, HttpClientModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  // 依賴注入
  http = inject(HttpClient);
  router = inject(Router);

  // 切換登入或註冊介面
  isReg = false;
  // 登入資料
  authLogin = {
    username: '',
    password: ''
  };
  // 註冊資料
  authReg = {
    username: '',
    password: '',
    check: ''
  };

  // 登入驗證
  login() {
    if(!this.authLogin.username || !this.authLogin.password){
      alert('帳號或密碼不能為空');
      this.authLogin.username = '';
      this.authLogin.password = '';
      return;
    }
    let body = `username=${this.authLogin.username}&password=${this.authLogin.password}`
    this.http.post<loginMsg>(
      '/accountAPI/login', 
      body,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    ).subscribe(res => {
        if(res.msg == '登入成功') {
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('password', res.data.password);
          this.router.navigate(['orderPage'])
        }
        this.authLogin.username = '';
        this.authLogin.password = '';
        alert(res.msg);
      })
  }

  // 註冊驗證
  reg() {
    if(!this.authReg.username || !this.authReg.password || !this.authReg.check){
      alert('帳號密碼或確認密碼不能為空');
      this.authReg.username = '';
      this.authReg.password = '';
      this.authReg.check = '';
      return;
    }
    let body = `username=${this.authReg.username}&password=${this.authReg.password}&passwordCheck=${this.authReg.check}`;
    this.http.post<loginMsg>(
      '/accountAPI/reg', 
      body,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    ).subscribe(res => {
        if(res.msg == '註冊成功') {
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('password', res.data.password);
          this.router.navigate(['orderPage'])
        }
        this.authReg.username = '';
        this.authReg.password = '';
        this.authReg.check = '';
        alert(res.msg);
      })
  }
}
