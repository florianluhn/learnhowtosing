<script>
  import { onMount } from 'svelte';
  
  let { currentMidi = null, targetNotes = [], currentTime = 0, isPlaying = false } = $props();

  let canvas;
  let ctx;
  let frameId;
  let pitchHistory = [];
  
  const windowBefore = 1.0; 
  const windowAfter = 4.0;
  
  let minTarget = $derived(targetNotes.length > 0 ? Math.min(...targetNotes.map(n => n.midi)) - 5 : 40);
  let maxTarget = $derived(targetNotes.length > 0 ? Math.max(...targetNotes.map(n => n.midi)) + 5 : 80);

  onMount(() => {
    ctx = canvas.getContext('2d');
    
    const resize = () => {
      if(!canvas) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    
    const roundRect = (ctx, x, y, width, height, radius) => {
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, width, height, radius);
      } else {
        ctx.rect(x, y, width, height); 
      }
    };

    const draw = () => {
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;
      const timeWindow = windowBefore + windowAfter;
      
      if (isPlaying) {
         pitchHistory.push({ time: currentTime, midi: currentMidi });
         pitchHistory = pitchHistory.filter(h => h.time >= currentTime - windowBefore - 0.5);
      } else {
         pitchHistory = [];
      }
      
      ctx.clearRect(0, 0, width, height);

      const getY = (midi) => {
        const range = maxTarget - minTarget;
        const normalized = (midi - minTarget) / Math.max(range, 1);
        return height - (normalized * height); 
      };

      const getX = (time) => {
        const offset = time - (currentTime - windowBefore);
        return (offset / timeWindow) * width;
      };

      for(const note of targetNotes) {
        const endT = note.time + note.duration;
        if (endT < currentTime - windowBefore || note.time > currentTime + windowAfter) continue;
        
        const xStart = Math.max(0, getX(note.time));
        const xEnd = Math.min(width, getX(endT));
        const yCenter = getY(note.midi);
        const barHeight = Math.max(15, height / Math.max(maxTarget - minTarget, 1) * 0.7);
        const drawY = yCenter - (barHeight / 2);
        
        let isHit = false;
        if (currentTime >= note.time && currentTime <= endT) {
           if (currentMidi !== null && Math.abs(currentMidi - note.midi) <= 1.0) {
              isHit = true;
           }
        }

        ctx.fillStyle = isHit ? 'rgba(16, 185, 129, 0.8)' : 'rgba(139, 92, 246, 0.4)';
        
        ctx.beginPath();
        roundRect(ctx, xStart, drawY, Math.max(xEnd - xStart, 5), barHeight, 5);
        ctx.fill();
      }

      const playheadX = getX(currentTime);
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      let started = false;
      for (const h of pitchHistory) {
         if (h.midi !== null) {
            const hx = getX(h.time);
            const hy = getY(h.midi);
            if (!started) {
               ctx.moveTo(hx, hy);
               started = true;
            } else {
               ctx.lineTo(hx, hy);
            }
         } else {
            started = false;
         }
      }
      
      ctx.strokeStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.shadowBlur = 0;

      frameId = requestAnimationFrame(draw);
    };
    
    frameId = requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  });
</script>

<div class="canvas-container glass">
  <canvas bind:this={canvas} class="song-canvas"></canvas>
</div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
  }
  .song-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
