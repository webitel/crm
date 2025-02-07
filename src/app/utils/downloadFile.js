const downloadFile = ({ id, name, type, url }) => {
  const a = document.createElement('a');
  const token = localStorage.getItem('access-token');

  if (url) {
    a.href = url;
  } else {
    let link = `${import.meta.env.VITE_API_URL}/storage/file/${id}/download?access_token=${token}`;

    if (type.includes('source')) {
      const source = type.match(/source=[^;]+/)[0];
      link = `${link}&${source}`;
    }
    a.href = link;
  }

  a.target = '_blank';
  a.download = name;
  a.click();
};

export default downloadFile;
