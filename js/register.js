// 이미지 크기 검사
const fileInput = document.getElementById("input-image");
const selectedImage = document.getElementById("img");
const maxSizeInBytes = 4 * 1024 * 1024; // 4MB
let base64ImageData = null;

fileInput.addEventListener("change", (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
        const [imageFile] = selectedFiles;

        if (imageFile.size > maxSizeInBytes) {
            alert("이미지 크기는 4MB 이하이어야 합니다.");
            fileInput.value = "";
            return;
        }
        const fileReader = new FileReader();

        fileReader.onload = () => {
            const srcData = fileReader.result;
            selectedImage.src = srcData;

            base64ImageData = srcData.split(",")[1];
        };
        fileReader.readAsDataURL(imageFile);
    }
});