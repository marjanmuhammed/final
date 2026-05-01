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
  mobile: 640
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
      
      // Process only a subset of frames for mobile to save bandwidth/CPU if it's About section
      // For Hero we keep all for smoothness, or maybe skip every 2nd frame for mobile
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Skip frames on mobile to reduce load (e.g., every 2nd frame)
        if (sizeKey === 'mobile' && i % 2 !== 0) continue;

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
