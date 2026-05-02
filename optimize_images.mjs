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
  mobile: 640,
  tablet: 1024,
  desktop: 1920
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
      // Balanced quality for clarity vs file size
      const quality = sizeKey === 'mobile' ? 75 : (sizeKey === 'tablet' ? 80 : 85);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const inputPath = path.join(settings.src, file);
        const outputFileName = file.replace(settings.ext, '.webp');
        const outputPath = path.join(destDir, outputFileName);

        if (true) { // Force overwrite for clarity update
          await sharp(inputPath)
            .resize(width)
            .webp({ 
              quality: quality, 
              effort: 6, 
              smartSubsample: true,
              lossless: false,
              alphaQuality: 80
            })
            .toFile(outputPath);
        }
      }
      console.log(`Finished ${sizeKey} for ${key}`);
    }
  }
}

processImages().catch(console.error);
