import { IBadge } from './badge';

export interface IPort {
  _id?: string;
  topic: string;
  event: string;
  terminalTitle: string;
  imgUrl: string;
  badges: IBadge[];
  shortDescription: string;
  fontColor: string;
}
