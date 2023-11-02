import { coins, barriers, enemies, context } from "../game.component";
import { Coin } from "./Coin";

export class Player {
    x: number;
    y: number;
    radius: number;
    speed: number;
    color: string;
    point: number;
    health: number;
  
    constructor(x: number = 15, y: number = 435) {
      this.x = x;
      this.y = y;
      this.radius = 15;
      this.speed = 2.5;
      this.color = 'blue';
      this.point = 0;
      this.health = 3;
    }

    draw(){
      if (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
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

    death(){
      for (let i = 0; i < enemies.length; i++) {
        if (
          this.x + this.radius > enemies[i].x &&
          this.x - this.radius < enemies[i].x + enemies[i].radius &&
          this.y + this.radius > enemies[i].y &&
          this.y - this.radius < enemies[i].y + enemies[i].radius
        ) {
          this.x = 15;
          this.y = 435;
          this.health--;
          for(let i = 0; i < this.point; i++){
            coins.push(new Coin());
          }
          this.point = 0;
          alert("Vesztettél 1 életet és elveszítetted a pontjaidat! Próbáld újra!");
        }
      }
    }

    
  }