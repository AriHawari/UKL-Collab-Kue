export class CreateTransactionDto {
  userId: number;
  items: TransactionItemDto[];
}

export class TransactionItemDto {
  menuId: number;
  quantity: number;
}