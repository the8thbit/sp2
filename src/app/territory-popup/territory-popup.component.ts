import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

declare var $: any;
declare var ngUnitSrc: any;
declare var populateUnits: any;
declare var getSuperpowersData: any;
declare var playSound: any;
declare var isUnitGoodForForm: any;
declare var getDisplayQueueFromQueue: any;

@Component({
  selector: 'app-territory-popup',
  templateUrl: './territory-popup.component.html',
  styleUrls: ['./territory-popup.component.scss']
})
export class TerritoryPopupComponent extends BaseComponent implements OnInit {
  public selectedTerritory: any;
  public currentPlayer: any;
  public gameObj: any;
  public optionType: string;
  public ableToTakeThisTurn = false;
  public unitDetailFlg = false;
  public productionDisplayUnits = [];

  constructor() { super(); }

  ngOnInit(): void {
  }
  show(terr: any, currentPlayer: any, gameObj: any, ableToTakeThisTurn: boolean, user: any) {
    $("#territoryPopup").modal();
    this.selectedTerritory = terr;
    this.currentPlayer = currentPlayer;
    this.gameObj = gameObj;
    this.ableToTakeThisTurn = ableToTakeThisTurn;
    this.user = user;
    //this.superpowersData = getSuperpowersData();

    this.unitDetailFlg = false;
    this.optionType = 'none';
    if (ableToTakeThisTurn && terr.treatyStatus == 4 && currentPlayer.status == 'Purchase') {
      if (this.selectedTerritory.nation == 99)
        this.changeProdType(2);
      else
        this.changeProdType(0);
      this.optionType = 'production';
    }

    console.log(terr.name, terr);
    //console.log('ableToTakeThisTurn', ableToTakeThisTurn);
    //console.log('user', user);
    //console.log('currentPlayer', currentPlayer);
  }
  addUniToQueue(piece: number, count: number) {
    playSound('clink.wav', 0, false);
    var unit = this.superpowersData.units[piece];
    var cost = unit.cost;

    for (var x = 0; x < count; x++) {
      if (this.currentPlayer.money - cost >= 0) {
        this.currentPlayer.money -= cost;
        var id = this.gameObj.unitPurchases.length + 1;
        this.gameObj.unitPurchases.push({ id: id, terr: this.selectedTerritory.id, piece: piece });
      }
    }
    if (piece == 16)
      this.currentPlayer.abFlg = true;
    if (piece == 17)
      this.currentPlayer.railFlg = true;
    if (piece == 18)
      this.currentPlayer.techCount++;
    this.selectedTerritory.displayQueue = getDisplayQueueFromQueue(this.selectedTerritory, this.gameObj);
  }
  clearQueue() {
    playSound('clink.wav', 0, false);
    var newUnits = [];
    var terrId = this.selectedTerritory.id;
    var units = this.superpowersData.units;
    var money = this.currentPlayer.money;

    for (var x = 0; x < this.gameObj.unitPurchases.length; x++) {
      var purchUnit = this.gameObj.unitPurchases[x];
      if (purchUnit.terr == terrId) {
        var unit = units[purchUnit.piece];
        money += unit.cost;
        if (purchUnit.piece == 16)
          this.currentPlayer.abFlg = false;
        if (purchUnit.piece == 17)
          this.currentPlayer.railFlg = false;
        if (purchUnit.piece == 18)
          this.currentPlayer.techCount--;
        if (purchUnit.piece == 52)
          this.currentPlayer.empCount++;
        if (purchUnit.piece == 12) {
          this.currentPlayer.money += this.gameObj.superBCForm.cost - 15;
          this.currentPlayer.battleshipCost = 0;
          this.gameObj.superBCForm.cost = 0;
        }
      } else {
        newUnits.push(purchUnit);
      }
    }

    this.currentPlayer.money = money;
    this.gameObj.unitPurchases = newUnits;
    this.selectedTerritory.displayQueue = getDisplayQueueFromQueue(this.selectedTerritory, this.gameObj);
  }

  changeProdType(segmentIdx: number) {
    this.segmentIdx = segmentIdx;
    this.productionDisplayUnits = [];
    if (this.selectedTerritory.nation < 99 && this.selectedTerritory.factoryCount == 0)
      return;
    if (segmentIdx == 0) { //ground
      this.productionDisplayUnits.push(this.superpowersData.units[1]);
      this.productionDisplayUnits.push(this.superpowersData.units[2]);
      this.productionDisplayUnits.push(this.superpowersData.units[3]);
      this.productionDisplayUnits.push(this.superpowersData.units[19]);
    }
    if (segmentIdx == 1) { //air
      this.productionDisplayUnits.push(this.superpowersData.units[6]);
      this.productionDisplayUnits.push(this.superpowersData.units[7]);
      this.productionDisplayUnits.push(this.superpowersData.units[13]);
      this.productionDisplayUnits.push(this.superpowersData.units[14]);
    }
    if (segmentIdx == 2) { //water
      this.productionDisplayUnits.push(this.superpowersData.units[4]);
      this.productionDisplayUnits.push(this.superpowersData.units[5]);
      this.productionDisplayUnits.push(this.superpowersData.units[8]);
      this.productionDisplayUnits.push(this.superpowersData.units[9]);
      this.productionDisplayUnits.push(this.superpowersData.units[12]);
      this.productionDisplayUnits.push(this.superpowersData.units[6]);
      this.productionDisplayUnits.push(this.superpowersData.units[13]);
    }
    if (segmentIdx == 2 || segmentIdx == 3) { //special
      var num2 = parseInt(this.currentPlayer.nation) + 19;
      this.tryThisUnit(num2);
      this.tryThisUnit(num2 + 8);
      this.tryThisUnit(num2 + 16);
      this.tryThisUnit(num2 + 24);
    }
  }
  tryThisUnit(id: number) {
    var unit = this.superpowersData.units[id];
    if (isUnitGoodForForm(this.segmentIdx, unit.type, unit.subType))
      this.productionDisplayUnits.push(unit);
  }


  ngStyleUnitTop(optionType) {
    if (optionType == 'production')
      return { 'max-width': '40px', 'max-height': '30px' };
    else
      return { 'max-width': '100px', 'max-height': '60px' };
  }

}
