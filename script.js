//const btnSearch = document.querySelector('#searchBtn');
const input = document.querySelector('#usernameInp');
const userdatahtml = document.querySelector('.userdatahtml');
const form = document.querySelector('form');
const listreposi = document.querySelector('.listrepository');
var getFollowerlist = document.getElementById('followermodel');
const listgist = document.getElementById('listgist');
var inputfilterrepo = document.getElementById('reponameInp');
var allowsearch = false;

input.onchange = function () {
  allowsearch = true;
};
async function getEmail(data) {
  // * fetch event public >>get all array>>payload>>commits>>all commit traverse>>author>>email and name verify
  let url = `https://api.github.com/users/${data.login}/events/public?per_page=100`;
  return await fetch(url)
    .then((res) => res.json())
    .then((eventData) => {
      for (let i in eventData) {
        let x = eventData[i].payload.commits;
        //  console.log(x);
        if (x !== undefined) {
          let Validemail = x.filter((e) => {
            return (
              e.author.name == data.name &&
              !e.author.email.includes('.noreply.github.com')
            );
          });
          if (Validemail[0] !== undefined) {
            return Validemail[0].author.email;
          }
        }
      }
    })
    .catch((err) => {
      console.log('Error: ' + err);
    });
}
var userData;
var inputValueis;

async function getStatProjects() {
  var stardatano;
  let res = await fetch(
    `https://api.github.com/users/${inputValueis}/starred?per_page=100`
  );
  let response = await res.json();
  stardatano = response.length;
  console.log(typeof stardatano);
  return stardatano;
}
var formsub = function () {
  listgist.classList.remove('show');
  listreposi.classList.remove('show');
  let loader = `  <div class="spinner w-100 h-100 mt-5 mb-5 d-flex justify-content-center ">
<span class="loader"></span>
</div>`;
  inputValueis = input.value;
  let url = `https://api.github.com/users/${inputValueis}`;

  userdatahtml.querySelectorAll('.datacard').forEach((ele) => {
    ele.remove();
  });
  userdatahtml.insertAdjacentHTML('beforeend', loader);
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then(async (data) => {
      userData = data;
      var useremail;
      await getEmail(userData).then((ress) => {
        useremail = ress;
      });
      let joinDate = userData.created_at.substring(0, 10);

      //  console.log('value: ' + inputValueis);
      fetch(`https://api.github.com/users/${inputValueis}/repos?per_page=100`)
        .then((respo) => respo.json())
        .then(async (userPublicrepo) => {
          await showRepoList(userPublicrepo);
        });
      var getStarProject;
      await getStatProjects().then((userstar) => {
        console.log(1);
        getStarProject = userstar;
      });
      console.log(2);

    let userDataHTMLV = `
<div class="datacard card-list card  my-2 mx-1 mb-1 w-50 mb-3 shadow p-3 mb-5 rounded" style="max-width: 18rem;">
    <div class="card-body text-success">
        <img src="${
          userData.avatar_url
        }" style="width: 250px;height: 250px;" alt="userimg" class="rounded">
    </div>
    <div class="card-footer bg-transparent border-secondary border-0  d-flex justify-content-center align-content-center"><span class=" d-flex  align-content-start"><a href="${
      userData.html_url
    }" target="_blank" class="btn btn-outline-primary shadow-none profilebut border-0 shadow-lg" >Check Github Profile </a></span></div>
</div>

<div class="datacard card-list details flex-fills mw-25 card  w-50 mb-3 my-2 mx-1 shadow p-3 mb-5 rounded" id="details">
    <h2 id="name">${userData.name}</h2>
    <p> &nbsp@${userData.login}</p>

${
  userData.blog === ''
    ? `<p class="text-danger" ><i class="fas fa-link icon"></i> Not available</p>`
    : ` <p> <a href="${userData.blog}" target="_blank" class="alink"><i class="fas fa-link icon"></i> ${userData.blog}</a></p>`
}

   ${
     userData.location === null
       ? ` <p class="text-danger"><i class="fas fa-map-marker-alt icon"></i>&nbsp Not available</p>`
       : ` <p><i class="fas fa-map-marker-alt icon"></i>&nbsp${userData.location}</p>`
   }
   ${
     useremail === undefined
       ? ` <p class="text-danger"> <i class="far fa-envelope icon"></i> Not avaliable</p>`
       : ` <p> <a href="mailto:${useremail}" class="alink"><i class="far fa-envelope icon"></i> ${useremail}</a></p>`
   }
  
    <p><i class="fab fa-twitter icon"></i> @${userData.twitter_username}</p>
${
  userData.bio == null
    ? ` <p class="text-danger"><i class="fas fa-address-card icon"></i> Not avaliable</p>`
    : ` <p><i class="fas fa-address-card icon"></i> ${userData.bio}</p>`
}
   
</div>
<div class="datacard card-list card  w-25 mb-3 my-2 mx-1 shadow p-3 mb-5 rounded" style="max-width: 18rem;">
    <div class="card-body">
        <p class="pubrepo" data-bs-toggle="collapse" data-bs-target="#listrepo" aria-expanded="false"  role="button" aria-controls="listrepo" style="cursor: pointer;">Public repo:${
          userData.public_repos
        }</p>
        <p data-bs-toggle="collapse" data-bs-target="#listgist" aria-expanded="false"  role="button" aria-controls="listgist" style="cursor: pointer;">Public Gist:${
          userData.public_gists
        }</p>
     ${
       userData.type === 'User'
         ? ` <p data-bs-toggle="modal" data-bs-target="#followermodel" style="cursor: pointer;" >Followers:${userData.followers}</p>
      <p data-bs-toggle="modal" data-bs-target="#followingmodel" style="cursor: pointer;">Following:${userData.following}</p>
      <p>Star Projects:${getStarProject}</p>`
         : ``
     }
     <p>Type: ${userData.type}</p>
        <p>Joined On:${joinDate} </p>
       
    </div>
</div>

`;
      const spinnerr = document.querySelector('.spinner');
      spinnerr.remove();
      userdatahtml.insertAdjacentHTML('beforeend', userDataHTMLV);
    })
    .catch((err) => {
      console.log(err);
    });

  input.value = '';
  inputfilterrepo.value = '';
};
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(input.value);
  if (input.value !== undefined && allowsearch == true && input.value !== '')
    formsub();
});
const repomodal = document.getElementById('repomodal');
repomodal.addEventListener('show.bs.modal', () => {
  console.log('Hide activated');
  const modalbody = repomodal.querySelector('.modal-body');
  console.log(modalbody);
  modalbody.querySelectorAll('.repomodelbody').forEach((line) => {
    console.log('delete  model' + line);
    line.remove();
  });
});

function showRepoList(repolist) {
  // console.log(listreposi);
  listreposi.querySelectorAll('.listofrepo').forEach((ele) => {
    //  console.log('deleting:  ' + ele);
    ele.remove();
  });
  let i = userData.public_repos > 100 ? 100 : userData.public_repos;
  for (var rep in repolist) {
    // console.log(rep);
    htmlTaglist = `<div style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#repomodal" value="${rep}" class="shadowCss p-3 mb-3 hvr-float rounded listofrepo card-list">${i}. ${repolist[rep].name}</div>`;
    listreposi.insertAdjacentHTML('afterbegin', htmlTaglist);
    i--;
  }
  listreposi.querySelectorAll('.listofrepo').forEach((ele) => {
    ele.addEventListener('click', () => {
      let indexOfRepo = ele.getAttribute('value');
      let currentrepo = repolist[indexOfRepo];
      repomodal.querySelector('#repomodalLabel').textContent = currentrepo.name;
      const modalbody = repomodal.querySelector('.modal-body');
      let createdDate = currentrepo.created_at.substring(0, 10);
      let latestUpdate = currentrepo.updated_at.substring(0, 10);
      let htmlData = ` <div class="repomodelbody">
      <p>Id:${currentrepo.id}</p>
      <p>Owner : ${currentrepo.owner.login}</p>
      <p>URL:${currentrepo.html_url} </p>
     ${
       currentrepo.homepage === null || currentrepo.homepage === ''
         ? `<p class="text-danger">Homepage: Not available</p>`
         : `<p>HomePage: ${currentrepo.homepage}</p>`
     }
    ${
      currentrepo.description === null
        ? `<p class="text-danger">Description: Not available</p>`
        : `<p>Description: ${currentrepo.description}</p>`
    }
      <p>Forked Repo: ${currentrepo.fork}</p>
      <p>Fork count :${currentrepo.forks_count}</p>
      <p>Fork : Show a list of fork User</p>
      <p>Created on:${createdDate}</p>
      <p>Updated at:${latestUpdate}</p>
      <p>Languages:${currentrepo.language}
      </p>
      <p>Size:${currentrepo.size}kb</p>
      <p>Open issue count:${currentrepo.open_issues_count}</p>
      <p>Stars:${currentrepo.stargazers_count}</p>
       ${
         currentrepo.license === null
           ? `<p class="text-danger">License: Not available</p>`
           : `<p>License: ${currentrepo.license.key}</p>`
       }
      <p>List of Branches:</p>
      <p>Contributer list</p>
      </div>`;
      modalbody.insertAdjacentHTML('beforeend', htmlData);
    });
  });
}

// ? Get Follower

getFollowerlist.addEventListener('show.bs.modal', function (event) {
  const modalBody = getFollowerlist.querySelector('.modal-body');
  console.log(modalBody);
  let loader = `  <div class="spinner w-100 h-100 mt-5 mb-5 d-flex justify-content-center ">
    <span class="loader"></span>
</div>`;
  modalBody.insertAdjacentHTML('beforeend', loader);
  console.log('model open h');
  let url = `https://api.github.com/users/${userData.login}/followers?per_page=100`;
  modalBody.querySelectorAll('.followerlist').forEach((element) => {
    element.remove();
  });
  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      const spinnerr = modalBody.querySelector('.spinner');
      spinnerr.remove();
      //  console.log(response);

      response.forEach((ele) => {
        //console.log(ele);
        let htmlData = `<div style="cursor: pointer;"  class="shadowCss p-3 mb-3 rounded followerlist card-list hvr-float">${ele.login} </div>`;
        modalBody.insertAdjacentHTML('afterbegin', htmlData);
      });
      modalBody.querySelectorAll('.followerlist').forEach((list) => {
        list.addEventListener('click', () => {
          //  console.log('click on list:' + list.textContent);
          input.value = list.textContent;
          formsub();
          getFollowerlist.querySelector('.modalclose').click();
        });
      });
    })
    .catch((err) => {
      console.log('Error while fetching follwers list: ' + err);
    });
});

// ? Get following

var getFollowing = document.querySelector('#followingmodel');
getFollowing.addEventListener('show.bs.modal', () => {
  const modalBody = getFollowing.querySelector('.modal-body');
  let loader = `  <div class="spinner w-100 h-100 mt-5 mb-5 d-flex justify-content-center ">
    <span class="loader"></span>
</div>`;
  modalBody.insertAdjacentHTML('beforeend', loader);
  console.log('model open h');
  let url = `https://api.github.com/users/${userData.login}/following?per_page=100`;
  modalBody.querySelectorAll('.followinglist').forEach((element) => {
    element.remove();
  });
  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      const spinnerr = modalBody.querySelector('.spinner');
      spinnerr.remove();
      //  console.log(response);

      response.forEach((ele) => {
        console.log(ele);
        let htmlData = `<div style="cursor: pointer;"  class="shadowCss p-3 mb-3 rounded followinglist card-list hvr-float">${ele.login} </div>`;
        modalBody.insertAdjacentHTML('afterbegin', htmlData);
      });
      modalBody.querySelectorAll('.followinglist').forEach((list) => {
        list.addEventListener('click', () => {
          //  console.log('click on list:' + list.textContent);
          input.value = list.textContent;
          formsub();
          getFollowing.querySelector('.modalclose').click();
        });
      });
    })
    .catch((err) => {
      console.log('Error while fetching following list: ' + err);
    });
});

listgist.addEventListener('show.bs.collapse', () => {
  const listgistdata = listgist.querySelector('.listgistdata');
  let loader = `  <div class="spinner w-100 h-100 mt-5 mb-5 d-flex justify-content-center ">
    <span class="loader"></span>
</div>`;
  listgistdata.insertAdjacentHTML('beforeend', loader);

  let url = `https://api.github.com/users/${userData.login}/gists`;
  listgistdata.querySelectorAll('.gistlist').forEach((element) => {
    element.remove();
  });

  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      const spinnerr = listgistdata.querySelector('.spinner');
      spinnerr.remove();
      //  console.log(response);

      response.forEach((ele) => {
        console.log(ele);
        let htmlData = `<div style="cursor: pointer;"  class="shadowCss p-3 mb-3 bg-white rounded gistlist card-list hvr-float">${ele.description} </div>`;
        listgistdata.insertAdjacentHTML('afterbegin', htmlData);
      });
    })
    .catch((err) => {
      console.log('Error while fetching following list: ' + err);
    });
});

function searchRepo() {
  var filter, a, i;

  filter = inputfilterrepo.value.toUpperCase();

  list = document.getElementsByClassName('listofrepo');
  for (i = 0; i < list.length; i++) {
    a = list[i].textContent;
    // console.log(a);
    if (a.toUpperCase().indexOf(filter) > -1) {
      list[i].style.display = '';
    } else {
      list[i].style.display = 'none';
    }
  }
}

// Dark mode library code
// const options = {
//   bottom: '64px', // default: '32px'
//   right: 'unset', // default: '32px'
//   left: '32px', // default: 'unset'
//   time: '0.6s', // default: '0.3s'
//   mixColor: '#fff', // default: '#fff'
//   backgroundColor: '#fff',  // default: '#fff'
//   buttonColorDark: '#100f2c',  // default: '#100f2c'
//   buttonColorLight: '#fff', // default: '#fff'
//   saveInCookies: false, // default: true,
//   label: '🌓', // default: ''
//   autoMatchOsTheme: true // default: true
// }

// const darkmode = new Darkmode(options);
// darkmode.showWidget();
// Dark mode library code end

// original Dark mode code 😝
var darkToggle = document.getElementById("flexSwitchCheckChecked");
darkToggle.addEventListener('change', (colors)=>{
  // console.log("theme changed");
  document.body.classList.toggle('dark2');
  document.getElementById("details").classList.toggle('dark2');

  const cards = document.getElementsByClassName("card-body");
  for(var i=0;i<cards.length;i++){
    cards[i].classList.toggle('dark2');
  }

  const repo = document.getElementsByClassName("listofrepo");
  for(var i=0;i<repo.length;i++){
    console.log(repo[i]);
    repo[i].classList.toggle('dark2');
  }

  const container = document.getElementsByClassName("row");
  for(var i=0;i<container.length;i++){
    container[i].classList.toggle('dark1');
  }

  const follower = document.getElementsByClassName("followerlist");
  for(var i=0;i<follower.length;i++){
    follower[i].classList.toggle('dark2');
  }
  const following = document.getElementsByClassName("followinglist");
  for(var i=0;i<following.length;i++){
    following[i].classList.toggle('dark2');
  }
  const userdata = document.getElementsByClassName("userdatahtml");
  for(var i=0;i<userdata.length;i++){
    userdata[i].classList.toggle('dark1');
  }

  const datacard = document.getElementsByClassName("datacard");
  for(var i=0;i<datacard.length;i++){
    datacard[i].classList.toggle('dark1');
  }

  document.getElementsByClassName("modal-body").classList.toggle("dark2");
  document.getElementsByTagName("button")[0].classList.toggle("dark_btn");
});
