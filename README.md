# Basketball Hoop RL Trainer

This is a React application built with TypeScript and TensorFlow\.js. The app trains a reinforcement learning model to control a basketball hoop, moving it left and right to catch falling basketballs.

## Features

- **Reinforcement Learning**: Uses TensorFlow\.js to train a model that controls the basket.
- **Three Actions**: Move left, move right, or stay in place.
- **Reward System**:
  - Positive reward for catching a ball.
  - Small reward for hitting the rim.
  - Small reward for moving toward an imminent ball.
  - Negative reward for missing a ball.
- **Sparse vs. Dense Rewards**: The model receives a mix of sparse rewards (e.g., catching a ball) and dense rewards (e.g., incremental rewards for movement and rim hits) to encourage learning.
- **Epsilon-Greedy Policy**: Balances exploration and exploitation for action selection.
- **Training Settings**: Adjustable hyper-parameters for model training.

## Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <repo-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## Usage

- Click the **Play** button to start the game and animations.
- Open **Training Settings** to modify hyper-parameters.

## Tech Stack

- React (TypeScript)
- TensorFlow\.js
- Reinforcement Learning

## License

MIT
