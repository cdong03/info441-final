"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Sets up event listeners for website's buttons.
   */
  function init() {
    id('upload_art').addEventListener('submit', (evt) => {
      evt.preventDefault();
      uploadArt();
    });
  }

  function uploadArt() {
    let params = new FormData(id('upload_art'));
    params.append('username', userID);
    fetch('/arts/post', {method: 'POST', body: params})
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        id('display').innerHTML = '';
        for (let i = 0; i < res.length; i++) {
          id('display').appendChild(genArt(res.cars[i]));
        }
      })
      .catch(handleError);
  }

  /**
   * Generates an art post.
   * @param {Promise} info - Art information.
   * @returns {Object} - The displayed art.
   */
  function genArt(info) {
    let art = gen('div');
    art.classList.add('art');
    let title = gen('h2');
    title.textContent = info.title;
    art.appendChild(heading);
    let user = gen('p');
    user.textContent = info.username;
    art.appendChild(user);
    let img = gen('img');
    img.src = info.imgUrl;
    img.alt = info.alt;
    art.appendChild(img);
    let commentBtn = gen('button');
    commentBtn.textContent = 'Show/hide comments';
    commentBtn.addEventListener('click', () => {
      toggleComments(info.id);
    });
    art.appendChild(commentBtn);
    return art;
  }

  /**
   * Shows/hides comments for the given art.
   * @param {string} artID - ID of the given artwork.
   */
  function toggleComments(artID) {
    // Need to review how they did this in websharer
  }

  /**
   * Shows an error message.
   * @param {Promise} res - Given error message.
   */
  function handleError(res) {
    console.log('Error: ' + res);
  }

  /**
   * Checks the status of the fetch request.
   * @param {Promise} res - Given Promise.
   * @returns {Promise} Given Promise.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
}
)();