import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, renderApp, getToken } from "../index.js";
import { putDislike, putLike } from "../api.js";
import { formatDistance } from "date-fns";
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  const postsHtml = posts.map((post) => {
    const createDate = formatDistance(new Date(post.createdAt), Date.now(), { locale: ru });
    return `<li class="post">
    <div class="post-header" data-user-id="${post.user.id}">
      <img src="${post.user.imageUrl}" class="post-header__user-image">
      <p class="post-header__user-name">${post.user.name}</p>
    </div>
    <div class="post-image-container">
      <img class="post-image" src="${post.imageUrl}">
    </div>
    <div class="post-likes">
      <button class="like-button" data-post-id="${post.id}">
        <img src="${
          post.isLiked 
            ? './assets/images/like-active.svg' 
            : './assets/images/like-not-active.svg'
        }">
      </button>
      <p class="post-likes-text">
        Нравится: <strong>${post.likes.length > 0 ? post.likes[post.likes.length - 1].name : '0'
      }</strong> ${
        post.likes.length > 1 ? `и <strong>еще ${
          post.likes.length - 1
        }</strong>` : ''
      }
      </p>
    </div>
    <p class="post-text">
      <span class="user-name">${post.user.name}</span>
      ${post.description}
    </p>
    <p class="post-date">
        ${createDate} назад
    </p>
  </li>`;
}).join('');
  
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
 // initLikeButtonListeners();
  for (let userElement of document.querySelectorAll(".post-header")) {
    userElement.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userElement.dataset.userId,
      });
    });
  };

  document.querySelectorAll('.like-button').forEach((likeElement, index) => {   
    
          likeElement.addEventListener ("click", () => {
            
    if (posts[index].isLiked) {
      putDislike({
        token: getToken(),
        id: posts[index].id
      }).then(newLike => {
        posts.splice(index, 1, newLike);
    
        renderApp();
      }).catch(error => alert(error.message));
    } else {
      putLike({
        token: getToken(),
        id: posts[index].id
      }).then(newLike => {
        posts.splice(index, 1, newLike);
    
        renderApp();
      }).catch(error => alert(error.message));
    }
    });
    
      });
}


