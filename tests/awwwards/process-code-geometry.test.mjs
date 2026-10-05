import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Shape, Path, Vector2 } from 'three';
import { createProcessCodeGeometry } from '../../components/awwwards/identity/process-code-geometry.ts';

const square=(x,y,size=20)=>new Shape([[x,y],[x+size,y],[x+size,y+size],[x,y+size]].map(p=>new Vector2(...p)));
test('19 original paths retain groups, colors, physical edges and shared coordinates',()=>{
 const original=readFileSync('docs/awwwards/reference-sources/process-business/code.owner.svg');
 const copy=readFileSync('public/awwwards/process/code.svg');
 assert.equal(createHash('sha256').update(copy).digest('hex'),'efb3feb28ea735b51e143b56f873f2090d016777f31644d2e419a4ab67811dcb');
 assert.deepEqual(copy,original);
 const tags=original.toString().match(/<path\b[^>]*>/g);
 assert.equal(tags.length,19);
 const parts=tags.map((tag,i)=>({sourcePathIndex:i,color:tag.match(/fill="([^"]+)"/)[1],shapes:[square(50+i*30,-200)]}));
 parts[0].shapes.push(square(0,-100));
 parts[1].shapes[0].holes.push(new Path(square(85,-195,5).getPoints()));
 const result=createProcessCodeGeometry(parts);
 assert.equal(result.parts.length,19);
 const keys=array=>Array.from({length:array.length/6},(_,i)=>[array.slice(i*6,i*6+3),array.slice(i*6+3,i*6+6)].map(p=>p.map(v=>Math.round(v*1e5)).join(':')).sort().join('|')).sort();
 for(const part of result.parts){
  const source=parts[part.sourcePathIndex];
  assert.equal(part.color,source.color);
  assert.deepEqual(keys(Array.from(part.edges.getAttribute('position').array)),keys(part.sourcePositions));
  assert.ok(Number.isFinite(part.wireLength)&&part.wireLength>0);
  assert.ok(part.endDistance>part.startDistance);
  const expected=part.sourcePathIndex<=10?'foundation':[11,12,17].includes(part.sourcePathIndex)?'windows':part.sourcePathIndex===18?'content':'code';
  assert.equal(part.groupId,expected);
 }
 const x=result.parts[2].geometry.boundingBox.min.x;
 assert.ok(Math.abs(x-(110-512)*4/1024)<1e-6,'individual centering destroys alignment');
 for(const group of ['foundation','windows','content','code']){
  const members=result.parts.filter(p=>p.groupId===group);
  assert.equal(members[0].startDistance,0);
  for(let i=1;i<members.length;i++)assert.equal(members[i].startDistance,members[i-1].endDistance);
  assert.equal(result.groupLengths[group],members.at(-1).endDistance);
 }
 result.dispose();
});
