import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const CONFIG = {
  hero: {
    src: './public/images/herosection-webp',
    dest: './public/images/hero_optimized',
    ext: '.webp'
  },
  about: {
    src: './public/images/about',
    dest: './public/images/about_optimized',
    ext: '.png'
  }
};

const SIZES = {
  desktop: 1920,
  tablet: 1024,
  mobile: 900
};

async function processImages() {
  for (const [key, settings] of Object.entries(CONFIG)) {
    const files = fs.readdirSync(settings.src).filter(f => f.endsWith(settings.ext));
    console.log(`Processing ${files.length} images for ${key}...`);

    for (const sizeKey of Object.keys(SIZES)) {
      const destDir = path.join(settings.dest, sizeKey);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const width = SIZES[sizeKey];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const inputPath = path.join(settings.src, file);
        const outputFileName = file.replace(settings.ext, '.webp');
        const outputPath = path.join(destDir, outputFileName);

        if (!fs.existsSync(outputPath)) {
          await sharp(inputPath)
            .resize(width)
            .webp({ quality: 75, effort: 6 })
            .toFile(outputPath);
        }
      }
      console.log(`Finished ${sizeKey} for ${key}`);
    }
  }
}

processImages().catch(console.error);
