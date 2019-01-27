import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { Vibration } from '@ionic-native/vibration';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  timerSetInterval = null;
  getSecondsInMinutes(seconds) {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  }

  startCountdown(i = 0) {
    if (this.timerSetInterval) {
      clearInterval(this.timerSetInterval);
    }
    var prNameList = ['Bhastrika','KapaalBhaati','Baahya','AnulomVilom','Bharaamari','Udgeet','Pranav'];
    var prTimeList = [1,3,1,5,1,1,1];
    // var prNameList = ['Bhastrika','KapaalBhaati','Baahya'];
    // var prTimeList = [0.1,0.2,0.1];
    var header = document.getElementById("cdHeader");
    var timer = document.getElementById("cdTimer");
    if (i == prNameList.length) {
      console.log('DONE CountDown');
      return;
    }

    header.innerHTML = prNameList[i];
    var countdown = prTimeList[i] * 60;
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

  start(){
    console.log('start clicked');
    document.querySelector('#homeDiv').classList.toggle('hidden');
    document.querySelector('#countdownDiv').classList.toggle('hidden');

    this.startCountdown();
  }

  constructor(public navCtrl: NavController) {
    // constructor(public navCtrl: NavController, private vibration: Vibration) {
    //   setTimeout(() => {
    //   this.start();
    // }, 1000);
  }
}
