
window.onload = async () => {

    // create the loading message element
    const loadingMessage = document.createElement('div');
    loadingMessage.innerText = 'Loading...';
    document.body.appendChild(loadingMessage);

    // create the image element and hide it
    const imgElement = document.createElement('img');
    imgElement.style.display = 'none';
    document.body.appendChild(imgElement);

    let clickedOnce = true;
    imgElement.addEventListener('click', () => {
        if (clickedOnce) {
            clickedOnce = false;
            window.showMenu.showMenu();
        } else {
            clickedOnce = true;
            window.hideMenu.hideMenu();
        }
    });

    // generate the first image and show it
    async function updateImage() {

        const weatherImage = await window.stability.generateImage();
        const base64ImageData = weatherImage.artifacts[0].base64;
        imgElement.src = 'data:image/png;base64,' + base64ImageData;

    };
    updateImage();

    imgElement.onload = () => {
        // hide the loading message and show the image once it has finished loading
        loadingMessage.style.display = 'none';
        imgElement.style.display = 'block';
    };

    // generate a new image every hour
    setInterval(async () => {
        updateImage();
    }, 3600000); // 60000

    window.electronAPI.onLoadNewPicture((_event, value) => {
        updateImage();
    })


};
