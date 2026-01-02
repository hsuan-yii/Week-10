
export enum State {
  ANXIOUS = 'ANXIOUS',
  TRANSITION = 'TRANSITION',
  CALM = 'CALM'
}

export interface ReflectionMessage {
  text: string;
  author: string;
}

export interface DropletConfig {
  speed: number;
  jitter: number;
  scale: number;
  color: string;
  label: string;
}
