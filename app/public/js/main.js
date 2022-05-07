const mainServerUrl = "http://localhost:3000";
const mainApiUrl = `${mainServerUrl}/api`;
const socket = io(mainServerUrl);

function submitForm(e) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    const options = {
      url: `${mainApiUrl}/auth`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json;charset=UTF-8",
      },
      data: {
        username,
        password,
      },
    };

    axios(options).then((res) => {
      if (res.status === 200) {
        token = res.data.token;
        localStorage.setItem("token", token);
        window.location.replace(`${mainServerUrl}/watch.html`);
      }
    });
  }
}

function checkLoggedIn() {
  const token = localStorage.getItem("token");
  if (!token) window.location.replace(`${mainServerUrl}`);

  const options = {
    url: `${mainApiUrl}/auth/confirmToken`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json;charset=UTF-8",
    },
    data: {
      token,
    },
  };

  axios(options).then((res) => console.log(res));
  // .catch((err) => window.location.replace(`${mainServerUrl}`));
}

///////////////////////////
const updates = {
  play: ["play", "pause", "Pause"],
  pause: ["pause", "play", "Play"],
};

const upadteButton = (newData) => {
  const btn = document.getElementById("playPause");
  const iconElem = btn.children[0];

  newData = !newData ? updates[btn.classList[0]] : newData;

  btn.classList.remove(newData[0]);
  btn.classList.add(newData[1]);
  iconElem.classList.remove(`fa-${newData[0]}`);
  iconElem.classList.add(`fa-${newData[1]}`);

  return newData[0];
};

const getVideoTime = () =>
  Math.round(document.getElementById("myVid").currentTime * 10) / 10;

const sendSocketAction = (options) => {
  socket.emit("takeAction", options);
};

function playPauseMV() {
  const action = updates[document.getElementById("playPause").classList[0]][0];
  const time = getVideoTime();

  sendSocketAction({
    action,
    time,
  });
}

function resetMV() {
  const time = getVideoTime();

  sendSocketAction({
    action: "reset",
    time,
  });
}

socket.on("doPlay", () => {
  upadteButton();
  document.getElementById("myVid").play();
});

socket.on("doPause", (time) => {
  upadteButton();
  document.getElementById("myVid").pause();
  document.getElementById("myVid").currentTime = parseFloat(time);
});

socket.on("doReset", () => {
  upadteButton(["pause", "play", "Play"]);
  document.getElementById("myVid").load();
});

//update time bar
const updateTime = 100;
const myVid = document.getElementById("myVid");
setInterval(function () {
  const seenPecent = (myVid.currentTime / myVid.duration) * 100;

  document.getElementById("pin").style.width = `${seenPecent}%`;
}, updateTime);

function jumpTime(e) {
  const myVid = document.getElementById("myVid");
  const changeTime = parseInt(e.currentTarget.getAttribute("data-time"));

  const newTime = e.currentTarget.classList.contains("forward")
    ? myVid.currentTime + changeTime < myVid.duration
      ? myVid.currentTime + changeTime
      : myVid.duration
    : myVid.currentTime - changeTime > 0
    ? myVid.currentTime - changeTime
    : 0;

  if (newTime >= 10) {
    sendSocketAction({
      action: "pause",
      time: newTime,
    });
  } else {
    resetMV();
  }

  setTimeout(() => {
    sendSocketAction({
      action: "play",
    });
  }, 200);
}

function changeVolume(e) {
  const value = e.target.value / 100;
  document.getElementById("myVid").volume = value;
}
