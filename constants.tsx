
import { State, DropletConfig } from './types';

export const CONFIGS: Record<State, DropletConfig> = {
  [State.ANXIOUS]: {
    speed: 1.5,
    jitter: 15,
    scale: 0.9,
    color: '#3b82f6', // blue-500
    label: '心急如焚的跳動'
  },
  [State.TRANSITION]: {
    speed: 3.0,
    jitter: 5,
    scale: 1.1,
    color: '#2dd4bf', // teal-400
    label: '深呼吸，慢慢緩下來'
  },
  [State.CALM]: {
    speed: 5.0,
    jitter: 0,
    scale: 1.3,
    color: '#a78bfa', // violet-400
    label: '如水般的安定'
  }
};
