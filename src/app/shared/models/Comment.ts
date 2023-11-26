export interface Comment {
    id: string;
    username: string;
    comment: string;
    // Könnyebb így használni itt
    date: number;
    productId?: string;
}