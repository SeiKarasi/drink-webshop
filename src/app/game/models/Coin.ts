
import {context, barriers} from '../game.component';

export class Coin {
    x: number;
    y: number;
    radius: number;
  
    constructor() {
      this.radius = 10;
      let {x, y} = this.getRandomIntWithExclusions(350,885, 15, 430);
      this.x = x;
      this.y = y;  
    }

    getRandomIntWithExclusions(minX: number, maxX: number, minY: number, maxY: number): {x: number, y: number} {
        
        while (true) {
          let randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
          let randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
          let isExcluded = false;
      
          for (let i = 0; i < barriers.length; i++) {
            if((randomX + this.radius > barriers[i].x &&
              randomX - this.radius < barriers[i].x + barriers[i].width &&
              randomY + this.radius > barriers[i].y &&
              randomY - this.radius < barriers[i].y + barriers[i].height) ||
              (randomY > 400))
              {
                isExcluded = true;
                break;
              }
          }
      
          if (!isExcluded) {
            return {x: randomX, y: randomY};
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