/* eslint-disable import/prefer-default-export */
import fs from 'fs-extra';

export async function copyDirectory(source: string, destination: string) {
  try {
    await fs.copy(source, destination);
    console.log('Les fichiers ont été copiés avec succès.');
  } catch (err) {
    console.error(
      "Une erreur s'est produite lors de la copie des fichiers :",
      err,
    );
  }
}
