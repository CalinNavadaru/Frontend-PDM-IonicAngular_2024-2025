const fs = require('fs');
const path = require('path');

const manifestPath = path.join(
  __dirname,
  '../android/app/src/main/AndroidManifest.xml'
);

fs.readFile(manifestPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Eroare la citirea AndroidManifest.xml:', err);
    return;
  }

  if (data.includes('android.permission.ACCESS_NETWORK_STATE')) {
    console.log('Permisiunile sunt deja adăugate.');
    return;
  }

  const updatedManifest = data.replace(
    '</manifest>',
    `
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>`
  );

  fs.writeFile(manifestPath, updatedManifest, 'utf8', err => {
    if (err) {
      console.error('Eroare la scrierea AndroidManifest.xml:', err);
    } else {
      console.log('Permisiunile au fost adăugate cu succes!');
    }
  });
});
