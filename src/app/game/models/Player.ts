import { coins, barriers, context } from "../game.component";

export class Player {
    x: number;
    y: number;
    radius: number;
    speed: number;
    color: string;
    point: number;
  
    constructor(x: number = 15, y: number = 435) {
      this.x = x;
      this.y = y;
      this.radius = 15;
      this.speed = 2.5;
      this.color = 'cyan';
      this.point = 0;
    }

    draw(){
      if (context) {
        const img = new Image();
        img.src = '../assets/img/player.png';
        context.beginPath();
        context.drawImage(img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
       /* context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill(); */
      }
    }

    getOnePoint(){
      for(let i = 0; i < coins.length; i++){
        if (
          this.x + this.radius > coins[i].x &&
          this.x - this.radius < coins[i].x + coins[i].radius &&
          this.y + this.radius > coins[i].y &&
          this.y - this.radius < coins[i].y + coins[i].radius
        ){
          coins.splice(i, 1);
          this.point++;
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