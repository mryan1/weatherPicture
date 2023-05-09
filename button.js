
window.onload = async () => {

    // Add event listeners to the buttons
    document.getElementById('loadButton').addEventListener('click', () => {
        window.loadNewPicture.loadNewPicture();
    });
    document.getElementById('exitButton').addEventListener('click', () => {
        window.exit.exit();
    });

};
