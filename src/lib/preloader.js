const imageCache = {
  hero: [],
  about: [],
};

const status = {
  heroReady: false,
  aboutReady: false,
};

const getDeviceSize = () => {
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1200) return 'tablet';
  return 'desktop';
};

const deviceSize = getDeviceSize();

export const preloadAll = async () => {
  const loadBatch = async (type, start, end, template, step = 1) => {
    const promises = [];
    for (let i = start; i <= end; i += step) {
      promises.push(new Promise((resolve) => {
        if (imageCache[type][i]) return resolve();
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = template.replace('{idx}', paddedIndex);
        
        // Use Decode API if available for smoother loading
        img.onload = () => {
          if ('decode' in img) {
            img.decode()
              .then(() => {
                imageCache[type][i] = img;
                resolve();
              })
              .catch(() => {
                imageCache[type][i] = img;
                resolve();
              });
          } else {
            imageCache[type][i] = img;
            resolve();
          }
        };
        img.onerror = () => resolve();
      }));
    }
    return Promise.all(promises);
  };

  const heroTemplate = `/images/hero_optimized/${deviceSize}/ezgif-frame-{idx}.webp`;
  const aboutTemplate = `/images/about_optimized/${deviceSize}/ezgif-frame-{idx}.webp`;
  
  // mobile: step 2 (smoother than 3, loads 1/2 of frames)
  // tablet/desktop: step 1 (full quality)
  const step = deviceSize === 'mobile' ? 2 : 1;

  // Phase 1: ONLY Critical Hero frames first
  await loadBatch('hero', 1, 60, heroTemplate, step);
  status.heroReady = true;

  // Phase 2: Rest of Hero and Start of About in background
  Promise.all([
    loadBatch('hero', 61, 120, heroTemplate, step),
    loadBatch('about', 1, 60, aboutTemplate, step)
  ]).then(() => {
    status.aboutReady = true;
    // Phase 3: Rest of About
    loadBatch('about', 61, 240, aboutTemplate, step);
  });

  return true;
};

export const getCachedImage = (type, index) => {
  const idx = Math.round(index);
  if (imageCache[type][idx]) return imageCache[type][idx];
  
  // Fallback to nearest neighbor if frame is missing (important for skipped frames on mobile)
  for (let offset = 1; offset < 10; offset++) {
    if (imageCache[type][idx - offset]) return imageCache[type][idx - offset];
    if (imageCache[type][idx + offset]) return imageCache[type][idx + offset];
  }
  return null;
};

export const isReady = () => status.heroReady;

