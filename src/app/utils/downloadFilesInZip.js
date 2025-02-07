import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export default async function downloadFilesInZip({ selected, apiUrl, token }) {
  if (!selected?.length) return;

  const zip = new JSZip();

  const filePromises = selected.map(async (item) => {
    const { id, name } = item;
    const fileUrl = `${apiUrl}/storage/file/${id}/download?access_token=${token}`;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to download ${name}`);

      const blob = await response.blob();
      zip.file(name, blob, { binary: true });
    } catch (error) {
      throw new Error(`Failed to download ${name}`, error);
    }
  });

  await Promise.all(filePromises);

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'files.zip');
  } catch (error) {
    throw new Error('Failed to create ZIP file', error);
  }
}
