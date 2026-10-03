from pathlib import Path
from PIL import Image
import cv2, numpy as np, json, hashlib

folder = Path('docs/awwwards/evidence-narrative/process-draw-worker')
folder.mkdir(parents=True, exist_ok=True)
source = Path('docs/awwwards/evidence-narrative/identity-rhythm/vinz-process-original.png')
alpha = np.array(Image.open(source).convert('RGBA'))[:, :, 3]
y, x = np.where(alpha > 2)
l, t, r, b = int(x.min()), int(y.min()), int(x.max() + 1), int(y.max() + 1)
binary = (alpha[t:b, l:r] >= 128).astype('uint8') * 255
contours, _ = cv2.findContours(binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours = [c for c in contours if cv2.contourArea(c) >= 4]
points = [cv2.approxPolyDP(c, 1, True) for c in contours]
assert len(points) == 5 and all(len(p) >= 3 for p in points)
paths = ['M' + ' L'.join(f'{x},{y}' for x, y in p.reshape(-1, 2)) + ' Z' for p in points]
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {r-l} {b-t}"><path fill="white" fill-rule="evenodd" d="' + ' '.join(paths) + '"/></svg>\n'
Path('public/awwwards/identity/vinz-process-contours.svg').write_text(svg, encoding='utf-8')
derived = np.zeros_like(binary)
cv2.drawContours(derived, points, -1, 255, cv2.FILLED)
overlay = np.zeros((*binary.shape, 3), dtype='uint8')
overlay[:, :, 1] = binary; overlay[:, :, 2] = derived
Image.fromarray(overlay).save(folder / 'normalization-overlay.png')
Image.fromarray(binary).save(folder / 'owner-coverage.png')
Image.fromarray(derived).save(folder / 'normalized-coverage.png')
rgba = np.full((*derived.shape, 4), 255, dtype=np.uint8); rgba[:, :, 3] = derived
Image.fromarray(rgba).save('public/awwwards/identity/vinz-process-static.png')
report = {'source': 'docs/awwwards/reference-sources/identity-review-2026-10-02/vinz-alt.owner.svg', 'sourceSha256': hashlib.sha256(Path('docs/awwwards/reference-sources/identity-review-2026-10-02/vinz-alt.owner.svg').read_bytes()).hexdigest(), 'rasterSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'bounds': [l,t,r,b], 'contours': len(points), 'vertices': [len(p) for p in points], 'tolerancePixels': 1, 'iou': float(np.sum((binary>0)&(derived>0))/np.sum((binary>0)|(derived>0))), 'maxSourceVertexToNormalizedContourPixels': max(abs(cv2.pointPolygonTest(p,(float(x),float(y)),True)) for c,p in zip(contours,points) for x,y in c.reshape(-1,2)), 'contourAreas': [{'source': cv2.contourArea(c), 'normalized': cv2.contourArea(p)} for c,p in zip(contours,points)], 'method': 'Existing owner composite raster; alpha coverage, closed OpenCV approxPolyDP 1px, evenodd fill; all five contours retained, including four-vertex hole'}
(folder / 'normalization.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps(report))
