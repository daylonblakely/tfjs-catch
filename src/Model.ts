import * as tf from '@tensorflow/tfjs';

export class Model extends tf.Sequential {
  inputSize: number;
  private numActions: number;

  constructor(
    inputSize: number,
    numActions: number,
    hiddenLayerSizes: number[]
  ) {
    super();
    this.inputSize = inputSize;
    this.numActions = numActions;

    hiddenLayerSizes.forEach((hiddenLayerSize, i) => {
      this.add(
        tf.layers.dense({
          units: hiddenLayerSize,
          activation: 'relu',
          // `inputShape` is required only for the first layer.
          inputShape: i === 0 ? [this.inputSize] : undefined,
        })
      );
    });
    this.add(tf.layers.dense({ units: this.numActions }));

    this.summary();
    this.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  }
}
