const content = document.querySelector(".content"),
Playimage = content.querySelector(".music-image img"),
musicName = content.querySelector(".music-titles .name"),
musicArtist = content.querySelector(".music-titles .artist"),
playBtn = content.querySelector(".play-pause"),
playBtnIcon = content.querySelector(".play-pause span"),
prevBtn = content.querySelector("#prev"),
nextBtn = content.querySelector("#next"),
repeatBtn = content.querySelector(".repeat-btn"),
repeatBtnIcon = content.querySelector(".repeat-btn span"),
Shuffle = content.querySelector(".shuffleBtn"),
ShuffleBtnIcon = content.querySelector(".shuffleBtn span"),
muteBtn = content.querySelector(".mute-volume"),
muteBtnIcon = content.querySelector(".mute-volume span"),
volumeUpBtn = content.querySelector(".volume-up"),
volumeSlider = content.querySelector("#volume-slider");
currentTime = content.querySelector(".current-time");
remainingTime = content.querySelector(".remaining-time");
var index = 0;
var defaultPlayimage = "./assets/images/default-icon.png";

const options = {
  container: "#waveform",
  waveColor: "#b5b7b8",//"#b5b7b8"
  progressColor: "#00000",
  height: 50,
  barWidth: 2,
  barHeight: 1,
  responsive: true,
  hideScrollbar: true,
  cursorWidth: 0,
  interact: 1,
  barRadius: 2,
  // autoplay: true,
  // backend:"MediaElementWebAudio",
  minPxPerSec:1,
  mediaControls:false,
  sampleRate: 8000,
  autoCenter: true,
  audioRate: 1,
  normalize: 0,
}

var wavesurfer = WaveSurfer.create(options)
var shuffledArray = playList.slice();

wavesurfer.load(shuffledArray[index].path);

wavesurfer.on("ready", () => {
  readMediatags();
  wavesurfer.play();
})

wavesurfer.on('pause', function () {
  playBtnIcon.innerHTML = "play_arrow";
});

wavesurfer.on('play', function () {
  playBtnIcon.innerHTML = "pause";
});

playBtn.onclick = function () {
  if (!wavesurfer.isPlaying()) {
    wavesurfer.playPause();
  }else{
    wavesurfer.playPause();
  }
};

nextBtn.onclick = function () {
  index++;
  if (index >= playList.length) {
    index = 0;
  }
  wavesurfer.load(shuffledArray[index].path);
  wavesurfer.on("ready", function () {
    wavesurfer.play();
  })
};

prevBtn.onclick = function () {
  index--;
  if (index < 0) {
    index = playList.length - 1;
  }
  wavesurfer.load(shuffledArray[index].path);
  wavesurfer.on("ready", function () {
    wavesurfer.play();
  })
};

// var curentVolume = 1;
function setVolume() {
  if (volumeSlider.value != 0) {
    muteBtnIcon.innerHTML = "volume_down";
  } else {
    muteBtnIcon.innerHTML = "no_sound";
  }
  wavesurfer.setVolume(volumeSlider.value / 100);
  curentVolume = volumeSlider.value / 100;
}

muteBtn.onclick = function () {
  if (wavesurfer.getVolume() > 0) {
    curentVolume = wavesurfer.getVolume();
    wavesurfer.setVolume(0);
    muteBtnIcon.innerHTML = "no_sound";
    volumeSlider.value = 0;
  } else {
    muteBtnIcon.innerHTML = "volume_down";
    if (curentVolume == 0) {
      volumeSlider.value = 30;
      wavesurfer.setVolume(0.3);
    } else {
      volumeSlider.value = curentVolume * 100;
      wavesurfer.setVolume(curentVolume);
    }
  }
};

volumeUpBtn.onclick = function () {
  wavesurfer.setVolume(1);
  volumeSlider.value = 100;
  muteBtnIcon.innerHTML = "volume_down";
};

var isShuffle = false;
Shuffle.onclick = function () {
  if (isShuffle) {
    ShuffleBtnIcon.style.color = "#4d4d4d";
    currentAudio = shuffledArray[index].name;
    shuffledArray = playList.slice();
    index = shuffledArray.findIndex(function (item, i) {
      return item.name === currentAudio;
    });
  } else {
    ShuffleBtnIcon.style.color = "#4676f9";
    currentAudio = shuffledArray[index].name;
    shuffledArray = shuffleArray(shuffledArray);
    index = shuffledArray.findIndex(function (item, i) {
      return item.name === currentAudio;
    });
  }
  isShuffle = !isShuffle;
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60),
    seconds = Math.floor(seconds % 60);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

wavesurfer.on("audioprocess", function () {
  currentTime.innerText = formatTime(Math.floor(wavesurfer.getCurrentTime()).toFixed(1));
  remainingTime.innerText = formatTime(Math.floor(wavesurfer.getDuration())-Math.floor(wavesurfer.getCurrentTime()).toFixed(1));
});

wavesurfer.on("finish", function () {
  switch (isRepeat)
  {
    case 1:
      index++;
      if (index >= playList.length) {
        index = 0;
      }
      wavesurfer.load(shuffledArray[index].path);
      break;
    case 2:
      wavesurfer.play();
      break;
    default:
      if (index == playList.length-1) {
        index = 0;
        wavesurfer.load(shuffledArray[index].path);
        wavesurfer.on("ready", () => {
          wavesurfer.pause();
          currentTime.innerText = formatTime(0);
          remainingTime.innerText = formatTime(wavesurfer.getDuration());
        })
      }else{
        index++;
        if (index >= playList.length) {
          index = 0;
        }
        wavesurfer.load(shuffledArray[index].path);
      }
      break;
  }
})

var isRepeat = 0;
repeatBtn.onclick = function () {
  isRepeat++;
  if(isRepeat>2)
  {
    isRepeat = 0;
  }
  switch (isRepeat){
    case 1:
      repeatBtnIcon.innerHTML = "repeat";
      repeatBtnIcon.style.color = "#4676f9";
      break;
    case 2:
      repeatBtnIcon.innerHTML = "repeat_one";
      break;
    default:
      repeatBtnIcon.innerHTML = "repeat";
      repeatBtnIcon.style.color = "#4d4d4d";
  }
  console.log(isRepeat)
};



function readMediatags() {
  const url = window.location.href;
  const separator = "/";
  const parts = url.split(separator);
  const remainingUrl =
    parts[0] +
    separator +
    separator +
    parts[2] +
    separator +
    parts[3] +
    separator;
  jsmediatags.read(remainingUrl + shuffledArray[index].path, {
    onSuccess: function (tag) {
      var tags = tag.tags;
      var image = tags.picture;
      if (image) {
        var base64String = "";
        for (var i = 0; i < image.data.length; i++) {
          base64String += String.fromCharCode(image.data[i]);
        }
        var base64 =
          "data:" + image.format + ";base64," + window.btoa(base64String);
        Playimage.src = base64;
      } else {
        Playimage.src = defaultPlayimage;
      }
      if (tags.title) {
        musicName.innerHTML = tags.title;
      } else {
        musicName.innerHTML = "Unknow";
      }
      if (tags.artist) {
        musicArtist.innerHTML = tags.artist;
      } else {
        musicArtist.innerHTML = "Unknow";
      }
    },
    onError: function (error) {
      console.log(error);
    },
  });
}

window.onload = function() {
  document.addEventListener("contextmenu", function(e) {
      e.preventDefault();
  }, false);
  document.addEventListener("keydown", function(e) {
      //document.onkeydown = function(e) {
      // "I" key
      if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
          disabledEvent(e);
      }
      // "J" key
      if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
          disabledEvent(e);
      }
      // "S" key + macOS
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
          disabledEvent(e);
      }
      // "U" key
      if (e.ctrlKey && e.keyCode == 85) {
          disabledEvent(e);
      }
      // "F12" key
      if (event.keyCode == 123) {
          disabledEvent(e);
      }
  }, false);

  function disabledEvent(e) {
      if (e.stopPropagation) {
          e.stopPropagation();
      } else if (window.event) {
          window.event.cancelBubble = true;
      }
      e.preventDefault();
      return false;
  }
};

wavesurfer.on('error', function(e) {
console.log(e);
error.innerText = e.toString();
})