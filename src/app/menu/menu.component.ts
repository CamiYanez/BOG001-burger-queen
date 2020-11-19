import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuService } from '../menu.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  // @Input() menu;
  // @Output() itemSelected: EventEmitter<any> = new EventEmitter();

  // addOrder(): void {
  //   console.log('añadido a la orden');
  //   this.itemSelected.emit(this.menu.id);
  // }

  menus: any;
  currentMenu = null;
  currentIndex = -1;
  title = '';

  constructor(private menuService: MenuService) { }

  ngOnInit(): void {
    this.retrieveMenu();
  }

  refreshList(): void {
    this.currentMenu = null;
    this.currentIndex = -1;
    this.retrieveMenu();
  }

  retrieveMenu(): void {
    this.menuService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.menus = data;
    });
  }

  setActiveMenu(menu, index): void {
    this.currentMenu = menu;
    this.currentIndex = index;
  }

}
