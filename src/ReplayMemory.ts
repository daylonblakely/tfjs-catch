import { sampleSize } from 'lodash';
import * as tf from '@tensorflow/tfjs';

export class ReplayMemory {
  private maxMemory: number;
  private memory: [tf.Tensor, number, number, tf.Tensor][] = [];

  constructor(maxMemory: number) {
    this.maxMemory = maxMemory;
  }

  addSample(sample: [tf.Tensor, number, number, tf.Tensor]) {
    this.memory.push(sample);
    if (this.memory.length > this.maxMemory) {
      let [state, , , nextState] = this.memory.shift() || [];
      state?.dispose();
      nextState?.dispose();
    }
  }

  sample(nSamples: number) {
    return sampleSize(this.memory, nSamples);
  }
}
