import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../Interfaces/menu.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../Interfaces/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  //waiter
  private wishes: Menu[] = [];
  private order = new BehaviorSubject<Menu[]>([]);
  order$ = this.order.asObservable();

  //kitchen
  private ordersCompleted: Order[] = [];
  private ready = new BehaviorSubject<Order[]>([]);
  ready$ = this.ready.asObservable();

  constructor(private firestore: AngularFirestore) {}

  addWishes(wish: Menu) {
    this.wishes = [...this.wishes, wish];
    this.order.next(this.wishes);
  }

  removeWish(index) {
    this.wishes = this.wishes.filter((item, i) => i !== index);
    this.order.next(this.wishes);
  }

  generateOrder(name: string, table: number, bill: Number): Promise<void> {
    const items = this.wishes;
    const createdAt = Date.now();
    const id = this.firestore.createId();
    return this.firestore.doc(`orders/${id}`).set({
      name,
      table,
      bill,
      items,
      createdAt,
    });
  }

  clearWishes() {
    this.wishes = [];
    this.order.next(this.wishes);
  }

  getOrder(): Observable<Order[]> {
    console.log(this.firestore.collection<Order>('orders').valueChanges());
    return this.firestore
      .collection<Order>('orders', (order) =>
        order.orderBy('createdAt', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  addCompleteOrder(order: Order) {
    console.log(order);

    this.ordersCompleted = [...this.ordersCompleted, order];
    this.ready.next(this.ordersCompleted);
  }
}
