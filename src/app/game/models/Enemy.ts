import {context, barriers} from '../game.component';

export class Enemy {
    x: number;
    y: number;
    radius: number;
    speed: number;
    color: string;
    directionOfMovement: string;
  
    constructor() {
      this.x = this.getRandomInt(15, 885);
      this.y = this.getRandomInt(15, 435);
      this.radius = 15;
      this.speed = 5;
      this.color = 'black';
      if(this.getRandomInt(0,1) === 0){
        this.directionOfMovement = 'left';
      } else {
        this.directionOfMovement = 'right';
      }  
    }

    getRandomInt(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    draw() {
        if (context) {
          context.fillStyle = this.color;
          context.beginPath();
          context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          context.fill();
        }
    }

    move() {
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