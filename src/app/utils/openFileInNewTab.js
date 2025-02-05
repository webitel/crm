export default async function openFileInNewTab (item) {
  if (!item?.id) return;

  try {
    const token = localStorage.getItem('access-token');
    const url = `${import.meta.env.VITE_API_URL}/storage/file/${item.id}/download?access_token=${token}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);

    // Open in a new tab
    window.open(fileURL, '_blank');
  } catch (error) {
    console.error('Error opening file:', error);
  }
};
