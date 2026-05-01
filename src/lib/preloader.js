
const imageCache = {
  hero: [],
  about: [],
};

const status = {
  heroReady: false,
  aboutReady: false,
};

export const preloadAll = async (onProgress) => {
  const loadBatch = async (type, start, end, template) => {
    const promises = [];
    for (let i = start; i <= end; i++) {
      promises.push(new Promise((resolve) => {
        if (imageCache[type][i]) return resolve();
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = template.replace('{idx}', paddedIndex);
        img.onload = () => {
          imageCache[type][i] = img;
          resolve();
        };
        img.onerror = () => resolve();
      }));
    }
    return Promise.all(promises);
  };

  // Phase 1: Critical frames (First 40 frames of each)
  // This is enough to start the animation smoothly
  await Promise.all([
    loadBatch('hero', 1, 40, '/images/herosection-webp/ezgif-frame-{idx}.webp'),
    loadBatch('about', 1, 40, '/images/about/ezgif-frame-{idx}.png')
  ]);

  status.heroReady = true;
  status.aboutReady = true;

  // Phase 2: Background frames (The rest)
  // We don't await this so the loader can finish, but they keep loading in background
  loadBatch('hero', 41, 120, '/images/herosection-webp/ezgif-frame-{idx}.webp');
  loadBatch('about', 41, 240, '/images/about/ezgif-frame-{idx}.png');

  return true;
};

export const getCachedImage = (type, index) => {
  return imageCache[type][Math.round(index)];
};

export const isReady = () => status.heroReady && status.aboutReady;
