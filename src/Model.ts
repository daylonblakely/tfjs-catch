import * as tf from '@tensorflow/tfjs';

export class Model extends tf.Sequential {
  numStates: number;
  private numActions: number;

  constructor(
    numStates: number,
    numActions: number,
    hiddenLayerSizes: number[]
  ) {
    super();
    this.numStates = numStates;
    this.numActions = numActions;

    hiddenLayerSizes.forEach((hiddenLayerSize, i) => {
      this.add(
        tf.layers.dense({
          units: hiddenLayerSize,
          activation: 'relu',
          // `inputShape` is required only for the first layer.
          inputShape: i === 0 ? [this.numStates] : undefined,
        })
      );
    });
    this.add(tf.layers.dense({ units: this.numActions }));

    this.summary();
    this.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  }
}
