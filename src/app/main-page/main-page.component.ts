import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router';

declare var getHostname: any;
declare var userObjFromUser: any;
declare var playSound: any;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent extends BaseComponent implements OnInit {
  public userRank = 0;
  public myEMPCount = 0;
  public forumCount = 0;
  public hostname: string;
  public user: any;
  public expandFlg = false;
  public singleGameId: number;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    //localStorage.rank=0; //<-- reset rank
    this.hostname = getHostname();
    this.user = userObjFromUser();
    this.flexSprite(100);
    this.singleGameId = localStorage.currentGameId;
    console.log('main-page ngOnInit', this.user);
  }
  multiplayGameClicked(login: any) {
    if (this.user.username != 'Guest')
      login.show();
    else
      this.router.navigate(['/multiplayer']);

  }
  singlePlayerGame(startGame: any) {
    if (this.singleGameId > 0)
      this.router.navigate(['/board']);
    else
      startGame.show();
  }
  flexSprite(width: number) {
    if (this.expandFlg)
      width++;
    else
      width--;
    var e = document.getElementById('spLogo');
    if (e) {
      e.style.width = width + '%';
      if (width < 75 || width > 99) {
        this.expandFlg = !this.expandFlg;
      }
      //window.requestAnimationFrame(flexSprite);
      setTimeout(() => {
        this.flexSprite(width);
      }, 80);
    }
  }
}
