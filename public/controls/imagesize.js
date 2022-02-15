const cropImage = function (inputDataURI, width) {
    return new Promise((resolve, reject) => {
      if (inputDataURI.slice(0, 10) !== "data:image") {
        reject(new Error("Not an image."));
      }
      const c = document.createElement("canvas");
      c.width = c.height = width || 100;
      const ctx = c.getContext("2d");
      const i = document.createElement("img");
      i.addEventListener("load", function () {
        ctx.drawImage(i, ...getWidthHeight(i, width));
        resolve(c.toDataURL("image/jpeg", 0.8));
      });
      i.src = inputDataURI;
    });
  };

  const getWidthHeight = function (img, side) {
    const { width, height } = img;
    if (width === height) {
      return [0, 0, side, side];
    } else if (width < height) {
      const rat = height / width;
      const top = (side * rat - side) / 2;
      return [0, -1 * top, side, side * rat];
    } else {
      const rat = width / height;
      const left = (side * rat - side) / 2;
      return [-1 * left, 0, side * rat, side];
    }
  };

export default cropImage