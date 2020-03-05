import { Component, OnInit } from '@angular/core';

declare var loadSVGs: any;
declare var getGameTerritories: any;
declare var populateUnits: any;
declare var refreshBoard: any;
declare var refreshTerritory: any;
declare var isMobile: any;
declare var numberVal: any;
declare var hideArrow: any;
declare var ngUnitSrc: any;
declare var startSpinner: any;
declare var updateProgressBar: any;
declare var stopSpinner: any;
declare var getHostname: any;
declare var userObjFromUser: any;
declare var createNewGame: any;
declare var loadSinglePlayerGame: any;
declare var displayLeaderInfo: any;
declare var unitsForTerr: any;

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public svgs = [];
  public hostname:string;
  public user:any;
//  public territories = [];
  public gUnits = [];
  public showControls = false;
  public historyMode = false;
  public historyRound = 1;
  public gameObj:any;
  public currentPlayer = {userName: 'Bob', money: 30, status: 'purchase', nation: 1};
  public yourPlayer = {userName: 'Rick', nation: 3};
  public superpowers = ['Neutral','United States','European Union','Russian Republic','Imperial Japan','Communist China','Middle-East Federation','African Coalition','Latin Alliance'];
  public ableToTakeThisTurn = true;
  public uploadMultiplayerFlg = false;
  public progress=0;
    
  constructor() { }

  ngOnInit(): void {
  	this.hostname = getHostname();
  	this.user = userObjFromUser();
  	this.user.rank=1;
    	this.svgs = loadSVGs();
    	this.gameObj = {actionButtonMessage: 'test', currentNation: 1, desc: 'test', round: 1, type: 'x', name: 'game name', icon: 'fa-star', gameOver: false};
    	this.gUnits = populateUnits();
    	this.initBoard();
  }
  //----------------load board------------------
  initBoard() {
	startSpinner('Loading Game', '100px');
	updateProgressBar(20);
	if(localStorage.loadGameId && localStorage.loadGameId>0) {
		console.log('+++ multiplayer....', localStorage.loadGameId);
	} else {
		if((localStorage.currentGameId && localStorage.currentGameId>0)) {
			//load game
			console.log('+++ load single player....', localStorage.currentGameId);
			this.gameObj = loadSinglePlayerGame();
		} else {
			//new game
			if(numberVal(localStorage.startingNation)==0)
				localStorage.startingNation=2;
			var startingNation = localStorage.startingNation;
			console.log('+++ new single player....', startingNation);
			var type=(localStorage.gameType==1)?'freeforall':'diplomacy';
			var id=3;
			var numPlayers=4;
			var attack=6;
			var name = (this.user.rank==0)?'Basic Training':'Single Player Game';
			if(this.user.rank==0)
				type="basicTraining";
				
			var pObj={};
			if(localStorage.customGame=='Y') {
				type=localStorage.customGameType;
				numPlayers=localStorage.customNumPlayers;
				pObj = JSON.parse(localStorage.customGamePlayers);
			}
			this.gameObj = createNewGame(id, type, numPlayers, name, attack, this.gUnits, parseInt(localStorage.startingNation), localStorage.fogOfWar, this.user.rank, localStorage.customGame, pObj, localStorage.hardFog);
			this.gameObj.difficultyNum=localStorage.difficultyNum || 1;
			this.currentPlayer = this.gameObj.players[0];
			this.yourPlayer = this.gameObj.players[0];
			console.log(this.gameObj);
			console.log(this.currentPlayer);
			console.log(this.yourPlayer);
//			saveGame($scope.gameObj, $scope.user, $scope.currentPlayer);
//			localStorage.currentGameId = $scope.gameObj.id;
		}
	}
  	setTimeout(()=> { this.loadBoard(); }, 500);
  } 
  loadBoard() {
  	console.log('territories', this.gameObj.territories.length);
  	updateProgressBar(100);
  	for(var x=0; x<this.gameObj.territories.length; x++) {
  		var terr = this.gameObj.territories[x];
  		refreshTerritory(terr, this.gameObj, this.gUnits, this.currentPlayer, this.superpowers, this.yourPlayer);
  	}
    	refreshBoard(this.gameObj.territories);
    	this.showControls = true;
    	stopSpinner();
  }
  //----------------load board------------------
  terrClicked(id, terr) {
    displayLeaderInfo(terr, this.currentPlayer, this.yourPlayer);
    terr.units=unitsForTerr(terr, this.gameObj.units);
    id.show(terr, this.currentPlayer, this.gameObj);
  }
  svgClick() {
  }
  dismissArrow() {
  	hideArrow();
  }
  ngUnitSrc(piece, nation=0) {
  	return ngUnitSrc(piece, nation=0);
  }
  completeTurnButtonPressed() {
  }
  scrollToNation(nation) {
  }
  ngClassFlag=function(terr) {
		var flagShadow = ' hoverShadowed';
		if(terr.territoryType=='Ally' || terr.territoryType=='Your Empire')
			flagShadow = ' flagAlly';
		if(terr.territoryType=='Enemy!')
			flagShadow = ' flagEnemy';
		var hover = isMobile()?'':flagShadow;
		if(terr.capital && terr.id<79)
			return "flagCapital"+hover;
		else
			return "flag "+hover;
	}
  ngStyleHalo=function(terr,x,y) {
		return {'top': (terr.y+y).toString()+'px', 'left': (terr.x+x).toString()+'px'}
	}
  ngClassHalo=function(terr) {
		var flagShadow = ' haloNone';
		if(terr.territoryType=='Ally' || terr.territoryType=='Your Empire')
			flagShadow = ' haloAlly';
		if(terr.territoryType=='Enemy!')
			flagShadow = ' haloEnemy';
		if(terr.capital && terr.id<79)
			return "haloCapital "+flagShadow;
		else
			return "halo "+flagShadow;
	}
  ngStyleNameLabel=function(terr) {
		var offset = 0;
		if(terr.capital && terr.id<79)
			offset-=13;
		if(terr.name.length>8 && (terr.name.includes(' ') || terr.name.includes('-')))
			offset-=13;
		if(terr.id==111 || terr.id==112)
			offset=57;
		return {'top': (terr.y+60+offset).toString()+'px', 'left': (terr.x-22).toString()+'px'}
  }
  changeSVGColor=function(flg, id, nation) {
		if(window.innerWidth<500)
			return;
		var n = document.getElementById('name'+id);
		if(n) {
			if(flg)
				n.style.display = 'block';
			else
				n.style.display = 'none';
		}
		var f = document.getElementById('svg'+id);
		if(f) {
			var colors=['#ffffc0','blue','gray','#cc8800','red','green','yellow','magenta','cyan'];
			var color=colors[numberVal(nation)];
			if(flg) {
				f.style.fill = color;
				f.style.stroke = 'black';
			} else {
				f.style.stroke = 'none';
				f.style.fill = 'transparent';
			}
		}
	}

}
