import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
declare var getHostname: any;
declare var userObjFromUser: any;
declare var valueOfInput: any;

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss']
})
export class LoginPopupComponent implements OnInit {
  public hostname:string;
  public user:any;
  public showLoginFlg = true;
  public requestSentFlg = false;
  public email='';
  public username='';
  public password='';
  public password2='';
  
  constructor(private router: Router) {  }

  ngOnInit(): void {
  	this.hostname = getHostname();
  	this.user = userObjFromUser();
  }
  show() {
    $("#loginPopup").modal();
    this.showLoginFlg=true;
    this.requestSentFlg=false;
  }
  clearValue(event) {
  	event.target.value='';
  }
  loginPressed() {
  	this.showLoginFlg=false;
  	this.requestSentFlg=true;
  	console.log(this.username, this.password);
	this.username = valueOfInput('emailField');
	this.password = valueOfInput('passwordField');
  	console.log(this.username, this.password);
  	$("#loginPopup").modal('hide');
  	this.router.navigate(['/multiplayer']);
  }
  forgotPasswordPressed() {
  }
  createNewPressed() {
    this.requestSentFlg=true;
  }
  closeModal() {
  }

}
