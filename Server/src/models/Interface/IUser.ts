//This code defines an interface called User
export interface User {
    //This property holds the ID of the user as a string
    id: string;
    //This property holds the first name of the user as a string
    name: string;
    //This property holds the last name of the user as a string
    surname: string;
    //This property holds the email of the user as a string
    email: string;
    //This property holds the role of the user as a string, which is limited to one of the four options presented
    role: 'Cashier' | 'Waiter' | 'Cook'| 'Bartender';
}