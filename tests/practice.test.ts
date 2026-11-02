import { describe, expect, it } from "vitest";
import { analyzeWav } from "../src/practice.js";

function makeWav(segments: { sec: number; tone: boolean }[], sampleRate = 8000): Buffer {
  const totalSamples = Math.floor(segments.reduce((a, s) => a + s.sec, 0) * sampleRate);
  const data = Buffer.alloc(totalSamples * 2);
  let i = 0;
  for (const seg of segments) {
    const n = Math.floor(seg.sec * sampleRate);
    for (let j = 0; j < n && i < totalSamples; j++, i++) {
      const v = seg.tone ? Math.floor(8000 * Math.sin((2 * Math.PI * 440 * (i / sampleRate)))) : 0;
      data.writeInt16LE(v, i * 2);
    }
  }
  const head = Buffer.alloc(44);
  head.write("RIFF", 0);
  head.writeUInt32LE(36 + data.length, 4);
  head.write("WAVE", 8);
  head.write("fmt ", 12);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20);
  head.writeUInt16LE(1, 22);
  head.writeUInt32LE(sampleRate, 24);
  head.writeUInt32LE(sampleRate * 2, 28);
  head.writeUInt16LE(2, 32);
  head.writeUInt16LE(16, 34);
  head.write("data", 36);
  head.writeUInt32LE(data.length, 40);
  return Buffer.concat([head, data]);
}

describe("WAV energy/VAD supplement (T3)", () => {
  it("detects pauses in synthetic audio", () => {
    const wav = makeWav([{ sec: 0.5, tone: true }, { sec: 0.5, tone: false }, { sec: 1.0, tone: true }]);
    const m = analyzeWav(wav);
    expect(m.analyzed).toBe(true);
    expect(m.durationSec).toBeCloseTo(2.0, 1);
    expect(m.pauseCount).toBeGreaterThanOrEqual(1);
    expect(m.speechEnergy).toBeGreaterThan(0);
  });

  it("rejects non-WAV input honestly", () => {
    expect(() => analyzeWav(Buffer.from("not audio"))).toThrow();
  });
});
