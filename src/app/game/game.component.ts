import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';

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
  ]

  point = 0;

  constructor() {
    this.context = null;
  }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.drawPlayer();
    this.drawCoins();
    this.drawBarrier();
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

  getOnePoint(){
    for(let i = 0; i < this.coins.length; i++){
      if(this.player.y === this.coins[i].y && this.player.x === this.coins[i].x){
        this.coins.splice(i, 1);
        this.point++;
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        if(this.player.y - this.player.speed >= 15){
          this.player.y -= this.player.speed;
        }
        this.getOnePoint();
        break;
      case 'a':
        if(this.player.x - this.player.speed >= 15){
          this.player.x -= this.player.speed;
        }
        this.getOnePoint();
        break;
      case 's':
        if(this.player.y + this.player.speed <= 435){
          this.player.y += this.player.speed;
        }
        this.getOnePoint();      
        break;
      case 'd':
        if(this.player.x + this.player.speed <= 885){
          this.player.x += this.player.speed;
        }
        this.getOnePoint();
        break;
    }
    
    this.clearCanvas();
    this.drawBarrier();
    this.drawCoins();
    this.drawPlayer();
  }
}