export type ResampleParams = {
  originSampleRate: number;
  resampleRate: number;
  originAudioBuffer: AudioBuffer;
};

interface ConvertFn {
  ({ originAudioBuffer, originSampleRate, resampleRate }: ResampleParams): AudioBuffer;
}

const getClippedInput = (t: number, samples: Float32Array, length: number) => {
  if (0 <= t && t < length) {
    return samples[t];
  }
  return 0;
};

export const linear: ConvertFn = ({ originAudioBuffer, originSampleRate, resampleRate }) => {
  // rate 频率缩放因子
  const rate = originSampleRate / resampleRate;
  // 对于重采样音频每一个采样点，横坐标k与采样前的音频中对应的点的横坐标关系为 k * rate = nk，纵坐标关系为X[nk] = w1 * X[n+1] + W2 * x[n]
  // 音频通道数
  const channels = originAudioBuffer.numberOfChannels;
  // 创建空白audiobuffer
  const ctx = new AudioContext();
  // 重采样音频长度
  const resampleLength = originAudioBuffer.length / rate;
  //重采样音频的audioBuffer
  const resampleAudioBuffer = ctx.createBuffer(channels, resampleLength, resampleRate);
  for (let channel = 0; channel < channels; channel++) {
    //重采样单个通道的数据
    const float32Array = new Float32Array(resampleLength);
    for (let k = 0; k < resampleLength; k++) {
      const nk = k * rate;
      const n = Math.floor(nk);
      const w1 = nk - n;
      const w2 = 1 - w1;
      float32Array[k] =
        w1 * getClippedInput(n + 1, originAudioBuffer.getChannelData(channel), originAudioBuffer.length) +
        w2 * getClippedInput(n, originAudioBuffer.getChannelData(channel), originAudioBuffer.length);
    }
    resampleAudioBuffer.copyToChannel(float32Array, channel, 0);
  }
  return resampleAudioBuffer;
};

export const lagrange: ConvertFn = ({ originAudioBuffer, originSampleRate, resampleRate }) => {
  // rate 频率缩放因子
  const rate = originSampleRate / resampleRate;
  // 原音频通道数
  const channels = originAudioBuffer.numberOfChannels;
  // 重采样音频长度
  const resampleAudioLength = originAudioBuffer.length / rate;
  // 创建重采样音频AudioBuffer
  const ctx = new AudioContext();
  const resampleAudioBuffer = ctx.createBuffer(channels, resampleAudioLength, resampleRate);

  for (let channel = 0; channel < channels; channel++) {
    const float32Array = new Float32Array(resampleAudioLength);
    for (let k = 0; k < resampleAudioLength; k++) {
      const nk = k * rate;
      const n = Math.floor(nk);
      const w = 10;
      // 重采样权值 q
      const q = Array<number>(2 * w + 1).fill(1);
      // 选取窗口w值为10
      for (let i = -w; i <= w; i++) {
        for (let j = -w; j <= w; j++) {
          // if(j === i)
          if (j !== i) q[i + w] *= (nk - (n - j)) / (j - i);
        }
        float32Array[k] +=
          q[i + w] * getClippedInput(n - i, originAudioBuffer.getChannelData(channel), originAudioBuffer.length);
      }
    }
    resampleAudioBuffer.copyToChannel(float32Array, channel, 0);
  }
  return resampleAudioBuffer;
};

export const sine: ConvertFn = ({ originAudioBuffer, originSampleRate, resampleRate }) => {
  // rate 频率缩放因子
  const rate = originSampleRate / resampleRate;
  // 原音频通道数
  const channels = originAudioBuffer.numberOfChannels;
  // 重采样音频长度
  const resampleAudioLength = originAudioBuffer.length / rate;
  // 创建重采样音频AudioBuffer
  const ctx = new AudioContext();
  const resampleAudioBuffer = ctx.createBuffer(channels, resampleAudioLength, resampleRate);
  //设置窗口w为10
  const w = 10;
  // 权重值q
  const q = Array(2 * w + 1).fill(1);
  for (let channel = 0; channel < channels; channel++) {
    const float32Array = new Float32Array(resampleAudioLength);

    for (let k = 0; k < resampleAudioLength; k++) {
      const nk = k * rate;
      const n = Math.floor(nk);

      for (let i = -w; i <= w; i++) {
        if (i !== n - nk) q[i + w] = Math.sin(Math.PI * (nk - n + i)) / (Math.PI * (nk - n + i));
        float32Array[k] +=
          q[i + w] * getClippedInput(n - i, originAudioBuffer.getChannelData(channel), originAudioBuffer.length);
      }
    }
    resampleAudioBuffer.copyToChannel(float32Array, channel, 0);
  }
  return resampleAudioBuffer;
};
