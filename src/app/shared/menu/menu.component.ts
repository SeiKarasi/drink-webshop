import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() currentPage: string = '';
  // Output tehát abba a komponensbe küldjük vissza, ami őt meghívta!
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  // Az emit továbbadja ezt a pageValue értéket az eseményre feliratkozóknak!
  menuSwitch(){
    this.selectedPage.emit(this.currentPage);
  }

}
