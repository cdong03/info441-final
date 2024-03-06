async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/arts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(art => {
        return `
        <div class="post">
            <br></br>
            ${escapeHTML(art.title)}
            <br></br>
            <img src="${art.imgUrl}" alt="${art.alt}">
            <div><a href="/userInfo.html?user=${encodeURIComponent(art.username)}">${escapeHTML(art.username)}</a>, ${escapeHTML(art.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${art.likes? escapeHTML(art.likes.join(", ")) : ""}"> ${art.likes ? `${art.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deleteArt("${art.id}")' class="${art.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deleteArt(artID){
    let responseJson = await fetchJSON(`api/${apiVersion}/arts`, {
        method: "DELETE",
        body: {artID: artID}
    })
    loadUserInfo();
}

