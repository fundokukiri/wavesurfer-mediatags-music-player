var contents = document.querySelector("#app-content"),
  trackArt = contents.querySelector(".album-art img"),
  trackName = contents.querySelector(".track-name #name"),
  trackArtist = contents.querySelector(".track-name #artist"),
  trackAlbum = contents.querySelector(".track-name #album"),
  bgArtwork = contents.querySelector("#bg-artwork"),
  seekBar = contents.querySelector("#track-seek-bar"),
  playPauseBtn = contents.querySelector(".play-pause"),
  playPauseBtnIcon = contents.querySelector(".play-pause span"),
  repeatBtn = contents.querySelector(".repeat-btn"),
  repeatBtnIcon = contents.querySelector(".repeat-btn span"),
  prevBtn = contents.querySelector("#prev"),
  ShuffleBtn = contents.querySelector(".shuffleBtn"),
  ShuffleBtnIcon = contents.querySelector(".shuffleBtn span"),
  nextBtn = contents.querySelector("#next"),
  muteBtn = contents.querySelector(".mute-volume"),
  muteBtnIcon = contents.querySelector(".mute-volume span"),
  volumeUpBtn = contents.querySelector(".volume-up"),
  volumeSlider = contents.querySelector("#volume-control-slider");
  currentTime = contents.querySelector("#current-time"),
  remainingTime = contents.querySelector("#remaining-time"),
  albumArt = contents.querySelector(".album-art img"),
  timeSeekBar = contents.querySelector("#track-seek-bar");

options = {
  container: "#waveform",
  waveColor: "#b5b7b8", //"#b5b7b8"
  progressColor: "#00000",
  height: 50,
  barWidth: 2,
  barHeight: 1,
  responsive: true,
  hideScrollbar: true,
  cursorWidth: 0,
  interact: true,
  barRadius: 3,
  // autoplay: true,
  backend:"MediaElementWebAudio",
  minPxPerSec: 100,
  mediaControls: false,
  // sampleRate: 8000,
  autoScroll: true,
  autoCenter: true,
  audioRate: 1,
  normalize: 0,
};
 
document.addEventListener("DOMContentLoaded", function () {
  var index = 0;
  var isRepeat = 0;
  var shuffledArray = playList.slice();
  var defaultTrackArt = "./assets/images/default-icon.png";
  var wavesurfer = WaveSurfer.create(options);

  navigator.mediaSession = navigator.mediaSession || {};
  navigator.mediaSession.setActionHandler = navigator.mediaSession.setActionHandler || function () {};
  window.MediaMetadata = window.MediaMetadata || function () {};

  wavesurfer.load(shuffledArray[index].path);

  wavesurfer.on('pause', function () {
    playPauseBtnIcon.innerHTML = "play_arrow";
  });
  
  wavesurfer.on('play', function () {
    playPauseBtnIcon.innerHTML = "pause";
  });

  function PlayPause() {
    wavesurfer.on("ready", () => {
      readMediatag();    
      currentTime.innerText = formatTime(0);
      remainingTime.innerText = formatTime(wavesurfer.getDuration());
      wavesurfer.play();
      playPauseBtn.onclick = function () {
        if (!wavesurfer.isPlaying()) {
          wavesurfer.playPause();
        }else{
          wavesurfer.playPause();
        }};
    });
  }
  PlayPause();
  
  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60),
    seconds = Math.floor(seconds % 60);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  
  function seekBarTimer(){
    wavesurfer.on("audioprocess", () => {
      seekBar.value = Math.floor(wavesurfer.getCurrentTime());
      seekBar.max = Math.floor(wavesurfer.getDuration());
      currentTime.innerText = formatTime(Math.floor(wavesurfer.getCurrentTime()).toFixed(1));
      remainingTime.innerText = formatTime(Math.floor(wavesurfer.getDuration())-Math.floor(wavesurfer.getCurrentTime()).toFixed(1));
  })}
  seekBarTimer();

  function setTimeStamp(){
    timeSeekBar.addEventListener("input",()=>{
      // wavesurfer.setTime(timeSeekBar.value);
      wavesurfer.seekTo(timeSeekBar.value /wavesurfer.getDuration());
    });
    timeSeekBar.addEventListener("mousemove",()=>{
      // console.log(timeSeekBar.value);
    });

  }setTimeStamp();

  function Repeat(){
    repeatBtn.onclick = function () {
      isRepeat++;
      switch (isRepeat%3){
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
    };
  }Repeat();

  function prevNextTrack(){

    nextBtn.onclick = function () {
      index = (index+1 >= playList.length) ? 0 : index+1 ;
      wavesurfer.load(shuffledArray[index].path);
      PlayPause();
    };
    
    prevBtn.onclick = function () {
      index = (index-1 < 0) ? playList.length - 1 : index-1 ;
      wavesurfer.load(shuffledArray[index].path);
      PlayPause();
    };

    navigator.mediaSession.setActionHandler('previoustrack', function () {
      index = (index-1 < 0) ? playList.length - 1 : index-1 ;
      wavesurfer.load(shuffledArray[index].path);
      PlayPause();
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
      index = (index+1 >= playList.length) ? 0 : index+1 ;
      wavesurfer.load(shuffledArray[index].path);
      PlayPause();
    });

  }prevNextTrack();
  

  function changeVolume(){
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

    volumeSlider.addEventListener("input",()=>{
      muteBtnIcon.innerHTML = (volumeSlider.value != 0)?"volume_down":"no_sound";
      wavesurfer.setVolume(volumeSlider.value / 100);
      curentVolume = volumeSlider.value / 100;
    });

  }changeVolume();

  function onFinish(){
    wavesurfer.on("finish", function () {
      switch(isRepeat%3){
        case 1:
          index = (index+1 >= playList.length) ? 0 : index+1 ;
          wavesurfer.load(shuffledArray[index].path);
          PlayPause();
          break;
        case 2:
          wavesurfer.play();
          break;
        default:
          index = (index+1 >= playList.length) ? 0 : index+1 ;
          if(index != 0){
            wavesurfer.load(shuffledArray[index].path);
            PlayPause();
          }else{
            wavesurfer.load(shuffledArray[index].path);
            wavesurfer.on("ready", () => {
              wavesurfer.pause();
              currentTime.innerText = formatTime(0);
              remainingTime.innerText = formatTime(wavesurfer.getDuration());
            });
          }
      }
    });
  }onFinish();

  function visiblePlaylist(){
    albumArt.onclick = function () {
      document.querySelector(".sidebar").classList.toggle("active");
    };
    document.querySelector(".sidebar .sidebar-overlay").onclick = function(){
      document.querySelector(".sidebar").classList.remove("active");
    };
    document.querySelector(".sidebar .sidebar-content").onclick = function(){
      document.querySelector(".sidebar").classList.remove("active");
    };
    
    for (var i = 0; i < playList.length; i++) {
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
      jsmediatags.read(remainingUrl + shuffledArray[i].path, {
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
          }
          var addtr = document.createElement("tr");
          var tr = '<tr><td><div class="tbody-playlist"><img src="'+base64+'" alt="" style="height: 40px;width: 40px;"><div class="track"><div id="track-name">'+tags.title+'</div><div id="track-artist">'+tags.artist+'</div></div></div></td></tr>'
          addtr.innerHTML = tr;
          var table = document.querySelector(".tbody");
          table.append(addtr);
        },
        onError: function (error) {
          console.log(error);
        },
      }); 
    }
  }visiblePlaylist();

  function shufflePlayList(){
    isShuffle = false;
    ShuffleBtn.onclick = function () {
      if (isShuffle) {
        ShuffleBtnIcon.style.color = "#4d4d4d";
        curTrack = shuffledArray[index].name;
        shuffledArray = playList.slice();
        index = shuffledArray.findIndex(function (item, i) {
          return item.name === curTrack;
        });
      } else {
        ShuffleBtnIcon.style.color = "#4676f9";
        curTrack = shuffledArray[index].name;
        shuffledArray = shuffleArray(shuffledArray);
        index = shuffledArray.findIndex(function (item, i) {
          return item.name === curTrack;
        });
      }
      isShuffle = !isShuffle;
    };
  }shufflePlayList();
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function readMediatag() {
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
          trackArt.src = base64;
          bgArtwork.style.backgroundImage = "url('" + base64 + "')";
        } else {
          trackArt.src = defaultTrackArt;
          bgArtwork.style.backgroundImage = "url('" + defaultTrackArt + "')";
        }

        if (tags.title) {
            // trackName.innerHTML = tags.title;
            trackName.innerHTML = tags.title.length>24 ? tags.title : tags.title+"<br></br>" ;
        } else {
          trackName.innerHTML = "Unknow";
        }

        if (tags.artist) {
          trackArtist.innerHTML = tags.artist;
        } else {
          trackArtist.innerHTML = "Unknow";
        }

        if (tags.album) {
          trackAlbum.innerHTML = tags.album;
        } else {
          trackAlbum.innerHTML = "Unknow";
        }
        navigator.mediaSession.metadata = new MediaMetadata({
          title: tags.title,
          artist: tags.artist,
          album: tags.album,
          artwork: tags.artwork
        });

      },
      onError: function (error) {
        console.log(error);
      },
    });
  };
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////

  wavesurfer.on('error', function(e) {
    console.log(e);
    error.innerText = e.toString();
    })

////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
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
