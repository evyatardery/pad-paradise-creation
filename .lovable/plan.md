## Goal

Add 4 new pad designs to the catalog from the uploaded files: 3 images (Messi, Kobe, Real Madrid) plus one still frame extracted from the Spider-Man video.

## Assets

| Source | New asset | Title | Category | ID |
|---|---|---|---|---|
| `771166-2.jpg` | `sport-messi-yellow.jpg` | Messi Yellow | ספורט (`sport`) | `sport-2` |
| `1337519-2.png` | `sport-kobe-splash.jpg` | Kobe Splash | ספורט (`sport`) | `sport-3` |
| `770519.jpg` | `sport-real-madrid.jpg` | Real Madrid Crest | ספורט (`sport`) | `sport-4` |
| `spider-man-black-logo.1920x1080.mp4` | `game-spiderman-logo.jpg` | Spiderman Logo | גיימינג (`gaming`) | `game-8` |

## Steps

1. Extract a representative frame from the Spider-Man MP4 with ffmpeg (scan a few timestamps, pick the frame where the logo is fully rendered and best composed), save as JPG.
2. Convert/normalize the 3 uploaded images to JPG at their native 1920x1080, save all 4 into `src/assets/pads/`.
3. Register them in `src/data/catalog.ts`: add the 4 image imports and 4 entries in `padDesigns`. No `sourcePdf` — these have no vector source, so print generation falls back to the raster image.
4. Leave the `sport` category cover image as-is (still Messi Argentina).

## Technical notes

- All 4 files are 1920x1080, well below the print minimums (7087x3543 for L). They will display fine in the catalog and mockup but are not print-ready; you said you'll source high-res versions later — swapping them later only means replacing the file in `src/assets/pads/` with the same filename.
- The extracted video frame is the only lossy/derived asset; the original MP4 is not committed to the repo.
- Note: Messi, Kobe, Real Madrid and Spider-Man are trademarked/licensed imagery — selling printed products with them carries IP risk. Flagging it, not blocking it.
