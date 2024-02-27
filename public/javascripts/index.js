//show preview of the art when user enters a url for their art.
function previewURL() {
  var urlInput = document.getElementById("art_url").value;
  var preview = document.getElementById("art_preview");
  var fileInput = document.getElementById("art_file");

  //clear the file input value when a url is entered (users can only pick one or the other)
  if (urlInput && urlInput.trim() !== "") {
    fileInput.value = "";
  }

  preview.src = urlInput;
  preview.style.display = "block";
}

//show preview of the art when a user chooses a local file of their art
function previewFile() {
  var fileInput = document.getElementById('art_file');
  var artPreview = document.getElementById('art_preview');
  var urlInput = document.getElementById("art_url");

  //clear the url input when a user has a file selected (users can only pick one or the other)
  if (fileInput.files && fileInput.files[0]) {
    urlInput.value = "";
  }

  if (fileInput.files && fileInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
    artPreview.src = e.target.result;
    artPreview.style.display = 'block';
    }
    reader.readAsDataURL(fileInput.files[0]);

  } else {
    artPreview.src = "";
    artPreview.style.display = 'none';
  }
}

"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Sets up event listeners for website's buttons.
   */
  async function init() {
    id('upload_art').addEventListener('submit', (evt) => {
      evt.preventDefault();
      uploadArt();
    });
    loadArts();
    await loadIdentity();
  }

  async function uploadArt() {
    let artUrl = id('art_url').value;
    let artTitle = id('art_title').value;
    let artAlt = id('art_alt').value;
    //let artFile = id('art_file');
    await fetchJSON(
      `/api/${apiVersion}/arts/`,
      {
        method: 'POST',
        body: {
          art_url: artUrl,
          art_title: artTitle,
          art_alt: artAlt,
          //art_file: artFile
        }
      })
  }

  async function loadArts(){
    id('display').innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/arts`);

    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
        <h2>${postInfo.title}</h2>
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <img src="${postInfo.imgUrl}" alt="${postInfo.alt}" />
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp;
                    <span class="heart-button-span ${myIdentity? "": "d-none"}">
                        ${postInfo.likes && postInfo.likes.includes(myIdentity) ?
                            `<button class="heart_button" onclick='unlikePost("${postInfo.id}")'>&#x2665;</button>` :
                            `<button class="heart_button" onclick='likePost("${postInfo.id}")'>&#x2661;</button>`}
                    </span>
                </div>
                <br>
                <button onclick='toggleComments("${postInfo.id}")'>View/Hide comments</button>
                <div id='comments-box-${postInfo.id}' class="comments-box d-none">
                    <button onclick='refreshComments("${postInfo.id}")')>refresh comments</button>
                    <div id='comments-${postInfo.id}'></div>
                    <div class="new-comment-box ${myIdentity? "": "d-none"}">
                        New Comment:
                        <textarea type="textbox" id="new-comment-${postInfo.id}"></textarea>
                        <button onclick='postComment("${postInfo.id}")'>Post Comment</button>
                    </div>
                </div>
            </div>
        </div>`
    }).join("\n");
    id('display').innerHTML = postsHtml;
  }

  /**
   * Generates an art post.
   * @param {Promise} info - Art information.
   * @returns {Object} - The displayed art.
   */
  // function genArt(info) {
  //   let art = gen('div');
  //   art.classList.add('art');
  //   let title = gen('h2');
  //   title.textContent = info.title;
  //   art.appendChild(title);
  //   let user = gen('p');
  //   user.textContent = info.username;
  //   art.appendChild(user);
  //   let img = gen('img');
  //   img.src = info.imgUrl;
  //   img.alt = info.alt;
  //   art.appendChild(img);
  //   let commentBtn = gen('button');
  //   commentBtn.textContent = 'Show/hide comments';
  //   commentBtn.addEventListener('click', () => {
  //     toggleComments(info.id);
  //   });
  //   art.appendChild(commentBtn);
  //   return art;
  // }

  /**
   * Shows/hides comments for the given art.
   * @param {string} artID - ID of the given artwork.
   */
  function toggleComments(artID) {
    // Don't know if necessary
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