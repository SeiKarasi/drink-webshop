
import {context} from '../game.component';

export class Barrier {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  
    constructor() {
      this.x = this.getRandomInt(50, 800);
      this.y = this.getRandomInt(50, 380);

      if(this.getRandomInt(0,1) === 0){
        this.width = 10;
        this.height = this.getRandomInt(200, 435);
      } else {
        this.height = 10;
        this.width = this.getRandomInt(350, 885);
      };
      this.color = 'red';
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    draw(){
        if(context){
            context.fillStyle = this.color;
            context.beginPath();
            context.fillRect(this.x, this.y, this.width, this.height);
        }
      }
  }