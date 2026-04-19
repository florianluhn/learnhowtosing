<script>
  import { onMount } from 'svelte';
  
  let { currentMidi = null, targetMidi = null, targetRange = 0.5 } = $props();
  
  let canvas;
  let ctx;
  let frameId;
  
  const historySize = 300; 
  let history = new Array(historySize).fill(null);

  // dynamically adjust min/max based on target
  let minMidi = $derived(targetMidi ? targetMidi - 12 : 40);
  let maxMidi = $derived(targetMidi ? targetMidi + 12 : 80);

  onMount(() => {
    ctx = canvas.getContext('2d');
    
    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    
    const draw = () => {
      history.shift();
      history.push(currentMidi);
      
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      const getY = (midi) => {
        const range = maxMidi - minMidi;
        const normalized = (midi - minMidi) / range;
        return height - (normalized * height); 
      };

      if (targetMidi) {
        const targetY = getY(targetMidi);
        const topY = getY(targetMidi + targetRange);
        const bottomY = getY(targetMidi - targetRange);
        
        const zoneHeight = Math.abs(bottomY - topY);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, topY, width, zoneHeight);
        
        ctx.beginPath();
        ctx.moveTo(0, targetY);
        ctx.lineTo(width, targetY);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)'; // green dashed
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      let started = false;
      const stepX = width / historySize;
      
      for(let i = 0; i < historySize; i++) {
        const val = history[i];
        if (val !== null) {
          const x = i * stepX;
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        } else {
            started = false;
        }
      }
      
      let isMatch = false;
      if (currentMidi !== null && targetMidi !== null) {
         if (Math.abs(currentMidi - targetMidi) <= targetRange) isMatch = true; 
      }
      
      ctx.shadowBlur = 10;
      if (isMatch) {
         ctx.strokeStyle = '#10b981'; // Green glowing
         ctx.shadowColor = '#10b981';
      } else {
         ctx.strokeStyle = '#3b82f6'; // Blue glowing
         ctx.shadowColor = '#3b82f6';
      }
      
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
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

<div class="canvas-container">
  <canvas bind:this={canvas} class="pitch-canvas"></canvas>
</div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    background: var(--color-bg-dark);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
  }
  .pitch-canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
