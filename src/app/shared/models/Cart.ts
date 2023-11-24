export interface Cart {
    items: Array<CartItem>;
}

export interface CartItem {
    id: string;
    product: string;
    name: string;
    price: number;
    quantity: number;
    storageQuantity: number;
}