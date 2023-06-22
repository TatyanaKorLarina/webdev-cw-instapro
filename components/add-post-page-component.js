import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { uploadImage } from "../api.js";



export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    
    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container">
            <div class="upload=image">
              ${imageUrl ? ` <div class="file-upload-image-container">
                <img class="file-upload-input" src="${imageUrl}">
                <button class="file-upload-remove-button button">Заменить фото</button>
              </div> 
            ` : ' <label class="file-upload-label secondary-button"> <input type="file" class="file-upload-input" style="display:none" /> Выберите фото </label>'}
            </div>
            <label>
              Опишите фотографию:
              <textarea class="input textarea" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>`;

    appEl.innerHTML = appHtml;
    renderHeaderComponent({
      element: document.querySelector('.header-container')
    });
    renderUploadImageComponent({
      element: appEl.querySelector(".file-upload-input"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      }
    });

    const fileInput = document.querySelector(".file-upload-input");
    fileInput?.addEventListener("change", (() => {
      const file = fileInput.files[0];
      if (file) {
        const fileLabel = document.querySelector(".file-upload-label");
        fileLabel.setAttribute("disabled", !0),
          fileLabel.textContent = "Загружаю файл...",
          uploadImage({ file })
            .then((responseData) => {
              imageUrl = responseData.fileUrl,
              render();
            }
            )
      }
    }
    )),
      document.querySelector(".file-upload-remove-button")?.addEventListener("click", (() => {
        imageUrl = "",
          render()
      }
      ))
    
    document.getElementById("add-button").addEventListener("click", () => {
      const textareaElement = document.querySelector('.textarea');

      if (!imageUrl) {
        alert('Нет фото');
        return;
      }

      if (!textareaElement.value.trim()) {
        alert('Нет описания');
        return;
      }
      onAddPostClick({
        description: textareaElement.value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;"),
        imageUrl: imageUrl
      });
    });
  };

  render();
}
