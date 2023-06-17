import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import User from "../models/User"
import {UserHttpService} from '../Services/user-http.service';
import {Router} from "@angular/router";
import {SocketioService} from "../Services/socketio.service";

enum Role {
  WAITERS = 'Waiter',
  COOKS = 'Cook',
  BARTENDERS = 'Bartender',
  CASHIERS = 'Cashier',
  ALL = 'All'
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit{
  @Input() users : User[] = [];
  @Output() loadUsers : EventEmitter<any> = new EventEmitter<any>;
  protected filter : Role = Role.ALL;
  protected Role = Role;
  protected popup : {name?: string, surname?: string, role?: string, id?:string, confirm?: boolean, counter ?: any} = {}
  protected alert : {error ?: boolean, message ?: string} = {}
  protected popupModify : {name ?: string, surname ?: string, email ?: string, role ?: string, password ?: string, id?: string} = {}
  protected mapper : any = {Waiter: "assets/images/waiterProfile.png", Cook: "assets/images/cookProfile.png", Bartender: "assets/images/bartenderProfile.png", Cashier: "assets/images/cashierProfile.png", Admin: "assets/images/adminProfile.png"}

  constructor(protected us : UserHttpService, protected router : Router, protected so : SocketioService) {}

  ngOnInit(): void {

  }

  getProfilePicture(role: string) {
    return this.mapper[role];
  }

  setModifyPopup(user : User) {
    this.popupModify = {name: user.name, surname: user.surname, email: user.email, role: user.role, id:user._id}
  }

  showUsers(){
    if (this.filter === Role.ALL) return this.users;
    return this.users.filter( (user) => user.role === this.filter);
  }


  closePopup(){
    this.popup = {}
  }

  logout() {
    this.so.disconnect();
    this.us.logout();
    this.router.navigate(['/login'])
  }

  setConfirm() {
    const confirm = {...this.popup};
    confirm.confirm = true;
    this.popup = confirm;

  }

  goToRegister() {
    this.so.disconnect();
    this.router.navigate(['/register'])
  }

  modifyUser(userObj : any){
    const input = {
      new_name: userObj.name,
      new_surname: userObj.surname,
      new_email: userObj.email,
      new_role: userObj.role,
      new_password: userObj.password
    }
    this.us.modifyUser(input, userObj.id).subscribe({
      next: (data) => {
        this.alert = {error: false, message:"User modified correctly"}
        this.loadUsers.emit("user_modified")

      },
      error: (err) => {
        this.alert = {error: true, message: err.message}
      }
    })
  }

  impersonateUser(role: Role) {
    // console.log(role as string)
    // this.us.setAdminRole(role)
    const mapper = {Cook:"/makers", Bartender:"/makers", Waiter:"/waiters", Cashier:"/cashiers", All:"/admins"}
    this.so.disconnect();
    if (role === 'Cook' && this.us.hasRole('Admin')) this.us.SetAdminMakersRole('foodqueue');
    else if (role === 'Bartender' && this.us.hasRole('Admin')) this.us.SetAdminMakersRole('drinkqueue')
    this.so.disconnect();
    this.router.navigate([mapper[role]])
  }

  deleteUser(id?: string){
    // this.alert = {error: true, message: "User deleted succesfully"}
    // console.log(id);
    this.us.deleteUser(id as string).subscribe({
      next:(data) => {
        this.loadUsers.emit('user_modified')
        this.alert = {error: false, message: "User deleted succesfully"}
      },
      error: (err) => this.alert = {error: true, message: err.message}
    })
  }

  getStatsName(role ?: string) : string {
    const mapper : any = {Bartender : 'Drinks prepared', Cook:"Dishes prepared", Cashier:"Receipts created", Admin:"Stats counter"}
    return mapper[role as string];
  }

  closeAlert() {
    this.alert = {}
  }

  showPopup(user : User) {
    this.popup = {name: user.name, surname: user.surname, role: user.role, id: user._id, confirm: false, counter: user.counter}
  }
}
