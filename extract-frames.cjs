/**
 * extract-frames.cjs
 * 
 * Extracts individual WebP frames from benz1.mp4 using ffmpeg-static + sharp.
 * Strategy: ffmpeg → PNG frames → sharp → WebP (avoids animated WebP bug)
 *
 * Output:
 *   public/frames/desktop/frame_001.webp  (240 frames, 1280px wide, quality 75)
 *   public/frames/mobile/frame_001.webp   (120 frames,  640px wide, quality 65)
 */

const { execSync } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const INPUT = path.join(__dirname, "public", "loading", "benz1.mp4");

const CONFIGS = [
  { name: "desktop", frames: 240, width: 1280, quality: 75 },
  { name: "mobile",  frames: 120, width: 640,  quality: 65 },
];

// ── Get video duration ──────────────────────────────────────────────────────
function getDuration() {
  try {
    const out = execSync(`"${ffmpegPath}" -i "${INPUT}" 2>&1`, { encoding: "utf8" });
    const m = out.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    if (m) return parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseFloat(m[3]);
  } catch (e) {
    const out = (e.stderr || e.stdout || e.message || "").toString();
    const m = out.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    if (m) return parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseFloat(m[3]);
  }
  throw new Error("Cannot determine video duration");
}

// ── Extract frames for a config ─────────────────────────────────────────────
async function extractConfig(config, duration) {
  const outDir = path.join(__dirname, "public", "frames", config.name);
  const tmpDir = path.join(__dirname, "public", "frames", `_tmp_${config.name}`);
  
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const fps = config.frames / duration;
  
  console.log(`\n[${config.name}] Extracting ${config.frames} frames at ${fps.toFixed(2)} fps`);
  console.log(`  Resolution: ${config.width}px | Quality: ${config.quality}`);

  // Step 1: Extract PNG frames with ffmpeg (individual files guaranteed)
  const cmd = `"${ffmpegPath}" -i "${INPUT}" -vf "fps=${fps},scale=${config.width}:-2:flags=lanczos" -vframes ${config.frames} -f image2 "${path.join(tmpDir, "frame_%03d.png")}" -y`;
  
  console.log("  → Extracting PNGs...");
  execSync(cmd, { stdio: "pipe" });

  // Step 2: Convert each PNG → WebP with sharp (individual still images)
  const pngs = fs.readdirSync(tmpDir).filter(f => f.endsWith(".png")).sort();
  console.log(`  → Converting ${pngs.length} PNGs to WebP...`);

  for (let i = 0; i < pngs.length; i++) {
    const pngPath = path.join(tmpDir, pngs[i]);
    const webpName = `frame_${String(i + 1).padStart(3, "0")}.webp`;
    const webpPath = path.join(outDir, webpName);

    await sharp(pngPath)
      .webp({ quality: config.quality, effort: 4 })
      .toFile(webpPath);

    if ((i + 1) % 20 === 0 || i === pngs.length - 1) {
      process.stdout.write(`\r  → ${i + 1}/${pngs.length} converted`);
    }
  }

  // Step 3: Clean up temp PNGs
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log(`\n  ✓ ${config.name}: ${pngs.length} WebP frames ready`);
  return pngs.length;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  Frame Extractor — benz1.mp4 → WebP      ");
  console.log("═══════════════════════════════════════════");

  if (!fs.existsSync(INPUT)) {
    console.error(`ERROR: File not found: ${INPUT}`);
    process.exit(1);
  }

  const duration = getDuration();
  console.log(`Video: ${duration.toFixed(2)}s`);

  const counts = {};
  for (const config of CONFIGS) {
    counts[config.name] = await extractConfig(config, duration);
  }

  // Write manifest
  const manifest = {
    desktop: { count: counts.desktop, width: CONFIGS[0].width },
    mobile:  { count: counts.mobile,  width: CONFIGS[1].width },
    generated: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(__dirname, "public", "frames", "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n═══════════════════════════════════════════");
  console.log("  ✅ All done!");
  console.log(`  Desktop: ${counts.desktop} frames @ ${CONFIGS[0].width}px`);
  console.log(`  Mobile:  ${counts.mobile} frames @ ${CONFIGS[1].width}px`);
  console.log("═══════════════════════════════════════════");
}

main().catch(err => { console.error("FAILED:", err.message); process.exit(1); });
