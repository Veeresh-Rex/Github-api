const btnSearch = document.querySelector('#searchBtn');
const input = document.querySelector('#usernameInp');
const imageUser = document.querySelectorAll('.imageUser')[0];
console.log(imageUser);
console.log(btnSearch);
var userData;
btnSearch.addEventListener('click', () => {
  console.log('click');
  console.log(input.value);
  let url = `https://api.github.com/users/${input.value}`;
  console.log(url);
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      userData = data;
      imageUser.insertAdjacentHTML(
        'beforebegin',
        `<img src="https://avatars.githubusercontent.com/u/52687597?v=4" style="width: 220px;height:fit-content;" alt="">`
      );
    })
    .catch((err) => {
      console.log(err);
    });
  input.value = '';
});
$.ajax({
  url: 'https://api.github.com/users/blackmiaool/repos',
  jsonp: true,
  method: 'GET',
  dataType: 'json',
  success: function (res) {
    console.log(res);
  },
});
