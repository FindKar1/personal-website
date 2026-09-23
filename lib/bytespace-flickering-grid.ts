// Adapted from Bytespace's magicui/flickering-grid.tsx and signup settings.
export const flickeringGridSettings = { squareSize: 4, gridGap: 1, flickerChance: 0.3, maxOpacity: 0.2 };

export function createFlickeringGrid(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const { squareSize, gridGap, flickerChance, maxOpacity } = flickeringGridSettings;
  let columns = 0;
  let rows = 0;
  let dpr = 1;
  let squares = new Float32Array(0);
  let frame = 0;
  let lastTime: number | undefined;
  let running = false;
  let destroyed = false;

  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        context.fillStyle = `rgba(255, 255, 255, ${squares[column * rows + row]})`;
        context.fillRect(column * (squareSize + gridGap) * dpr, row * (squareSize + gridGap) * dpr,
          squareSize * dpr, squareSize * dpr);
      }
    }
  };
  const resize = () => {
    if (destroyed) return;
    const { width, height } = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    columns = Math.ceil(width / (squareSize + gridGap));
    rows = Math.ceil(height / (squareSize + gridGap));
    squares = Float32Array.from({ length: columns * rows }, () => Math.random() * maxOpacity);
    draw();
  };
  const animate = (time: number) => {
    if (!running || destroyed) return;
    const deltaTime = lastTime === undefined ? 0 : Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    for (let index = 0; index < squares.length; index++) {
      if (Math.random() < flickerChance * deltaTime) squares[index] = Math.random() * maxOpacity;
    }
    draw();
    frame = requestAnimationFrame(animate);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  return {
    setRunning(value: boolean) {
      if (destroyed || running === value) return;
      running = value;
      lastTime = undefined;
      if (running) frame = requestAnimationFrame(animate);
      else cancelAnimationFrame(frame);
    },
    destroy() {
      destroyed = true;
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    },
  };
}
