import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var isMusicOn: any;
declare var isSoundOn: any;
declare var isVoiceOn: any;

@Component({
  selector: 'app-audio-popup',
  templateUrl: './audio-popup.component.html',
  styleUrls: ['./audio-popup.component.scss']
})
export class AudioPopupComponent implements OnInit {
  public musicFlg:boolean;
  public soundFlg:boolean;
  public voiceFlg:boolean;
  
  constructor() { }

  ngOnInit(): void {
  }
  show() {
    $("#audioPopup").modal();
    	this.musicFlg = isMusicOn();
    	this.soundFlg = isSoundOn();
    	this.voiceFlg = isVoiceOn();
	(<HTMLInputElement>document.getElementById('musicBox')).checked=isMusicOn();
	(<HTMLInputElement>document.getElementById('soundBox')).checked=isSoundOn();
	(<HTMLInputElement>document.getElementById('voiceBox')).checked=isVoiceOn();
  }
  changeAudioSettings() { 
    	this.musicFlg = (<HTMLInputElement>document.getElementById('musicBox')).checked;
    	this.soundFlg = (<HTMLInputElement>document.getElementById('soundBox')).checked;
    	this.voiceFlg = (<HTMLInputElement>document.getElementById('voiceBox')).checked;

	if(this.musicFlg) {
		localStorage.removeItem('musicBox');
	} else {
		localStorage.musicBox='N';
	}
	if(this.soundFlg)
		localStorage.removeItem('soundBox');
	else
		localStorage.soundBox='N';
	if(this.voiceFlg)
		localStorage.removeItem('voiceBox');
	else
		localStorage.voiceBox='N';
	
  }

}
