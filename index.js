#!/usr/bin/env node

const fs = require('fs');
const Nightmare = require('nightmare');
const simpleheat = require('simpleheat');
const getStdin = require('get-stdin');
const Canvas = require('canvas');
const meow = require('meow');
const { Image } = Canvas;

const nightmare = Nightmare({ show: false });

const cli = meow(`
  Usage: click-heatmap http://localhost:3000 < data.json > image.png

  Options
    --px-ratio 2
`);

const jsonError = message => {
  console.error(`Invalid JSON format: ${message}`);
  process.exit(1);
};

const url = cli.input[0];
const pxRatio = cli.flags.pxRatio || 2;

if (!url) {
  cli.showHelp();
}

getStdin().then(data => {
  if (!data) {
    return cli.showHelp();
  }

  let json;
  try {
    json = JSON.parse(data);
  } catch (err) {
    return jsonError('Could not parse');
  }

  if (!json.meta || !json.results) {
    return jsonError('Missing `meta` or `results` keys.');
  }

  const meta = json.meta;
  const points = json.results.map(p => [p[0] * pxRatio, p[1] * pxRatio]);

  const width = meta.innerWidth;
  const height = meta.innerHeight;

  const canvas = new Canvas(width * pxRatio, height * pxRatio);
  const ctx = canvas.getContext('2d');

  nightmare
    .goto(url)
    .viewport(width, height)
    .wait(2000)
    .screenshot()
    .end()
    .then(screenshot => {
      img = new Image();
      img.src = screenshot;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const heatCanvas = new Canvas(width * pxRatio, height * pxRatio);
      const heat = simpleheat(heatCanvas);
      heat.data(points);
      heat.radius(20, 25);
      heat.draw();

      ctx.drawImage(heatCanvas, 0, 0, heatCanvas.width, heatCanvas.height);
      process.stdout.write(canvas.toBuffer());
    });
});
