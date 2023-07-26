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

var wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#b5b7b8",
  progressColor: "#00000",
  height: 50,
  barWidth: 2,
  barHeight: 1,
  responsive: true,
  hideScrollbar: true,
  cursorWidth: 0,
  interact: true,
  barRadius: 0,
  normalize: true,
  autoplay: true,
  // backend: 'MediaElement',
  backend: 'MediaElementWebAudio',
  // mediaType: "audio",
  // media: audio,   
});

var index = 0;
var curentVolume = 1;
var repeatIsActive = 0;
var shuffleIsActive = false;
var defaultPlayimage = "./assets/images/default-icon.png";
var rootAudioPath = "audio/";
var firstPlay = true;

shuffledArray = playList.slice();
audiopPath =
  rootAudioPath + shuffledArray[index].name + shuffledArray[index].type;

wavesurfer.load(audiopPath);
function playAudio() {
  loadMetaData();
  wavesurfer.on("ready", () => {
    if(firstPlay){
      playBtnIcon.innerHTML = "play_arrow";
    }else{
      playBtnIcon.innerHTML = "pause";
      wavesurfer.play();
    }
    playBtn.onclick = function () {
      if (!wavesurfer.isPlaying()) {
        playBtnIcon.innerHTML = "pause";
        wavesurfer.play();
      } else {
        playBtnIcon.innerHTML = "play_arrow";
        wavesurfer.pause();
      }
      firstPlay = false;
    };
  });
}
playAudio();

wavesurfer.panner = wavesurfer.backend.ac.createStereoPanner();
wavesurfer.backend.setFilter(wavesurfer.panner)

wavesurfer.on('pause', function () {
  playBtnIcon.innerHTML = "play_arrow";
  // console.log(wavesurfer.backend.source.mediaElement.src);
});

wavesurfer.on('play', function () {
  playBtnIcon.innerHTML = "pause";
});


function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60),
    seconds = Math.floor(seconds % 60);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

let currentTime = content.querySelector(".current-time");
let remainingTime = content.querySelector(".remaining-time");
wavesurfer.on("audioprocess", function () {
  if (wavesurfer.isPlaying()) {
    var totalTimeData = Math.floor(wavesurfer.getDuration()),
      currentTimeData = Math.floor(wavesurfer.getCurrentTime()),
      remainingTimeData = totalTimeData - currentTimeData;
    currentTime.innerText = formatTime(currentTimeData.toFixed(1));
    remainingTime.innerText = formatTime(remainingTimeData.toFixed(1));
  }
});

wavesurfer.on("finish", function () {
  if (!wavesurfer.isPlaying() && repeatIsActive == 2) {
    playBtnIcon.innerHTML = "pause";
    wavesurfer.play();
  } else if (!wavesurfer.isPlaying()) {
    if (repeatIsActive == 0 && index == playList.length-1) {
      currentTime.innerText = formatTime(0);
      remainingTime.innerText = formatTime(wavesurfer.getDuration());
      playBtnIcon.innerHTML = "play_arrow";
    } else {
      index++;
      if (index >= playList.length) {
        index = 0;
      }
      audiopPath =
        rootAudioPath + shuffledArray[index].name + shuffledArray[index].type;
      wavesurfer.empty();
      wavesurfer.load(audiopPath);
      playAudio();
    }
  }
});

function setVolume() {
  if (volumeSlider.value != 0) {
    muteBtnIcon.innerHTML = "volume_down";
  } else {
    muteBtnIcon.innerHTML = "no_sound";
  }
  wavesurfer.setVolume(volumeSlider.value / 100);
  curentVolume = volumeSlider.value / 100;
}

Playimage.onclick = function () {};

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

repeatBtn.onclick = function () {
  repeatIsActive++;
  if (repeatIsActive == 1) {
    repeatBtnIcon.innerHTML = "repeat";
    repeatBtnIcon.style.color = "#4676f9";
  } else if (repeatIsActive == 2) {
    repeatBtnIcon.innerHTML = "repeat_one";
  } else {
    repeatBtnIcon.innerHTML = "repeat";
    repeatBtnIcon.style.color = "#4d4d4d";
    repeatIsActive = 0;
  }
};

nextBtn.onclick = function () {
  index++;
  if (index >= playList.length) {
    index = 0;
  }
  audiopPath =
    rootAudioPath + shuffledArray[index].name + shuffledArray[index].type;
  wavesurfer.empty();
  wavesurfer.load(audiopPath);
  playAudio();
};

prevBtn.onclick = function () {
  index--;
  if (index < 0) {
    index = playList.length - 1;
  }
  audiopPath =
    rootAudioPath + shuffledArray[index].name + shuffledArray[index].type;
  wavesurfer.empty();
  wavesurfer.load(audiopPath);
  playAudio();
};


Shuffle.onclick = function () {
  if (shuffleIsActive) {
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
  shuffleIsActive = !shuffleIsActive;
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadMetaData() {
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
  nDir = remainingUrl + audiopPath;
  jsmediatags.read(nDir, {
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