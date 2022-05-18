const SERVER_ROOT = "http://localhost:3000";
window.onload = function () {
  if (localStorage.getItem("accessToken")) {
    afterLogin();
  } else {
    notLogin();
  }

  document.getElementById("loginBtn").onclick = function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_ROOT}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        loggedInFeatures(data);
      });
  };

  document.getElementById("logoutBtn").onclick = function () {
    localStorage.removeItem("accessToken");
    notLogin();
  };
  searchSongs();
};

function loggedInFeatures(data) {
  if (data.status) {
    document.getElementById("errormessage").innerHTML = data.message;
  } else {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    localStorage.setItem("accessToken", data.accessToken);
    afterLogin();
  }
}

function searchSongs() {
  const searchItem = document.getElementById("search-input");
  document.getElementById("searchBtn").onclick = function () {
    fetch(`${SERVER_ROOT}/api/music?search=${searchItem.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((songs) => {
        let searchTable = document.getElementById("mTable");
        searchTable.innerHTML = "";
        let html = `
        
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Release Date</th>
                 <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody id="table-body">

    `;
        let counter = 1;
        songs.forEach((song) => {
          html += `
                    <tr>
                        <th scope="row">${counter}</th>
                        <td>${song.title}</td>
                         <td>${song.releaseDate}</td>
                         <input type="button"  onclick="addToMyPlayList(${song.id});" value="ADD"/>
                         

                     </tr>               
               `;
          counter++;
        });

        html += `
                </tbody>
            
            `;
        searchTable.innerHTML = html;
      });
  };
}

function fetchMusic() {
  fetch(`${SERVER_ROOT}/api/music`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then(
      (songs) => {
        let html = `
        
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Release Date</th>
                 <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody id="table-body">

    `;
        let counter = 1;
        songs.forEach((song) => {
          html += `
                    <tr>
                        <th scope="row">${counter}</th>
                        <td>${song.title}</td>
                         <td>${song.releaseDate}</td>
                        <td> <input type="button" musicid="${song.id}" onclick="addToMyPlayList(this)" value="ADD"/></td>
                         

                     </tr>               
               `;
          counter++;
        });

        html += `
                </tbody>
            
            `;
        document.getElementById("mTable").innerHTML = html;
      }

      //  console.log(songs)
    );
}
function fetchPlayList() {
  fetch(`${SERVER_ROOT}/api/playlist`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then(
      (songs) => {
        let html = `
          
          <thead>
              <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                   <th scope="col">Actions</th>
              </tr>
          </thead>
          <tbody id="table-body">
  
      `;

        songs.forEach((song) => {
          html += `
        <tr>
          <td scope="row">${song.orderId}</td>
          <td>${song.title}</td>
          <td><input type="button" playlistId="${song.songId}" onclick="removePlayList(this)" value="remove"/>&nbsp&nbsp<input type="button" playSong="${song.urlPath}" onclick="playSong(this)" value="play"/></td>
       </tr>            
                 `;
        });

        html += `
                  </tbody>
              
              `;
        document.getElementById("pTable").innerHTML = html;
      }

      //  console.log(songs)
    );
}
function addToMyPlayList(song) {
  let songAtt = song.getAttribute("musicid");
  console.log(songAtt);

  fetch(`${SERVER_ROOT}/api/playlist/add`, {
    method: "POST",
    body: JSON.stringify({
      songId: songAtt,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then((songs) => {
      let html = `

          <thead>
              <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                   <th scope="col">Actions</th>
              </tr>
          </thead>
          <tbody id="table-body">

      `;

      songs.forEach((song) => {
        html += `
                    <tr>
                        <td scope="row">${song.orderId}</td>
                        <td>${song.title}</td>
                        <td><input type="button" playlistId="${song.songId}"  onclick="removePlayList(this)"  value="remove"/>&nbsp&nbsp<input type="button" playSong="${song.urlPath}" onclick="playSong(this)" value="play"/></td>
                     </tr>
               `;
      });

      html += `
                </tbody>

            `;
      document.getElementById("pTable").innerHTML = html;

      // console.log(songs);
    });

  // console.log("adding--" + songId);
}

function removePlayList(song) {
  let songAtt = song.getAttribute("playlistId");
  console.log(songAtt);
  fetch(`${SERVER_ROOT}/api/playlist/remove`, {
    method: "POST",
    body: JSON.stringify({
      songId: songAtt,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })
    .then((response) => response.json())
    .then(
      (songs) => {
        let html = `

          <thead>
              <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                   <th scope="col">Actions</th>
              </tr>
          </thead>
          <tbody id="table-body">

      `;

        songs.forEach((song) => {
          html += `
        <tr>
          <td scope="row">${song.orderId}</td>
          <td>${song.title}</td>
          <td><input type="button" playlistId="${song.songId}" onclick="removePlayList(this)"  value="remove"/>&nbsp&nbsp<input type="button" playSong="${song.urlPath}" onclick="playSong(this)"  value="play"/></td>
       </tr>
                 `;
        });

        html += `
                  </tbody>

              `;
        document.getElementById("pTable").innerHTML = html;
      }

      //  console.log(songs)
    );
}

function playSong(song) {
  let playAtt = song.getAttribute("playSong");
  let x = document.getElementById("footer-player");
  x.innerHTML = `<audio controls autoplay class="embed-responsive-item">
  <source src="${SERVER_ROOT}/${playAtt}" type ="audio/mpeg"/>
</audio>`;

  x.play();
}

function afterLogin() {
  document.getElementById("search").style.display = "block";
  document.getElementById("logout-div").style.display = "block";
  document.getElementById("login-div").style.display = "none";
  fetchMusic();
  fetchPlayList();
  document.getElementById("content").innerHTML = "Song Options";
}

function notLogin() {
  document.getElementById("search").style.display = "none";
  document.getElementById("logout-div").style.display = "none";
  document.getElementById("myPlayList").style.display = "none";
  document.getElementById("login-div").style.display = "block";
  document.getElementById("content").innerHTML = "Welcome to Music Station";
  document.getElementById("mTable").style.display = "none";
  document.getElementById("pTable").style.display = "none";
  document.getElementById("footer-player").style.display = "none";
}
