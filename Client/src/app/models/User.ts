export default interface User {
  name:string,
  surname: string,
  email: string,
  role: string,
  _id: string,
  counter: WaiterStats | number
}

export interface WaiterStats {
  tablesServed : number,
  dishesServed : number,
  customersServed : number
}
