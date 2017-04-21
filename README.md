# click-heatmap
> Generate simple screenshots of a web pages with heat map overlay of recorded user clicks.


## Usage
```bash
click-heatmap http://localhost:3000 < data.json > final-image.png
```

Or if you have an analytics API:
```bash
curl -L http://localhost:3000/analytics/sessions/123 | click-heatmap http://localhost:3000 > final-image.png
```

## Install
```bash
yarn add --global click-heatmap
```

Requires **Cairo** for node-canvas to work. See [this document](https://github.com/Automattic/node-canvas/tree/v1.x) for installation.

Expects data from stdin in this JSON format:
```json
{
  "meta": {
    "innerWidth": "1680",
    "innerHeight": "1050"
  },
  "results": [
    [100, 100],
    [200, 200],
    [300, 300]
  ]
}
```

The program _does not_ record the actual clicks. That data must be provided from elsewhere.

## License
MIT
