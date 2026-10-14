import fs from "fs";
import path from "path";
import zlib from "zlib";

function createSolidColorPng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 2;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdr = makeChunk("IHDR", ihdrData);

  const rowLength = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowLength);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      
      const cx = width / 2;
      const cy = height / 2;
      const dx = (x - cx) / (width * 0.44);
      const dy = (y - cy) / (height * 0.44);
      const isInside = (dx * dx + dy * dy) <= 1;

      if (isInside) {
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
      } else {
        rawData[pixelOffset] = 15;
        rawData[pixelOffset + 1] = 23;
        rawData[pixelOffset + 2] = 42;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk("IDAT", compressedData);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(body), 0);

  return Buffer.concat([len, body, crcBuf]);
}

const publicDir = path.join(process.cwd(), "public");

const icon192 = createSolidColorPng(192, 192, 5, 150, 105);
const icon512 = createSolidColorPng(512, 512, 5, 150, 105);

fs.writeFileSync(path.join(publicDir, "icon-192.png"), icon192);
fs.writeFileSync(path.join(publicDir, "icon-512.png"), icon512);
fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), icon192);

console.log("Ikon PWA resmi berhasil dibuat: icon-192.png, icon-512.png, apple-touch-icon.png");
