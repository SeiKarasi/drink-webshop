import {context, barriers} from '../game.component';

export class Enemy {
    x: number;
    y: number;
    radius: number;
    speed: number;
    color: string;
    directionOfMovement: string;
    horizontalOrVerticalMovement: string;
  
    constructor() {
      this.radius = 15;
      this.speed = 5;
      this.color = 'red';
      let {x, y} = this.getRandomIntWithExclusions(15,885, 15, 430);
      this.x = x;
      this.y = y;
      if(this.getRandomInt(0,1) === 0){
        this.horizontalOrVerticalMovement = "horizontal";
        if(this.getRandomInt(0,1) === 0){
          this.directionOfMovement = 'left';
        } else {
          this.directionOfMovement = 'right';
        } 
      } else {
        this.horizontalOrVerticalMovement = "vertical";
        if(this.getRandomInt(0,1) === 0){
          this.directionOfMovement = 'top';
        } else {
          this.directionOfMovement = 'bottom';
        }
      }
       
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
            randomNumber2 - this.radius < barriers[i].y + barriers[i].y + barriers[i].height) ||
            (randomNumber2 > 400) || (randomNumber < 40))
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


    draw() {
        if (context) {
          const img = new Image();
          img.src = '../assets/img/enemy.png';
          context.beginPath();
          context.drawImage(img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
    }

    move() {
      if(this.horizontalOrVerticalMovement === 'horizontal'){
        if (this.directionOfMovement === 'left' && this.x - this.speed >= 15 && !this.isCollidingWithBarriers(this.x - this.speed, this.y)) {
          this.x -= this.speed;
          // Fordulás jobbra
        } else if(this.x - this.speed < 15 || this.isCollidingWithBarriers(this.x - this.speed, this.y)) {
          this.directionOfMovement = 'right';
          this.x += this.speed;  
        } else if(this.directionOfMovement === 'right' && this.x + this.speed <= 885 && !this.isCollidingWithBarriers(this.x + this.speed, this.y)) {
          this.x += this.speed;  
          // Fordulás balra
        } else if(this.x + this.speed > 885 || this.isCollidingWithBarriers(this.x + this.speed, this.y)){
          this.directionOfMovement = 'left';
          this.x += this.speed;  
        }
      } else {
        if (this.directionOfMovement === 'top' && this.y - this.speed >= 15 && !this.isCollidingWithBarriers(this.x, this.y - this.speed)) {
          this.y -= this.speed;
          // Fordulás lefele
        } else if(this.y - this.speed < 15 || this.isCollidingWithBarriers(this.x, this.y - this.speed)) {
          this.directionOfMovement = 'bottom';
          this.y += this.speed;  
        } else if(this.directionOfMovement === 'bottom' && this.y + this.speed <= 435 && !this.isCollidingWithBarriers(this.x, this.y + this.speed)) {
          this.y += this.speed;  
          // Fordulás balra
        } else if(this.y + this.speed > 435 || this.isCollidingWithBarriers(this.x, this.y + this.speed)){
          this.directionOfMovement = 'top';
          this.y += this.speed;  
        }
      }
         
      }
      
      isCollidingWithBarriers(x: number, y: number): boolean {
        for (let i = 0; i < barriers.length; i++) {
          if (
            x + this.radius > barriers[i].x &&
            x - this.radius < barriers[i].x + barriers[i].width &&
            y + this.radius > barriers[i].y &&
            y - this.radius < barriers[i].y + barriers[i].height
          ) {
            return true; // Ütközés történt
          }
        }
        return false; // Nincs ütközés
      }
  }