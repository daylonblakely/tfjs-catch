import { useAppSelector } from '../state/hooks';
import { VERTICAL_SECTIONS } from '../constants';

export const useCalculateReward = () => {
  const balls = useAppSelector((state) => state.balls);
  const basket = useAppSelector((state) => state.basket);

  const calculateReward = () => {
    let reward = 0;
    console.log(balls);
    balls.forEach((ball) => {
      if (!ball.isDone) {
        const ballPosition = ball.x;
        const basketPosition = basket.x;
        // TODO this might need to check the distance
        if (
          ball.y === VERTICAL_SECTIONS - 1 &&
          ballPosition === basketPosition
        ) {
          reward += 1;
        }
      }
    });
    return reward;
  };

  return { calculateReward };
};
