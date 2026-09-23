import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Helper CRC32 for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const crcData = Buffer.alloc(4 + len);
  crcData.write(type, 0);
  data.copy(crcData, 4);
  const crc = crc32(crcData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

const width = 1200;
const height = 630;

// Create raw uncompressed pixel buffer with scanline filter bytes
const rowSize = 1 + width * 4;
const rawBuffer = Buffer.alloc(rowSize * height);

for (let y = 0; y < height; y++) {
  const rowOffset = y * rowSize;
  rawBuffer[rowOffset] = 0; // Filter 0 (None)

  for (let x = 0; x < width; x++) {
    const pxOffset = rowOffset + 1 + x * 4;

    // Linear gradient background from top-left (navy #0F2B48) to bottom-right (teal-emerald #147A60)
    const factorX = x / width;
    const factorY = y / height;
    const factor = (factorX * 0.7 + factorY * 0.3);

    let r = Math.round(15 + factor * 8);
    let g = Math.round(50 + factor * 85);
    let b = Math.round(95 + factor * 30);

    // Decorative inner card area (rounded feel)
    const cardMarginX = 60;
    const cardMarginY = 50;
    if (
      x >= cardMarginX &&
      x <= width - cardMarginX &&
      y >= cardMarginY &&
      y <= height - cardMarginY
    ) {
      // Glow border effect
      const distBorder = Math.min(
        x - cardMarginX,
        width - cardMarginX - x,
        y - cardMarginY,
        height - cardMarginY - y
      );

      if (distBorder < 4) {
        // Glowing cyan border
        r = Math.min(255, r + 70);
        g = Math.min(255, g + 130);
        b = Math.min(255, b + 150);
      } else {
        // Deep sleek translucent container
        r = Math.round(r * 0.85 + 20);
        g = Math.round(g * 0.85 + 35);
        b = Math.round(b * 0.85 + 50);
      }
    }

    // Top pill badge "STRUKKU • KHUSUS MAHASISWA" area (y between 100-145, x between 100-380)
    if (x >= 100 && x <= 380 && y >= 100 && y <= 145) {
      r = 30;
      g = 140;
      b = 100;
    }

    // Receipt Logo Mockup Icon at (x: 1000, y: 180, radius: 100)
    const dx = x - 980;
    const dy = y - 260;
    if (dx * dx + dy * dy < 110 * 110) {
      r = Math.min(255, r + 45);
      g = Math.min(255, g + 90);
      b = Math.min(255, b + 120);
    }

    rawBuffer[pxOffset] = r;
    rawBuffer[pxOffset + 1] = g;
    rawBuffer[pxOffset + 2] = b;
    rawBuffer[pxOffset + 3] = 255;
  }
}

// Compress with zlib
const compressedData = zlib.deflateSync(rawBuffer, { level: 9 });

// Build PNG
const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// IHDR
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData[8] = 8; // Bit depth
ihdrData[9] = 6; // Color type (RGBA)
ihdrData[10] = 0; // Compression
ihdrData[11] = 0; // Filter
ihdrData[12] = 0; // Interlace
const ihdrChunk = makeChunk('IHDR', ihdrData);

// IDAT
const idatChunk = makeChunk('IDAT', compressedData);

// IEND
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const finalPng = Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);

const outPath = path.resolve('public/og-image.png');
fs.writeFileSync(outPath, finalPng);
console.log('og-image.png generated successfully at:', outPath, 'Size:', finalPng.length, 'bytes');
