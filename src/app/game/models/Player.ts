import { coins } from "../game.component";

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
      this.color = 'blue';
      this.point = 0;
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

    
  }