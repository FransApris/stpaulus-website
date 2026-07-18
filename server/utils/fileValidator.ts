// server/utils/fileValidator.ts

/**
 * Memvalidasi apakah buffer file merupakan gambar yang valid dengan memeriksa
 * Magic Bytes (File Signature) dari header file.
 * Mengembalikan ekstensi file yang aman.
 */
export const validateAndGetImageExtension = (buffer: Buffer | Uint8Array | ArrayBuffer): string => {
  if (!buffer || (buffer as any).length < 12 && !(buffer instanceof ArrayBuffer && buffer.byteLength < 12)) {
    throw new Error('File is too small or empty')
  }

  // Konversi ke Buffer agar seragam
  const buf = Buffer.isBuffer(buffer) 
    ? buffer 
    : Buffer.from(buffer instanceof ArrayBuffer ? buffer : buffer.buffer || buffer)

  if (buf.length < 12) {
      throw new Error('File is too small to be a valid image')
  }

  // JPEG: FF D8 FF
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
    return 'jpg'
  }
  
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 && 
      buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A) {
    return 'png'
  }

  // GIF: 47 49 46 38 37 61 (GIF87a) or 47 49 46 38 39 61 (GIF89a)
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38 &&
      (buf[4] === 0x37 || buf[4] === 0x39) && buf[5] === 0x61) {
    return 'gif'
  }

  // WebP: RIFF .... WEBP
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
    return 'webp'
  }

  throw new Error('Invalid file type detected. File rejected for security reasons.')
}
