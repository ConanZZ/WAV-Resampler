import { linear, lagrange, sine, ResampleParams } from './resampleMethod';

type Resampler = ResampleParams & {
  fn: MethodParams;
};

export type MethodParams = 'linear' | 'lagrange' | 'sine';

const getConvertFn = (fn: MethodParams) => {
  let convertFn;

  switch (fn) {
    case 'lagrange':
      convertFn = lagrange;
      break;
    case 'linear':
      convertFn = linear;
      break;
    case 'sine':
      convertFn = sine;
      break;
  }

  return convertFn;
};

const playInterpolationAudio = ({ fn, originAudioBuffer, originSampleRate, resampleRate }: Resampler) => {
  const convertFn = getConvertFn(fn);
  const resampleAudioBuffer = convertFn({ originAudioBuffer, originSampleRate, resampleRate });
  const audioCtx = new AudioContext();
  const source = audioCtx.createBufferSource();
  source.buffer = resampleAudioBuffer;
  source.connect(audioCtx.destination);
  source.start();
};

const resampleWavAudio = ({ fn, originAudioBuffer, originSampleRate, resampleRate }: Resampler) => {
  const convertFn = getConvertFn(fn);
  const resampleAudioBuffer = convertFn({ originAudioBuffer, originSampleRate, resampleRate });
  return resampleAudioBuffer;
};

const analyseWavAudio = (arrayBuffer: ArrayBuffer) => {
  let intArr = new Int8Array(arrayBuffer),
    bitPerSampleArr = intArr.slice(34, 36),
    bitPerSample = (bitPerSampleArr[0] & 0xff) | ((bitPerSampleArr[1] & 0xff) << 8),
    sampleRateArr = intArr.slice(24, 28),
    sampleRate =
      (sampleRateArr[0] & 0xff) |
      ((sampleRateArr[1] & 0xff) << 8) |
      ((sampleRateArr[2] & 0xff) << 16) |
      ((sampleRateArr[3] & 0xff) << 24);
  return {
    bitPerSample,
    sampleRate,
  };
};

export { analyseWavAudio, resampleWavAudio, playInterpolationAudio };
