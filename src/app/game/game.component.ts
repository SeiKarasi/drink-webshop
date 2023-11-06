import { Component, ElementRef, HostListener, ViewChild, OnInit, OnDestroy } from '@angular/core';
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

  health?: number;

  moveEnemyIntervalId: any;
  

  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) {
    context = null;
    this.player = new Player(15, 435);
    for(let i = 0; i < this.getRandomInt(7,12); i++){
      barriers.push(new Barrier());
    }
    for(let i = 0; i < this.getRandomInt(3,6); i++){
      enemies.push(new Enemy());
    }
    for(let i = 0; i < 3; i++){
      coins.push(new Coin());
    }
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') as string) as firebase.default.User;
    if (user != null) {
        this.userService.getById(user.uid).subscribe(data => {
        this.user = data;
        this.health = this.user?.gameHealth;
      }, error => {
        console.error(error);
      });
    }
    context = this.canvas.nativeElement.getContext('2d');
    this.drawBarrier();
    this.player?.draw();
    this.drawEnemies();
    this.drawCoins();

    this.moveEnemyIntervalId = setInterval(() => {
      this.moveEnemies();
    }, 30);
  }

  ngOnDestroy(){
    barriers = [];
    coins = [];
    enemies = [];
    clearInterval(this.moveEnemyIntervalId);
    this.clearCanvas();
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  clearCanvas(){
    if(context){
      context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  clearCircles() {
    if (context) {
      enemies.forEach(enemy => {
        context.clearRect(enemy.x - enemy.radius, enemy.y - enemy.radius, enemy.radius * 2, enemy.radius * 2);
      });
      coins.forEach(coin => {
        context.clearRect(coin.x - coin.radius, coin.y - coin.radius, coin.radius * 2, coin.radius * 2);
      });

      context.clearRect(this.player.x - this.player.radius, this.player.y - this.player.radius, this.player.radius * 2, this.player.radius * 2)
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
        this.clearCircles();
        enemies[i].move();
  
        this.drawEnemies();
        this.player.draw();
        this.drawBarrier();
        this.drawCoins();
          
        this.death();
      }  
  }

  death(){
    for (let i = 0; i < enemies.length; i++) {
      if (
        this.player.x + this.player.radius > enemies[i].x &&
        this.player.x - this.player.radius < enemies[i].x + enemies[i].radius &&
        this.player.y + this.player.radius > enemies[i].y &&
        this.player.y - this.player.radius < enemies[i].y + enemies[i].radius
      ) {
        this.clearCircles();
        this.player.x = 15;
        this.player.y = 435;
        this.health! -= 1;
        if(this.health! >= 0){
          this.userService.updateHealth(this.user!.id, this.health!);
        }
        for(let i = 0; i < this.player.point; i++){
          coins.push(new Coin());
        }
        this.player.point = 0;
        alert("Vesztettél 1 életet és elveszítetted a pontjaidat! Próbáld újra!");
      }
    }
    if(this.health! === 0 && this.yourDead === false){
      this.yourDead = true;
      
      this.router.navigateByUrl('/main').then(() => {
        this.toastr.error("Vesztettél! Sajnáljuk de ezúttal nem szereztél kedvezményt!", "Kedvezmény");
        //this.toastr.error("Még nem játszhatsz újra!", "Játék");
      });
    }
  }

  win(){
    if(this.health! > 0 && this.player.point === 3){
      if (this.user) {
        this.userService.updateDiscount(this.user.id, this.user.discount, this.player.point);
        this.userService.updateHealth(this.user!.id, 0);
        this.router.navigateByUrl('/main').then(() => {
          this.toastr.success("Gratulálunk! Minden termékre " + this.player.point + "% kedvezményt kaptál!", "Kedvezmény");
        });
      }
      this.router.navigateByUrl("/main");
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.clearCircles();
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
    


    this.drawEnemies();
    this.player.draw();
    this.drawCoins();
    
  }
}