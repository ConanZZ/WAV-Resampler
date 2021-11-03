import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { analyseWavAudio, playInterpolationAudio, MethodParams } from '../../src/index';
import './index.less';

const Resampler = () => {
  const [originAudioBuffer, setOriginAudioBuffer] = useState(0);

  const beforeVoiceUpload = file => {
    const reader = new FileReader();
    reader.onload = event => onReaderOnload(event);
    reader.readAsArrayBuffer(file);
    return false;
  };

  const onReaderOnload = event => {
    const arraybuf = event.target.result;

    // 输出采样率和采样深度
    const { bitPerSample, sampleRate } = analyseWavAudio(arraybuf);

    // AudioContext()有一个参数AudioContextOptions，其中可以指定sampleRate（在硬件支持的采样率范围内），如果未指定，则默认使用上下文输出设备的首选采样率
    const ctx = new AudioContext({ sampleRate });
    //将arraybuffer解码为音频片段audiobuffer
    console.log(bitPerSample, sampleRate);
    ctx.decodeAudioData(arraybuf).then(function (decodedData) {
      //getChannelData得到的是float32Array
      setOriginAudioBuffer(decodedData);
    });
  };

  const upSampling = (fn: MethodParams) =>
    playInterpolationAudio({
      fn,
      originAudioBuffer,
      originSampleRate: 48000,
      resampleRate: 8000,
    });

  const subSampling = (fn: MethodParams) =>
    playInterpolationAudio({
      fn,
      originAudioBuffer,
      originSampleRate: 48000,
      resampleRate: 96000,
    });

  return (
    <div className="wrapper">
      <div className="upload">
        <Upload name="file" beforeUpload={beforeVoiceUpload} showUploadList={false} accept={'.wav'}>
          <Button type="primary" size="large">
            上 传
          </Button>
        </Upload>
      </div>
      <div className="btn-group">
        <span>下采样</span>
        <Button type="primary" size="large" onClick={() => upSampling('linear')} className={'btn'}>
          线性插值
        </Button>
        <Button type="primary" size="large" onClick={() => upSampling('lagrange')} className={'btn'}>
          拉格朗日插值
        </Button>
        <Button type="primary" size="large" onClick={() => upSampling('sine')} className={'btn'}>
          正弦插值
        </Button>
      </div>
      <div className="btn-group">
        <span>上采样</span>
        <Button type="primary" size="large" onClick={() => subSampling('linear')} className={'btn'}>
          线性插值
        </Button>
        <Button type="primary" size="large" onClick={() => subSampling('lagrange')} className={'btn'}>
          拉格朗日插值
        </Button>
        <Button type="primary" size="large" onClick={() => subSampling('sine')} className={'btn'}>
          正弦插值
        </Button>
      </div>
    </div>
  );
};

export default Resampler;
