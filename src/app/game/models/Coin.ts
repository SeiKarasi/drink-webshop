
import {context} from '../game.component';

export class Coin {
    x: number;
    y: number;
    radius: number;
    color: string
  
    constructor() {
      this.x = this.getRandomInt(15, 885);
      this.y = this.getRandomInt(15, 435);
      this.radius = 5;
      this.color = 'yellow';
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        console.log(min);
        max = Math.floor(max);
        console.log(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    draw(){
        if(context){
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }
      }
  }