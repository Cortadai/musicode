interface AnalyserNode {
  getFloatFrequencyData(array: Float32Array): void;
  getByteFrequencyData(array: Uint8Array): void;
  getFloatTimeDomainData(array: Float32Array): void;
  getByteTimeDomainData(array: Uint8Array): void;
}
