
import {context, barriersXPlusWidth, barriersYPlusHeight} from '../game.component';

export class Coin {
    x: number;
    y: number;
    radius: number;
    color: string
  
    constructor() {
      this.radius = 5;
      let {x, y} = this.getRandomIntWithExclusions(15,885, 15, 430, barriersXPlusWidth, barriersYPlusHeight);
      this.x = x;
      this.y = y;  
      this.color = 'yellow';
    }

    getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomIntWithExclusions(minX: number, maxX: number, minY: number, maxY: number, exclusionsX: Array<{ from: number, to: number }>, exclusionsY: Array<{ from: number, to: number }>): {x: number, y: number} {
        const excludedRangesX = exclusionsX || [];
        const excludedRangesY = exclusionsY || [];
        
        while (true) {
          let randomNumber = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
          let randomNumber2 = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
          let isExcluded = false;
      
          for (let i = 0; i < excludedRangesX.length; i++) {
            if((randomNumber + this.radius > excludedRangesX[i].from &&
              randomNumber - this.radius < excludedRangesX[i].to &&
              randomNumber2 + this.radius > excludedRangesY[i].from &&
              randomNumber2 - this.radius < excludedRangesY[i].to) ||
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
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
        }
      }
  }