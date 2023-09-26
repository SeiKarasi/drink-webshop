export interface User {
    id: string;
    email: string;
    // nem kéne letárolni
    // password: string;
    username: string;
    name: {
        firstname: string;
        lastname: string;
    }
    discountToLink: boolean;
}