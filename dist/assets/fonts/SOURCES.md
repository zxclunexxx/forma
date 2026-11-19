# Font sources

These font binaries are redistributed unchanged under SIL Open Font License 1.1. The repository filenames were shortened for convenient CSS URLs; no font data or internal names were modified.

## Mona Sans

- Local file: `mona-sans-variable.woff2`
- Official project: https://github.com/github/mona-sans
- Pinned commit: `4bc6ba8b354c36b4fb66d32cd67b4c1f2beb0a06`
- Original file: `fonts/webfonts/variable/MonaSansVF[wdth,opsz,wght].woff2`
- Download: https://raw.githubusercontent.com/github/mona-sans/4bc6ba8b354c36b4fb66d32cd67b4c1f2beb0a06/fonts/webfonts/variable/MonaSansVF%5Bwdth%2Copsz%2Cwght%5D.woff2
- License: `MonaSans-OFL.txt`
- Variable axes: weight 200-900; width 75-125%; optical size 0-100.
- Cyrillic: absent. The matching official variable TTF from the same commit was checked in memory with a small SFNT cmap parser: none of the 66 Russian uppercase/lowercase letters are covered.

## Manrope

- Local file: `manrope-variable.ttf`
- Official Google Fonts source: https://github.com/google/fonts/tree/main/ofl/manrope
- Pinned commit: `b31870aff700ab7a1d74fa0c6887d95beb9e0037`
- Original file: `ofl/manrope/Manrope[wght].ttf`
- Download: https://raw.githubusercontent.com/google/fonts/b31870aff700ab7a1d74fa0c6887d95beb9e0037/ofl/manrope/Manrope%5Bwght%5D.ttf
- License: `Manrope-OFL.txt`
- Variable axis: weight 200-800.
- Cyrillic: all 66 Russian uppercase/lowercase letters are covered in the downloaded TTF's cmap.

## Suggested use

Use Mona Sans first and Manrope as the Cyrillic fallback to retain the Latin typography of the Dribbble reference. Use Manrope alone for longer Russian passages if mixed-script rhythm needs to stay completely uniform.

```css
@font-face {
  font-family: 'Mona Sans';
  src: url('./assets/fonts/mona-sans-variable.woff2') format('woff2');
  font-style: normal;
  font-weight: 200 900;
  font-stretch: 75% 125%;
  font-display: swap;
}

@font-face {
  font-family: 'Manrope';
  src: url('./assets/fonts/manrope-variable.ttf') format('truetype');
  font-style: normal;
  font-weight: 200 800;
  font-display: swap;
}

body {
  font-family: 'Mona Sans', 'Manrope', system-ui, sans-serif;
  font-optical-sizing: auto;
}
```
