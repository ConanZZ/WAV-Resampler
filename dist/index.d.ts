declare type ResampleParams = {
    originSampleRate: number;
    resampleRate: number;
    originAudioBuffer: AudioBuffer;
};
declare type Resampler = ResampleParams & {
    fn: MethodType;
};
declare enum MethodType {
    Linear = "linear",
    Lagrange = "lagrange",
    Sine = "sine"
}
declare const playInterpolationAudio: ({ fn, originAudioBuffer, originSampleRate, resampleRate }: Resampler) => void;
declare const resampleWavAudio: ({ fn, originAudioBuffer, originSampleRate, resampleRate }: Resampler) => AudioBuffer;
declare const analyseWavAudio: (arrayBuffer: ArrayBuffer) => {
    bitPerSample: number;
    sampleRate: number;
};
export { analyseWavAudio, resampleWavAudio, playInterpolationAudio };
