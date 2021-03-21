//const btnSearch = document.querySelector('#searchBtn');
const input = document.querySelector('#usernameInp');
const userdatahtml = document.querySelector('.userdatahtml');
const form = document.querySelector('form');
const listreposi = document.querySelector('.listrepository');
var allowsearch;
async function getEmail(data) {
    // * fetch event public >>get all array>>payload>>commits>>all commit traverse>>author>>email and name verify
    let url = `https://api.github.com/users/${data.login}/events/public?per_page=100`;
    return await fetch(url)
        .then((res) => res.json())
        .then((eventData) => {
            const spinnerr = document.querySelector('.spinner');
            spinnerr.remove();
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
var formsub = function() {
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
        .then(async(data) => {
            userData = data;
            var useremail;
            await getEmail(userData).then((ress) => {
                useremail = ress;
            });
            let joinDate = userData.created_at.substring(0, 10);
            //  console.log('value: ' + inputValueis);
            fetch(`https://api.github.com/users/${inputValueis}/repos?per_page=100`)
                .then((respo) => respo.json())
                .then(async(userPublicrepo) => {
                    await showRepoList(userPublicrepo);
                });

            let userDataHTMLV = `
<div class="datacard card border-secondary my-2 mx-1 mb-1 w-50 mb-3 shadow p-3 mb-5 bg-white rounded" style="max-width: 18rem;">
    <div class="card-body text-success">
        <img src="${userData.avatar_url}" style="width: 220px;height: 220px;" alt="userimg" class="rounded shadow">
    </div>
    <div class="card-footer bg-transparent border-secondary"><button type="button" class="btn btn-outline-primary justify-content-center">Follow</button></div>
</div>

<div class="datacard details flex-fills mw-25 card border-secondary w-50 mb-3 my-2 mx-1 shadow p-3 mb-5 bg-white rounded">
    <h2 id="name">${userData.name}</h2>
    <p> &nbsp@${userData.login}</p>
    <p><i class="fas fa-link"></i>&nbsp${userData.blog}</p>
    <p><i class="fas fa-map-marker-alt"></i>&nbsp${userData.location}</p>
    <a href="mailto:${useremail}"><i class="far fa-envelope"></i> ${useremail}</a>
    <p><i class="fab fa-twitter"></i>&nbsp@${userData.twitter_username}</p>
    <p>Type: ${userData.type}</p>
    <p><i class="fas fa-address-card"></i> ${userData.bio}</p>
</div>
<div class="datacard card border-secondary w-25 mb-3 my-2 mx-1 shadow p-3 mb-5 bg-white rounded" style="max-width: 18rem;">
    <div class="card-body">
        <p class="pubrepo" data-bs-toggle="collapse" href="#listrepo" aria-expanded="true"  role="button" aria-controls="listrepo" style="cursor: pointer;">Public repo:${userData.public_repos}</p>
        <p>Public Gist:${userData.public_gists}</p>
        <p data-bs-toggle="modal" data-bs-target="#followermodel" style="cursor: pointer;" >Followers:${userData.followers}</p>
        <p data-bs-toggle="modal" data-bs-target="#followingmodel" style="cursor: pointer;">Following:${userData.following}</p>
        <p>Joined On:${joinDate} </p>
        <p>Star Projects:4</p>
    </div>
</div>

`;
            userdatahtml.insertAdjacentHTML('beforeend', userDataHTMLV);
        })
        .catch((err) => {
            console.log(err);
        });

    input.value = '';
};
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    formsub();
});

function showRepoList(repolist) {
    console.log(listreposi);
    listreposi.querySelectorAll('.listofrepo').forEach((ele) => {
        console.log('deleting:  ' + ele);
        ele.remove();
    });
    let i = userData.public_repos > 100 ? 100 : userData.public_repos;
    for (var rep in repolist) {
        htmlTaglist = `<div style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#exampleModal" class="shadowCss p-3 mb-3 hvr-float bg-white rounded listofrepo card-list">${i}. ${repolist[rep].name}</div>`;
        listreposi.insertAdjacentHTML('afterbegin', htmlTaglist);
        i--;
    }
}

var getFollowerlist = document.getElementById('followermodel');
getFollowerlist.addEventListener('show.bs.modal', function(event) {
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
                console.log(ele);
                let htmlData = `<div style="cursor: pointer;"  class="shadowCss p-3 mb-3 bg-white rounded followerlist card-list hvr-float">${ele.login} </div>`;
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
var getFollowing = document.querySelector('#followingmodel');
getFollowing.addEventListener('show.bs.modal', () => {
    const modalBody = getFollowing.querySelector('.modal-body');
    //console.log(modalBody);
    let loader = `  <div class="spinner w-100 h-100 mt-5 mb-5 d-flex justify-content-center ">
    <span class="loader"></span>
</div>`;
    modalBody.insertAdjacentHTML('beforeend', loader);
    console.log('model open h');
    let url = `https://api.github.com/users/${userData.login}/following?per_page=100`;
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
                console.log(ele);
                let htmlData = `<div style="cursor: pointer;"  class="shadowCss p-3 mb-3 bg-white rounded followerlist card-list hvr-float">${ele.login} </div>`;
                modalBody.insertAdjacentHTML('afterbegin', htmlData);
            });
            modalBody.querySelectorAll('.followerlist').forEach((list) => {
                list.addEventListener('click', () => {
                    //  console.log('click on list:' + list.textContent);
                    input.value = list.textContent;
                    formsub();
                    getFollowing.querySelector('.modalclose').click();
                });
            });
        })
        .catch((err) => {
            console.log('Error while fetching follwers list: ' + err);
        });
});