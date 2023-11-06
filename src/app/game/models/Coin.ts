
import {context, barriers} from '../game.component';

export class Coin {
    x: number;
    y: number;
    radius: number;
  
    constructor() {
      this.radius = 10;
      let {x, y} = this.getRandomIntWithExclusions(15,885, 15, 430);
      this.x = x;
      this.y = y;  
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomIntWithExclusions(minX: number, maxX: number, minY: number, maxY: number): {x: number, y: number} {
        
        while (true) {
          let randomNumber = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
          let randomNumber2 = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
          let isExcluded = false;
      
          for (let i = 0; i < barriers.length; i++) {
            if((randomNumber + this.radius > barriers[i].x &&
              randomNumber - this.radius < barriers[i].x + barriers[i].width &&
              randomNumber2 + this.radius > barriers[i].y &&
              randomNumber2 - this.radius < barriers[i].y + barriers[i].height) ||
              (randomNumber2 > 400))
              {
                isExcluded = true;
                break;
              }
          }
      
          if (!isExcluded) {
            return {x: randomNumber, y: randomNumber2};
          }
        }
      }

    draw(){
        if(context){
          const img = new Image();
          img.src = '../assets/img/coin.png';
          context.beginPath();
          context.drawImage(img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
      }
  }