const esbuild = require('esbuild');
const path = require('path');

async function build() {
  console.log('Building Antigravity bundle...');
  try {
    const result = await esbuild.build({
      entryPoints: [path.join(__dirname, 'components', 'Antigravity', 'mount.jsx')],
      bundle: true,
      minify: true,
      sourcemap: false,
      format: 'esm',
      target: ['es2020'],
      outfile: path.join(__dirname, 'assets', 'antigravity.bundle.js'),
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      loader: {
        '.jsx': 'jsx',
        '.js': 'jsx'
      }
    });

    console.log('✓ Antigravity bundle built successfully: assets/antigravity.bundle.js');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
