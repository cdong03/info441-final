//show preview of the art when user enters a url for their art.
function previewURL() {
  var urlInput = document.getElementById("art_url").value;
  var preview = document.getElementById("art_preview");
  var fileInput = document.getElementById("art_file");

  /*clear the file input value when a url is entered (users can only pick one or the other)
  if (urlInput && urlInput.trim() !== "") {
    fileInput.value = "";
  }*/

  preview.src = urlInput;
  preview.style.display = "block";
}

/*show preview of the art when a user chooses a local file of their art
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
}*/

async function likePost(artID){
  await fetchJSON(`api/${apiVersion}/arts/like`, {
      method: "POST",
      body: {artID: artID}
  })
  loadArts();
}


async function unlikePost(artID){
  await fetchJSON(`api/${apiVersion}/arts/unlike`, {
      method: "POST",
      body: {artID: artID}
  })
  loadArts();
}




//"use strict";
//(function() {

  window.addEventListener("load", init);

  /**
   * Sets up event listeners for website's buttons.
   */
  async function init() {
    id('upload_art').addEventListener('submit', (evt) => {
      evt.preventDefault();
      uploadArt();
    });
    id('create_gallery').addEventListener('submit', (evt) => {
      evt.preventDefault();
      createGallery();
    });
    loadArts();
    loadGalleries();
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

    id('art_url').value = '';
    id('art_title').value = '';
    id('art_alt').value = '';
    id('art_preview').src = '';
    loadArts();
  }

  async function createGallery() {
    let galleryTitle = id('gallery_title').value;
    await fetchJSON(
      `/api/${apiVersion}/galleries/`,
      {
        method: 'POST',
        body: {
          title: galleryTitle
        }
      })
      loadGalleries();
  }

  async function loadArts(){
    id('display').innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/arts`);

    displayArts(postsJson);
  }

  async function loadGallArts(gall){
    id('display').innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/arts/gallery?gallery=` + gall);

    displayArts(postsJson);
  }

  async function displayArts(postsJson) {
    let postsHtml = postsJson.map(postInfo => {
      return `
      <div class="post">
      <h2>${postInfo.title}</h2>
          <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${postInfo.created_date}</div>
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
                  <button onclick='refreshComments("${postInfo.id}")')>Show comments</button>
                  <div id='comments-${postInfo.id}'></div>
                  <div class="new-comment-box ${myIdentity? "": "d-none"}">
                  <br></br>
                  <div class="new-comment-line">New Comment: </div>
                      <textarea type="textbox" id="new-comment-${postInfo.id}"></textarea>
                      <button onclick='postComment("${postInfo.id}")'>Post Comment</button>
                  </div>
              </div>
          </div>
      </div>`
  }).join("\n");
  id('display').innerHTML = postsHtml;
  }

  async function loadGalleries() {
    id('galleries').innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/galleries`);

    let postsHtml = postsJson.map(postInfo => {
      let users = postInfo.users;
      users = users.join(', ');
      if (postInfo.userPartOf) {
        return `
        <div class="post">
        <h2>${postInfo.title}</h2>
            <div>${users}</div>
            <button onclick='loadGallArts("${postInfo.title}")')>Show images below</button>
            <p>Art Name:</p>
            <input name="art-${postInfo.id}" id="art-${postInfo.id}" maxlength="20">
            <p>Art Username:</p>
            <input name="artuser-${postInfo.id}" id="artuser-${postInfo.id}" maxlength="20">
            <button onclick='addArtGallery("${postInfo.id}")')>Add art</button>
            <p>Username:</p>
            <input name="user-${postInfo.id}" id="user-${postInfo.id}">
            <button onclick='addUserGallery("${postInfo.id}")')>Add user</button>
            <button onclick='deleteGallery("${postInfo.id}")')>Delete gallery</button>
        </div>`
      } else {
        return `
        <div class="post">
        <h2>${postInfo.title}</h2>
            <div>${users}, ${postInfo.created_date}</div>
            <button onclick='loadGallArts("${postInfo.title}")')>Show images below</button>
        </div>`
      }
  }).join("\n");
  id('galleries').innerHTML = postsHtml;
  }

  async function addArtGallery(gallID) {
    let title = id('art-' + gallID).value;
    let username = id('artuser-' + gallID).value;
    await fetchJSON(
      `/api/${apiVersion}/galleries/art`,
      {
        method: 'POST',
        body: {
          gallery: gallID,
          title: title,
          username: username
        }
      })
      loadGalleries();
  }

  async function addUserGallery(gallID) {
    let username = id('user-' + gallID).value;
    await fetchJSON(
      `/api/${apiVersion}/galleries/user`,
      {
        method: 'POST',
        body: {
          gallery: gallID,
          username: username
        }
      })
      loadGalleries();
  }

  async function deleteGallery(gallID) {
    await fetchJSON(
      `/api/${apiVersion}/galleries`,
      {
        method: 'DELETE',
        body: {
          id: gallID
        }
      })
      loadGalleries();
  }


/*
async function toggleComments(postID){
  console.log("tried toggle")
  let element = document.getElementById(`comments-box-${postID}`);
  if(!element.classList.contains("d-none")){
    console.log("entered if statement")
      element.classList.add("d-none");
  }else{
      console.log("entered else statement")
      element.classList.remove("d-none");
      let commentsElement = document.getElementById(`comments-${postID}`);
      if(commentsElement.innerHTML == ""){ // load comments if not yet loaded
          commentsElement.innerHTML = "loading..."

          let commentsJSON = await fetchJSON(`api/${apiVersion}/comments?artID=${postID}`)
          commentsElement.innerHTML = getCommentHTML(commentsJSON);
      }
  }
}
*/

async function refreshComments(postID){
  console.log("Art ID=", postID);
  let commentsElement = document.getElementById(`comments-${postID}`);
  commentsElement.innerHTML = "loading..."

  let commentsJSON = await fetchJSON(`api/${apiVersion}/comments?artID=${postID}`)
  commentsElement.innerHTML = getCommentHTML(commentsJSON);
}

async function postComment(artID){
  let newComment = document.getElementById(`new-comment-${artID}`).value;

  let responseJson = await fetchJSON(`api/${apiVersion}/comments`, {
      method: "POST",
      body: {artID: artID, newComment: newComment}
  })

  refreshComments(artID);
}

function getCommentHTML(commentsJSON){
  console.log('comment json:', commentsJSON)
  return commentsJSON.map(commentInfo => {
      return `
      <div class="individual-comment-box">
          <div>${escapeHTML(commentInfo.comment)}</div>
          <div> - <a href="/userInfo.html?user=${encodeURIComponent(commentInfo.username)}">${escapeHTML(commentInfo.username)}</a>, ${escapeHTML(commentInfo.created_date)}</div>
      </div>`
  }).join(" ");
}

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
//}
//)();