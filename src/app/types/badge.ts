export interface IBadge {
  badge: string;
  message: string;
  img?: string;
  fontColor: string;
  messages: {
    img: string;
    message: string;
  }[];
}
