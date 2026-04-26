import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.join(process.cwd(), 'public', 'images', 'herosection');
const outputDir = path.join(process.cwd(), 'public', 'images', 'herosection-webp');

async function optimizeImages() {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Read all files from the input directory
    const files = await fs.readdir(inputDir);
    const pngFiles = files.filter(f => f.endsWith('.png')).sort();

    console.log(`Found ${pngFiles.length} images. Reducing frame count by half...`);

    let outputIndex = 1;

    // Process every 2nd frame (to reduce 240 to 120)
    for (let i = 0; i < pngFiles.length; i += 2) {
      const file = pngFiles[i];
      const inputPath = path.join(inputDir, file);
      
      // We pad the new index to 3 digits like before
      const newFilename = `ezgif-frame-${outputIndex.toString().padStart(3, '0')}.webp`;
      const outputPath = path.join(outputDir, newFilename);

      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      console.log(`Processed ${file} -> ${newFilename}`);
      outputIndex++;
    }

    console.log(`✅ Successfully optimized ${outputIndex - 1} images!`);
  } catch (err) {
    console.error('Error optimizing images:', err);
  }
}

optimizeImages();
