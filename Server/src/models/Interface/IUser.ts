// export enum Role {
//     CASHIER = 'Cashier',
//     WAITER = 'Waiter',
//     COOK = 'Cook',
//     BARTENDER = 'Bartender'
// }

export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: 'Cashier' | 'Waiter' | 'Cook'| 'Bartender';
}