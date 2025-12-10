export class CreateOrderDto {
  email: string;
  username?: string;
  amount: number;
  currency?: string;
  metadata?: any;
}