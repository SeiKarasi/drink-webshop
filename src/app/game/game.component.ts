import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from './models/Player';
import { Coin } from './models/Coin';
import { Enemy } from './models/Enemy';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { Barrier } from './models/Barrier';


export var context: any;

export var barriers: Array<Barrier> = [];

export var coins: Array<Coin> = [];

export var enemies: Array<Enemy> = [];

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  
  user?: User;
  
  player: Player;

  yourDead: boolean = false;
  

  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) {
    context = null;
    this.player = new Player(15, 435);
    for(let i = 0; i < this.getRandomInt(5,8); i++){
      barriers.push(new Barrier());
    }
    for(let i = 0; i < this.getRandomInt(4,10); i++){
      enemies.push(new Enemy());
    } 
    for(let i = 0; i < 3; i++){
      coins.push(new Coin());
    }
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
    this.player.draw();
    this.drawEnemies();
    this.drawCoins();
    this.drawBarrier();
    setInterval(() => {
      this.moveEnemies();
    }, 25);

  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  clearCanvas() {
    if (context) {
      context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  drawEnemies() {
    enemies.forEach(enemy => {
      enemy.draw();
    });
  }

  drawCoins(){
    coins.forEach(coin => {
      coin.draw();
    });
  }

  drawBarrier(){
    barriers.forEach(barrier => {
      barrier.draw();
    })
  }

  moveEnemies() {
    for(let i = 0; i < enemies.length; i++){ 
      this.clearCanvas();
      enemies[i].move();

      this.drawEnemies();
      this.player.draw();
      this.drawBarrier();
      this.drawCoins();
        
      this.death();
    }  
  }

  death(){
    this.player.death();
    if(this.player.health === 0 && this.yourDead === false){
      this.yourDead = true;
      if (this.user) {
        this.router.navigate(['/main']).then(() => {
          this.toastr.error("Vesztettél! Sajnáljuk de ezúttal nem szereztél kedvezményt!", "Kedvezmény");
        });
      }
    this.router.navigateByUrl("/main");
  }
  }

  win(){
    if(this.player.health > 0 && this.player.point === 3){
      if (this.user) {
        this.userService.updateDiscount(this.user.id, this.user.discount, this.player.point)
        this.router.navigate(['/main']).then(() => {
          this.toastr.success("Gratulálunk! Minden termékre " + this.player.point + "% kedvezményt kaptál!", "Kedvezmény");
        });
      }
      this.router.navigateByUrl("/main");
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        if(this.player.y - this.player.speed >= 15 && !this.player.isCollidingWithBarriers(this.player.x, this.player.y - this.player.speed)){
          this.player.y -= this.player.speed;
        }
        this.player.getOnePoint();
        this.win();
        this.death();
        break;
      case 'a':
        if(this.player.x - this.player.speed >= 15 && !this.player.isCollidingWithBarriers(this.player.x - this.player.speed, this.player.y)){
          this.player.x -= this.player.speed;
        }
        this.player.getOnePoint();
        this.win();
        this.death();
        break;
      case 's':
        if(this.player.y + this.player.speed <= 435 && !this.player.isCollidingWithBarriers(this.player.x, this.player.y + this.player.speed)){
          this.player.y += this.player.speed;
        }
        this.player.getOnePoint();
        this.win();
        this.death();  
        break;
      case 'd':
        if(this.player.x + this.player.speed <= 885 && !this.player.isCollidingWithBarriers(this.player.x + this.player.speed, this.player.y)){
          this.player.x += this.player.speed;
        }
        this.player.getOnePoint();
        this.win();
        this.death();
        break;
    }
    this.clearCanvas();


    this.drawEnemies();
    this.player.draw();
    this.drawBarrier();
    this.drawCoins();
    
  }
}