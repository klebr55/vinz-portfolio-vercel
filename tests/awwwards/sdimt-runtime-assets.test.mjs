import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { sdimtRuntimeFramePath } from '../../components/awwwards/chapters/sdimt-sequence-model.ts';

test('cropped playback preserves provenance, alpha and every useful source frame', async () => {
  const root=new URL('../../public/awwwards/sdimt/',import.meta.url);
  const manifest=JSON.parse(await readFile(new URL('motion-runtime/manifest.json',root),'utf8'));
  assert.equal(manifest.frames.length,241);
  for(const frame of manifest.frames){
    const filename=`frame_${String(frame.index).padStart(6,'0')}.webp`;
    const source=await readFile(new URL(`motion-sdimt/${filename}`,root));
    const runtime=await readFile(new URL(`motion-runtime/${filename}`,root));
    assert.equal(createHash('sha256').update(source).digest('hex'),frame.sourceSha256);
    assert.equal(createHash('sha256').update(runtime).digest('hex'),frame.derivedSha256);
    assert.ok(sdimtRuntimeFramePath(frame.index).endsWith(filename));
  }
  for(const index of [1,120,241]){
    const filename=`frame_${String(index).padStart(6,'0')}.webp`;
    const metadata=await sharp(await readFile(new URL(`motion-runtime/${filename}`,root))).metadata();
    assert.equal(metadata.hasAlpha,true);assert.equal(metadata.width,1200);assert.equal(metadata.height,1215);
  }
  assert.equal(sdimtRuntimeFramePath(422),sdimtRuntimeFramePath(241));
});
