const getImageBase64Data = image => {
  const flag = `data:${image.contentType};base64,`;
  const imgString = arrayBufferToBase64(image.data.data);

  return flag + imgString;
};

const arrayBufferToBase64 = buffer => {
  let binary = '';
  let bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach(b => (binary += String.fromCharCode(b)));

  return window.btoa(binary);
};

export default getImageBase64Data;
