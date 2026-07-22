const { Jimp } = require('jimp');
const path = require('path');

async function processLogo() {
  const inputPath = 'C:\\Users\\pavan\\.gemini\\antigravity\\brain\\2568d009-8b73-4b5e-9e01-76e032837c4e\\media__1784624248136.jpg';
  const outputPathBackend = 'c:\\Users\\pavan\\Downloads\\ADISHAKTI APP\\apps\\backend\\public\\logo_transparent.png';
  const outputPathMobile = 'c:\\Users\\pavan\\Downloads\\ADISHAKTI APP\\apps\\mobile\\assets\\logo_transparent.png';

  console.log('Reading image from:', inputPath);
  const image = await Jimp.read(inputPath);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // If pixel is white or off-white background
    if (r > 225 && g > 225 && b > 225) {
      this.bitmap.data[idx + 3] = 0; // Transparent
    }
  });

  await image.write(outputPathBackend);
  await image.write(outputPathMobile);
  console.log('Successfully created transparent logo at:', outputPathBackend);
}

processLogo().catch(console.error);
