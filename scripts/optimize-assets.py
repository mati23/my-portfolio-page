"""Regenerate bundled assets from repository root; see docs/frontend-evolution.md."""
from pathlib import Path
from PIL import Image
from fontTools.ttLib import TTFont
import json
public=Path('frontend/public');assets={}
for path in sorted((public/'resources/books').glob('*/my-book.png')):
 im=Image.open(path); assets[str(path.relative_to(public/'resources').with_suffix(''))]={'width':im.width,'height':im.height}
 for width in [800,1600]:
  copy=im.copy();copy.thumbnail((width,10000));copy.save(path.with_name(f'my-book-{width}.webp'),quality=88,method=6)
for path in sorted((public/'resources/books').glob('*/thumbnail.jpg')):
 im=Image.open(path);im.thumbnail((320,320));im.save(path.with_suffix('.webp'),quality=90,method=6)
for year in ['2019','2020','2021']:
 for path in sorted((public/f'resources/backgrounds/{year}').glob('*.jpg')):
  im=Image.open(path)
  key=str(path.relative_to(public/'resources').with_suffix(''))
  source=path
  # Convert only disguised PNGs. Keep JPEG decoding unchanged: palette quantization
  # is sensitive to pixel differences between JPEG decoders, even after lossless export.
  if im.format == 'PNG':
   source=path.with_suffix('.webp')
   im.save(source,lossless=True,method=6,exact=True,icc_profile=im.info.get('icc_profile',b''))
  elif path.with_suffix('.webp').exists():
   path.with_suffix('.webp').unlink()
  assets[key]={'width':im.width,'height':im.height,'src':'/'+str(source.relative_to(public))}
im=Image.open(public/'ps2-screen.png');im.save(public/'ps2-screen.webp',quality=90,method=6)
Path('frontend/src/content/assets.json').write_text(json.dumps(assets,indent=2)+'\n')
fonts={
 'Display':'Rajdhani/Rajdhani-SemiBold.ttf',
 'Editorial':'Playfair_Display/static/PlayfairDisplay-Italic.ttf',
 'BebasRegular':'Bebas_Neue/BebasNeue-Regular.ttf',
 'YanoneSemiBold':'Yanone_Kaffeesatz/static/YanoneKaffeesatz-SemiBold.ttf',
 'YanoneRegular':'Yanone_Kaffeesatz/static/YanoneKaffeesatz-Regular.ttf',
}
css=[]
for name,src in fonts.items():
 font=TTFont(Path('frontend/src/resources/fonts')/src);font.flavor='woff2';font.save(Path('frontend/src/assets/fonts')/(name+'.woff2'))
 css.append(f'@font-face {{ font-family: "{name}"; src: url("./assets/fonts/{name}.woff2") format("woff2"); font-display: swap; }}')
Path('frontend/src/fonts.css').write_text('\n'.join(css)+'\n')
