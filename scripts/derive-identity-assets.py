from PIL import Image
from pathlib import Path
import numpy as np, cv2, json
folder=Path('docs/awwwards/evidence-narrative/electric-identity')
records=[]
for name in ['vinz','react','typescript','tailwind','motion','gsap']:
 a=np.array(Image.open(folder/(name+'-original-raster.png')).convert('RGBA'))
 alpha=a[:,:,3]
 if np.mean(alpha<250) <= .01:
  border=np.concatenate([a[0,:,:3],a[-1,:,:3],a[:,0,:3],a[:,-1,:3]])
  diff=np.abs(a[:,:,:3].astype(float)-border.mean(axis=0)).max(axis=2)
  alpha=np.clip((diff-24)/48*255,0,255).astype('uint8')
 y,x=np.where(alpha>2); bounds=[int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)]
 l,t,r,b=bounds; mask=alpha[t:b,l:r]
 rgba=np.full((*mask.shape,4),255,dtype='uint8'); rgba[:,:,3]=mask
 Image.fromarray(rgba).save(Path('public/awwwards/identity')/(name+'.png'))
 records.append({'id':name,'bounds':bounds,'size':[r-l,b-t],'method':'Chrome SVG raster at 810px; source alpha or owner border difference coverage; tight crop without stretching'})
 if name=='vinz':
  binary=(mask>=128).astype('uint8')*255
  contours,hierarchy=cv2.findContours(binary,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
  paths=[]; pointlists=[]
  for c in contours:
   if cv2.contourArea(c)<4: continue
   points=cv2.approxPolyDP(c,.45,True).reshape(-1,2)
   paths.append('M'+' L'.join(f'{x},{y}' for x,y in points)+' Z'); pointlists.append(points.tolist())
  w,h=r-l,b-t
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path fill="white" fill-rule="evenodd" d="'+ ' '.join(paths)+'"/></svg>'
  Path('public/awwwards/identity/vinz-contours.svg').write_text(svg)
  Path('public/awwwards/identity/vinz-contours.json').write_text(json.dumps({'width':w,'height':h,'contours':pointlists}))
  derived=np.zeros_like(binary); cv2.drawContours(derived,[np.array(p,dtype='int32').reshape(-1,1,2) for p in pointlists],-1,255,cv2.FILLED)
  iou=float(np.sum((binary>0)&(derived>0))/np.sum((binary>0)|(derived>0)))
  overlay=np.zeros((*binary.shape,3),dtype='uint8');overlay[:,:,1]=binary;overlay[:,:,2]=derived
  Image.fromarray(overlay).save(folder/'vinz-vector-overlay.png')
  records[-1].update({'contours':len(pointlists),'vertices':sum(map(len,pointlists)),'binaryIntersectionOverUnion':iou,'traceTolerancePixels':.45})
(folder/'asset-derivation.json').write_text(json.dumps(records,indent=2))
print(json.dumps(records,indent=2))
