import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-loading-popup',
  templateUrl: './loading-popup.component.html',
  styleUrls: ['./loading-popup.component.scss']
})
export class LoadingPopupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#loadingPopup").modal();
  }

}
