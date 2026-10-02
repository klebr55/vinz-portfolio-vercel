from PIL import Image
from pathlib import Path
import numpy as np, cv2, json, hashlib
folder=Path('docs/awwwards/evidence-narrative/identity-rhythm')
a=np.array(Image.open(folder/'vinz-process-original.png').convert('RGBA'))
alpha=a[:,:,3]
if np.mean(alpha<250)<.01:
 border=np.concatenate([a[0,:,:3],a[-1,:,:3],a[:,0,:3],a[:,-1,:3]])
 diff=np.abs(a[:,:,:3].astype(float)-border.mean(axis=0)).max(axis=2)
 alpha=np.clip((diff-24)/48*255,0,255).astype('uint8')
y,x=np.where(alpha>2);l,t,r,b=int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)
binary=(alpha[t:b,l:r]>=128).astype('uint8')*255
contours,_=cv2.findContours(binary,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
points=[cv2.approxPolyDP(c,.45,True).reshape(-1,2) for c in contours if cv2.contourArea(c)>=4]
paths=['M'+' L'.join(f'{x},{y}' for x,y in ps)+' Z' for ps in points]
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {r-l} {b-t}"><path fill="white" fill-rule="evenodd" d="'+' '.join(paths)+'"/></svg>'
Path('public/awwwards/identity/vinz-process-contours.svg').write_text(svg,encoding='utf-8')
derived=np.zeros_like(binary);cv2.drawContours(derived,[p.reshape(-1,1,2) for p in points],-1,255,cv2.FILLED)
overlay=np.zeros((*binary.shape,3),dtype='uint8');overlay[:,:,1]=binary;overlay[:,:,2]=derived
Image.fromarray(overlay).save(folder/'vinz-process-overlay.png')
report={'source':'docs/awwwards/reference-sources/identity-review-2026-10-02/vinz-alt.owner.svg','sha256':hashlib.sha256(Path('docs/awwwards/reference-sources/identity-review-2026-10-02/vinz-alt.owner.svg').read_bytes()).hexdigest(),'bounds':[l,t,r,b],'contours':len(points),'vertices':sum(map(len,points)),'tolerancePixels':.45,'iou':float(np.sum((binary>0)&(derived>0))/np.sum((binary>0)|(derived>0))),'method':'Chrome composite SVG raster, source alpha or owner border-difference coverage, OpenCV evenodd contours; no stretch'}
(folder/'process-derivation.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(report)
