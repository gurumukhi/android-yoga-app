import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { Vibration } from '@ionic-native/vibration';
// import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  timerSetInterval = null;
  prNameList = ['Bhastrika','KapaalBhaati','Baahya','AnulomVilom','Bharaamari','Udgeet','Pranav'];
  prTimeList = [1,3,1,5,1,1,1];
  restTime = 5;
  // prNameList = ['Bhastrika','KapaalBhaati','Baahya'];
  // prTimeList = [0.1,0.2,0.1];

  getSecondsInMinutes(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  }

  startCountdown(i = 0) {
    if (this.timerSetInterval) {
      clearInterval(this.timerSetInterval);
    }
    var header = document.getElementById("cdHeader");
    var timer = document.getElementById("cdTimer");
    if (i == this.prNameList.length) {
      console.log('DONE CountDown');
      return;
    }

    header.innerHTML = this.prNameList[i];
    var countdown = this.prTimeList[i] * 60;
    // var total = countdown;
    timer.innerHTML = this.getSecondsInMinutes(countdown--);
    this.timerSetInterval = setInterval(() => {
      timer.innerHTML = this.getSecondsInMinutes(countdown);
      if (!countdown--) {
        /// vibration.start("ring");
        // this.vibration.vibrate(50);
        setTimeout(() => {
         /// vibration.stop();
          this.startCountdown(i+1);
        }, 1000);
        clearInterval(this.timerSetInterval);
      }
    }, 1000);
  }

  openSettings() {
    console.log('Opening settings');
    document.querySelector('#homeDiv').classList.add('hidden');
    document.querySelector('#countdownDiv').classList.add('hidden');
    document.querySelector('#settingsDiv').classList.remove('hidden');
  }

  start(){
    console.log('start clicked');
    document.querySelector('#homeDiv').classList.toggle('hidden');
    document.querySelector('#countdownDiv').classList.toggle('hidden');
    this.startCountdown();
  }

  goHome() {
    console.log('Home clicked');
    document.querySelector('#homeDiv').classList.remove('hidden');
    document.querySelector('#countdownDiv').classList.add('hidden');
    document.querySelector('#settingsDiv').classList.add('hidden');
  }

  public set(settingName,value){
    return this.storage.set(`setting:${ settingName }`,value);
  }
  public async get(settingName){
    return await this.storage.get(`setting:${ settingName }`);
  }
  public async remove(settingName){
    return await this.storage.remove(`setting:${ settingName }`);
  }
  async getColor() {
    console.log(this.get('color'));
    let c = await this.get('color');
    console.log(c);
  }

  public clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  increasetime (index) {
    if (!index) {
      this.restTime = this.restTime + 1;
    } else {
      this.prTimeList[index-1] = this.prTimeList[index-1] + .5;
      this.set('timeList', this.prTimeList);
    }
    this.repaintSettingsList();
  }

  decreaseTime(index) {
    if (!index) {
      this.restTime = this.restTime - (this.restTime > 0 ? 1 : 0);
    } else {
      this.prTimeList[index-1] = this.prTimeList[index-1] - (this.prTimeList[index-1] > 0 ? .5 : 0);
      this.set('timeList', this.prTimeList);
    }
    this.repaintSettingsList();
  }

  repaintSettingsList() {
    this.prTimeList.forEach((time,index) => {
      document.querySelector('#time'+(index+1)).innerHTML = time.toString();
    });
    document.querySelector('#time0').innerHTML = this.restTime.toString();
  }

  async setTimeFromStorage () {
    this.prTimeList = await this.get('timeList');
    this.restTime = await this.get('restTime');

    if(!this.prTimeList || !this.restTime) {
      this.set('timeList', [1,3,1,5,1,1,1]);
      this.set('restTime', 5);
    }
  }

  constructor(public navCtrl: NavController, public storage: Storage) {
    // constructor(public navCtrl: NavController, private vibration: Vibration) {
      setTimeout(() => {
      this.openSettings();
    }, 10);
  }
  async ionViewDidEnter() {
    await this.setTimeFromStorage();
  }
}
