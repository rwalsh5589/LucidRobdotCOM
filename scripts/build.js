#!/usr/bin/env node
console.log('=== Generating OG preview images ===');
require('./generate-og-images.js');
console.log('\n=== Generating blog pages + sitemap ===');
require('./generate-posts.js');
console.log('\nAll assets rebuilt.');
