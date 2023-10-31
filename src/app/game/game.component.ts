import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from './models/Player';
import { Coin } from './models/Coin';
import { Enemy } from './models/Enemy';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/User';
import { ToastrService } from 'ngx-toastr';


export var context: any;

export var barriers = [
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

export var coins: Array<Coin> = []

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  
  user?: User
  
  player: Player;
  enemies: Array<Enemy> = [];

  health = 3;

  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) {
    context = null;
    this.player = new Player(15, 435);
    for(let i = 0; i < 3; i++){
      coins.push(new Coin());
    }
    this.enemies.push(new Enemy(220, 300), new Enemy(100, 140), new Enemy(120, 220), new Enemy(120, 100, 'right'));

    
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user != null) {
      this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
      }, error => {
        console.error(error);
      });
    }
    context = this.canvas.nativeElement.getContext('2d');
    this.drawPlayer();
    this.drawEnemies();
    this.drawCoins();
    this.drawBarrier();
    setInterval(() => {
      this.moveEnemies();
    }, 30);

  }

  clearCanvas() {
    if (context) {
      context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  drawPlayer() {
    if (context) {
      context.fillStyle = this.player.color;
      context.beginPath();
      context.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  drawEnemies() {
    this.enemies.forEach(enemy => {
      enemy.draw();
    });
  }

  drawCoins(){
    coins.forEach(coin => {
      coin.draw();
    });
  }

  drawBarrier(){
    if (context) {
      context.fillStyle = 'red';
      for(let i = 0; i < barriers.length; i++){
        context.fillRect(barriers[i].x, barriers[i].y, barriers[i].width, barriers[i].height);
      }
    }
  }


  isPlayerCollidingWithBarriers(x: number, y: number, radius: number): boolean {
    for (let i = 0; i < barriers.length; i++) {
      if (
        x + radius > barriers[i].x &&
        x - radius < barriers[i].x + barriers[i].width &&
        y + radius > barriers[i].y &&
        y - radius < barriers[i].y + barriers[i].height
      ) {
        return true; // Ütközés történt
      }
    }
    return false; // Nincs ütközés
  }

  moveEnemies() {
    for(let i = 0; i < this.enemies.length; i++){ 
      this.clearCanvas();
      this.enemies[i].move();

      this.drawEnemies();
      this.drawPlayer();
      this.drawBarrier();
      this.drawCoins();
        
      this.death();
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
            if (this.user) {
              this.userService.updateDiscount(this.user.id, this.user.discount, this.player.point)
              this.router.navigate(['/main']).then(() => {
                this.toastr.success("Gratulálunk! Minden termékre " + this.player.point + "% kedvezményt kaptál!", "Kedvezmény")
              });
            }
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
        this.player.getOnePoint();
        this.death();
        break;
      case 'a':
        if(this.player.x - this.player.speed >= 15 && !this.isPlayerCollidingWithBarriers(this.player.x - this.player.speed, this.player.y, this.player.radius)){
          this.player.x -= this.player.speed;
        }
        this.player.getOnePoint();
        this.death();
        break;
      case 's':
        if(this.player.y + this.player.speed <= 435 && !this.isPlayerCollidingWithBarriers(this.player.x, this.player.y + this.player.speed, this.player.radius)){
          this.player.y += this.player.speed;
        }
        this.player.getOnePoint();
        this.death();  
        break;
      case 'd':
        if(this.player.x + this.player.speed <= 885 && !this.isPlayerCollidingWithBarriers(this.player.x + this.player.speed, this.player.y, this.player.radius)){
          this.player.x += this.player.speed;
        }
        this.player.getOnePoint();
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