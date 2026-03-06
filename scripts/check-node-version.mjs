const minimumMajor = 20;
const current = process.versions.node;
const major = Number.parseInt(current.split('.')[0], 10);

if (Number.isNaN(major) || major < minimumMajor) {
  console.error(
    `\n❌ Node.js ${minimumMajor}+ requis. Version détectée: ${current}.\n` +
      '👉 Installez/sélectionnez Node 20 (ex: `nvm use`) puis relancez `npm ci`.\n',
  );
  process.exit(1);
}
