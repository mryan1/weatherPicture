window.onload = async () => {
    // create the loading message element
    const loadingMessage = document.createElement('div');
    loadingMessage.innerText = 'Loading...';
    document.body.appendChild(loadingMessage);

    // create the image element and hide it
    const imgElement = document.createElement('img');
    imgElement.style.display = 'none';
    document.body.appendChild(imgElement);

    // generate the first image and show it
    const weatherImage = await window.stability.generateImage();
    const base64ImageData = weatherImage.artifacts[0].base64;
    imgElement.src = 'data:image/png;base64,' + base64ImageData;
    imgElement.onload = () => {
        // hide the loading message and show the image once it has finished loading
        loadingMessage.style.display = 'none';
        imgElement.style.display = 'block';
    };

    // generate a new image every hour
    setInterval(async () => {
        const weatherImage = await window.stability.generateImage();
        const base64ImageData = weatherImage.artifacts[0].base64;
        imgElement.src = 'data:image/png;base64,' + base64ImageData;
    },  3600000);
};
