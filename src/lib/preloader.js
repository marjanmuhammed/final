
const imageCache = {
  hero: [],
  about: [],
};

const preloadingStatus = {
  hero: false,
  about: false,
  totalHero: 120,
  totalAbout: 240,
  loadedHero: 0,
  loadedAbout: 0,
};

export const preloadImages = (onProgress) => {
  if (preloadingStatus.hero && preloadingStatus.about) return;

  const loadSet = async (type, total, pathTemplate) => {
    // Phase 1: Load critical frames (first 10 frames)
    const criticalFrames = 10;
    for (let i = 1; i <= Math.min(total, criticalFrames); i++) {
      await loadSingleImage(type, i, pathTemplate);
    }

    // Phase 2: Load the rest asynchronously
    for (let i = criticalFrames + 1; i <= total; i++) {
      loadSingleImage(type, i, pathTemplate);
    }

    preloadingStatus[type] = true;
  };

  const loadSingleImage = (type, i, pathTemplate) => {
    return new Promise((resolve) => {
      if (imageCache[type][i]) return resolve();

      const img = new Image();
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = pathTemplate.replace('{idx}', paddedIndex);

      img.onload = () => {
        imageCache[type][i] = img;
        preloadingStatus[`loaded${type.charAt(0).toUpperCase() + type.slice(1)}`]++;
        if (onProgress) {
          onProgress({
            type,
            current: preloadingStatus[`loaded${type.charAt(0).toUpperCase() + type.slice(1)}`],
            total: preloadingStatus[`total${type.charAt(0).toUpperCase() + type.slice(1)}`],
          });
        }
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load ${type} frame ${i}`);
        resolve();
      };
    });
  };

  if (!preloadingStatus.hero) {
    loadSet('hero', preloadingStatus.totalHero, '/images/herosection-webp/ezgif-frame-{idx}.webp');
  }

  if (!preloadingStatus.about) {
    loadSet('about', preloadingStatus.totalAbout, '/images/about/ezgif-frame-{idx}.png');
  }
};

export const getCachedImage = (type, index) => {
  return imageCache[type][index];
};

export const isPreloaded = (type) => {
  if (type) return preloadingStatus[type];
  return preloadingStatus.hero && preloadingStatus.about;
};
