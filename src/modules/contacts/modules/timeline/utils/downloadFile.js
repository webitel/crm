const  downloadFile = ({ id, name }) => {
  const a = document.createElement('a');
  const token = localStorage.getItem('access-token');
  a.href = `${import.meta.env.VITE_API_URL}/storage/file/${id}/download?access_token=${token}`;
  a.target = '_blank';
  a.download = name;
  a.click();
}

export default downloadFile;
