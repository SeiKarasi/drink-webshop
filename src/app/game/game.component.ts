import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D | null;

  player = {
    x: 15,
    y: 435,
    radius: 15,
    speed: 2.5
  };

  coins = [
    {
      x: 30,
      y: 25,
      radius: 5
    },
    {
      x: 500,
      y: 30,
      radius: 5
    }
  ];

  barriers = [
    {
      x: 0,
      y: 50,
      width: 380,
      height: 10
    },
    {
      x: 450,
      y: 0,
      width: 10,
      height: 200
    },
    {
      x: 420,
      y: 250,
      width: 10,
      height: 200
    }
  ];

  enemies = [
    {
      x: 220,
      y: 300,
      radius: 15,
      speed: 2.5,
      move: 'left',
    },
    {
      x: 100,
      y: 140,
      radius: 15,
      speed: 2.5,
      move: 'left',
    },
    {
      x: 120,
      y: 220,
      radius: 15,
      speed: 2.5,
      move: 'left',
    },
    {
      x: 120,
      y: 100,
      radius: 15,
      speed: 2.5,
      move: 'right',
    }
    
  ]

  point = 0;

  health = 3;

  constructor(private router: Router) {
    this.context = null;
  }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.drawPlayer();
    this.drawEnemies();
    this.drawCoins();
    this.drawBarrier();
    setInterval(() => {
      this.moveEnemies();
    }, 30);

  }

  clearCanvas() {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  drawPlayer() {
    if (this.context) {
      this.context.fillStyle = 'blue';
      this.context.beginPath();
      this.context.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
      this.context.fill();
    }
  }

  drawEnemies() {
    if (this.context) {
      this.context.fillStyle = 'black';
      this.context.beginPath();
      for(let i = 0; i < this.enemies.length; i++){
        this.context.arc(this.enemies[i].x, this.enemies[i].y, this.enemies[i].radius, 0, Math.PI * 2);
      }
      this.context.fill();
    }
  }

  drawCoins(){
    if(this.context){
      this.context.fillStyle = 'yellow';
      this.context.beginPath();
      for(let i = 0; i < this.coins.length; i++){
        this.context.arc(this.coins[i].x, this.coins[i].y, this.coins[i].radius, 0, Math.PI * 2);
      }
      this.context.fill();
    }
  }

  drawBarrier(){
    if (this.context) {
      this.context.fillStyle = 'red';
      for(let i = 0; i < this.barriers.length; i++){
        this.context.fillRect(this.barriers[i].x, this.barriers[i].y, this.barriers[i].width, this.barriers[i].height);
      }
    }
  }

  getOnePoint(x: number, y: number){
    for(let i = 0; i < this.coins.length; i++){
      const coin = this.coins[i];
      if (
        x + this.player.radius > coin.x &&
        x - this.player.radius < coin.x + coin.radius &&
        y + this.player.radius > coin.y &&
        y - this.player.radius < coin.y + coin.radius
      ){
        this.coins.splice(i, 1);
        this.point++;
      }
    }
  }

  isPlayerCollidingWithBarriers(x: number, y: number, radius: number): boolean {
    for (let i = 0; i < this.barriers.length; i++) {
      const barrier = this.barriers[i];
      if (
        x + radius > barrier.x &&
        x - radius < barrier.x + barrier.width &&
        y + radius > barrier.y &&
        y - radius < barrier.y + barrier.height
      ) {
        return true; // Ütközés történt
      }
    }
    return false; // Nincs ütközés
  }

  moveEnemies() {
    for(let i = 0; i < this.enemies.length; i++){ 
      this.clearCanvas();
      if (this.enemies[i].move === 'left' && this.enemies[i].x - this.enemies[i].speed >= 15 && !this.isPlayerCollidingWithBarriers(this.enemies[i].x - this.enemies[i].speed, this.enemies[i].y, this.enemies[i].radius)) {
        this.enemies[i].x -= this.enemies[i].speed;

        this.drawEnemies();
        this.drawPlayer();
        this.drawBarrier();
        this.drawCoins();
        
        this.death();
        // Fordulás jobbra
      } else if(this.enemies[i].x - this.enemies[i].speed < 15 || this.isPlayerCollidingWithBarriers(this.enemies[i].x - this.enemies[i].speed, this.enemies[i].y, this.enemies[i].radius)) {
        this.enemies[i].move = 'right';
        this.enemies[i].x += this.enemies[i].speed;  

        this.drawEnemies();
        this.drawPlayer();
        this.drawBarrier();
        this.drawCoins();
       
        this.death();
      } else if(this.enemies[i].move === 'right' && this.enemies[i].x + this.enemies[i].speed <= 885 && !this.isPlayerCollidingWithBarriers(this.enemies[i].x + this.enemies[i].speed, this.enemies[i].y, this.enemies[i].radius)) {
        this.enemies[i].x += this.enemies[i].speed;  

        this.drawEnemies();
        this.drawPlayer();
        this.drawBarrier();
        this.drawCoins();
       
        this.death();
        // Fordulás balra
      } else if(this.enemies[i].x + this.enemies[i].speed > 885 || this.isPlayerCollidingWithBarriers(this.enemies[i].x + this.enemies[i].speed, this.enemies[i].y, this.enemies[i].radius)){
        this.enemies[i].move = 'left';
        this.enemies[i].x += this.enemies[i].speed;  

        this.drawEnemies();
        this.drawPlayer();
        this.drawBarrier();
        this.drawCoins();
       
        this.death();
      }
    }  
  }

  death(): boolean{
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (
        this.player.x + this.player.radius > enemy.x &&
        this.player.x - this.player.radius < enemy.x + enemy.radius &&
        this.player.y + this.player.radius > enemy.y &&
        this.player.y - this.player.radius < enemy.y + enemy.radius
      ) {
        this.player.x = 15;
        this.player.y = 435;
        this.health--;
        alert("Vesztettél 1 életet!");
        if(this.health === 0){
          this.router.navigateByUrl("/main");
        }
        return true;
      }
    }
    return false;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        if(this.player.y - this.player.speed >= 15 && !this.isPlayerCollidingWithBarriers(this.player.x, this.player.y - this.player.speed, this.player.radius)){
          this.player.y -= this.player.speed;
        }
        this.getOnePoint(this.player.x, this.player.y);
        this.death();
        break;
      case 'a':
        if(this.player.x - this.player.speed >= 15 && !this.isPlayerCollidingWithBarriers(this.player.x - this.player.speed, this.player.y, this.player.radius)){
          this.player.x -= this.player.speed;
        }
        this.getOnePoint(this.player.x, this.player.y);
        this.death();
        break;
      case 's':
        if(this.player.y + this.player.speed <= 435 && !this.isPlayerCollidingWithBarriers(this.player.x, this.player.y + this.player.speed, this.player.radius)){
          this.player.y += this.player.speed;
        }
        this.getOnePoint(this.player.x, this.player.y);
        this.death();  
        break;
      case 'd':
        if(this.player.x + this.player.speed <= 885 && !this.isPlayerCollidingWithBarriers(this.player.x + this.player.speed, this.player.y, this.player.radius)){
          this.player.x += this.player.speed;
        }
        this.getOnePoint(this.player.x, this.player.y);
        this.death();
        break;
    }
    this.clearCanvas();


    this.drawEnemies();
    this.drawPlayer();
    this.drawBarrier();
    this.drawCoins();
    
  }
}