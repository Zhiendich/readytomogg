export interface CreateMessageEvent {
  id: string;
  chatId: string;
  message: string;
  senderId: string;
  receiverId: string;
}
