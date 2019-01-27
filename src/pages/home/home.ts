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

  setTimerText(countdown, originalMins) {
    let mins = this.getSecondsInMinutes(countdown);
    let minsLeft = countdown/60;
    if (minsLeft <= originalMins) {
      document.getElementById("cdTimer").style.visibility = 'visible';
      document.getElementById("cdTimer").innerHTML = mins;
      if (document.getElementById("cdText").innerHTML != 'time') {
        // vibration.start("ring");
        setTimeout(() => {
          // vibration.stop();
          // startCountdown(i+1);
        }, 1000);
        document.getElementById("cdText").innerHTML = 'time';
      }
    } else {
      setTimeout(() => {
        document.getElementById("cdTimer").style.visibility = 'hidden';
      }, 500) /// change this to 500
      document.getElementById("cdTimer").style.visibility = 'visible';
      document.getElementById("cdTimer").innerHTML = '--:--';
      document.getElementById("cdText").innerHTML = 'get ready!';
    }
  }

  startCountdown(i = 0) {
    if (this.timerSetInterval) {
      clearInterval(this.timerSetInterval);
    }
    var header = document.getElementById("cdHeader");
    var timer = document.getElementById("cdTimer");
    if (i == this.prNameList.length) {
      console.log('DONE CountDown');
      header.innerHTML = 'Relax!';
      timer.innerHTML = 'Completed';
      document.getElementById("cdText").innerHTML = '';
      return;
    }
    if (this.prTimeList[i] <= 0) {
      return this.startCountdown(i+1);
    }

    header.innerHTML = this.prNameList[i];
    var countdown = this.prTimeList[i] * 60 + this.restTime;
    // var total = countdown;
    this.setTimerText(countdown--, this.prTimeList[i]);
    if (this.timerSetInterval) {
      clearInterval(this.timerSetInterval);
    }
    this.timerSetInterval = setInterval(() => {
      this.setTimerText(countdown, this.prTimeList[i]);
      if (!countdown--) {
        // vibration.start("ring");
        setTimeout(() => {
          // vibration.stop();
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

  increaseTime (index) {
    console.log('increasing time for index - ' + index);
    if (!index) {
      this.restTime = this.restTime + 1;
    } else {
      this.prTimeList[index-1] = this.prTimeList[index-1] + .5;
      this.set('timeList', this.prTimeList);
    }
    this.repaintSettingsList();
  }

  decreaseTime(index) {
    console.log('decreasing time for index - ' + index);
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
    this.repaintSettingsList();
  }

  constructor(public navCtrl: NavController, public storage: Storage) {
    // constructor(public navCtrl: NavController, private vibration: Vibration) {
    //   setTimeout(() => {
    //   this.openSettings();
    // }, 10);
  }
  async ionViewDidEnter() {
    await this.setTimeFromStorage();
  }
}
