

var _isDown, _points, _r, _g, _rc;
    function onLoadEvent()
    {
      _points = new Array();
      _r = new DollarRecognizer();

      var canvas = document.getElementById('myCanvas');
      _g = canvas.getContext('2d');
      _g.fillStyle = "rgb(0,0,225)";
      _g.strokeStyle = "rgb(0,0,225)";
      _g.lineWidth = 3;
      _g.font = "16px Gentilis";
      _rc = getCanvasRect(canvas); // canvas rect on page
      _g.fillStyle = "rgb(255,255,136)";
      _g.fillRect(0, 0, _rc.width, 20);

      _isDown = false;
    }
    function getCanvasRect(canvas)
    {
      var w = canvas.width;
      var h = canvas.height;

      var cx = canvas.offsetLeft;
      var cy = canvas.offsetTop;
      while (canvas.offsetParent != null)
      {
        canvas = canvas.offsetParent;
        cx += canvas.offsetLeft;
        cy += canvas.offsetTop;
      }
      return {x: cx, y: cy, width: w, height: h};
    }
    function getScrollY()
    {
      var scrollY = 0;
      // if (typeof(document.body.parentElement) != 'undefined')
      // {
      //   scrollY = document.body.parentElement.scrollTop; // IE
      // }
      // else if (typeof(window.pageYOffset) != 'undefined')
      // {
        scrollY = window.pageYOffset; // FF
      // }
      return scrollY;
    }
    //
    // Mouse Events
    //
    function mouseDownEvent(x, y)
    {
      document.onselectstart = function() { return false; } // disable drag-select
      document.onmousedown = function() { return false; } // disable drag-select
      _isDown = true;
      x -= _rc.x;
      y -= _rc.y - getScrollY();
      if (_points.length > 0)
        _g.clearRect(0, 0, _rc.width, _rc.height);
      _points.length = 1; // clear
      _points[0] = new Point(x, y);
      drawText("Recording unistroke...");
      _g.fillRect(x - 4, y - 3, 9, 9);
    }
    function mouseMoveEvent(x, y)
    {
      if (_isDown)
      {
        x -= _rc.x;
        y -= _rc.y - getScrollY();
        _points[_points.length] = new Point(x, y); // append
        drawConnectedPoint(_points.length - 2, _points.length - 1);
      }
    }
    function mouseUpEvent(x, y)
    {
      document.onselectstart = function() { return true; } // enable drag-select
      document.onmousedown = function() { return true; } // enable drag-select
      if (_isDown)
      {
        _isDown = false;
        if (_points.length >= 10)
        {
          var result = _r.Recognize(_points, document.getElementById('useProtractor').checked);
          drawText("Result: " + result.Name);
          controlVideo(result.Name); 
          
        }
        else // fewer than 10 points were inputted
        {
          drawText("Too few points made. Please try again.");
        }
      }
    }

    //not real
    // function controlVideoAction(){
    //   if result=rectangle{
    //     video.play();
    //   }
    // }

    function controlVideo(gesture){
      switch(gesture){
        case "Play/Pause":
        pausePlay(); 
        break; 

        case "Mute/Unmute":
        muteUnmute(); 
        break; 

        case "Volume Up":
        changeVolume(.2); 
        break; 

        case "Volume Down":
        changeVolume(-.2); 
        break; 

        case "Increase Size":
        changeSize(50); 
        break; 

        case"Decrease Size":
        changeSize(-50); 
        break; 

        case "Make Fast":
        changePlayback(.2); 
        break; 

        case "Make Slow":
        changePlayback(-.2);
        break; 

        case "Fast Forward":
        changeSeek(30);
        break; 

        case "Rewind":
        changeSeek(-30);
        break; 

        default:
        document.getElementById('video').pause(); 
      }

    }

    function pausePlay(){
      var video=document.getElementById('video'); 
      if(video.paused){
        document.getElementById('video').play(); 
      }else{
        document.getElementById('video').pause(); 
      }
    }

    function muteUnmute(){
      var video = document.getElementById('video'); 
      if(video.muted){
        document.getElementById('video').muted=false; 
      }else{
        document.getElementById('video').muted=true; 
      }
    }

    function changeVolume(val){
      var video = document.getElementById('video')
      var videoVolume = video.volume; 
      videoVolume += val;
      if(video.muted==true && val > 0){
        document.getElementById('video').muted=false; 
        document.getElementById('video').volume=videoVolume; 
      }else if(videoVolume >= 0 && videoVolume <= 1){
        document.getElementById('video').volume = videoVolume;
      }else{
        document.getElementById('video').volume = (videoVolume < 0) ? 0 : 1;
      }


      // if(videoVolume >= 0 && videoVolume <= 1){
      //   document.getElementById('video').volume = videoVolume; 
      // }else if(videoVolume == 0){
      //   // 
      //   if(video.muted){
      //     document.getElementById('video').muted=false
      //   }
      // }
    }

    //this is the one function i need to really check. 
    function changeSize(val){
      var videoSize = document.getElementById('video').height; 
      videoSize += val; 
      document.getElementById('video').height = videoSize; 

    }

    function changeSeek(val){
      var videoSeek = document.getElementById('video').currentTime;
      videoSeek += val; 
      document.getElementById('video').currentTime = videoSeek; 
    }

    function changePlayback(val){
      var videoRate = document.getElementById('video').playbackRate;
      videoRate += val; 
      document.getElementById('video').playbackRate = videoRate; 
    }





    function drawText(str)
    {
      _g.fillStyle = "rgb(255,255,136)";
      _g.fillRect(0, 0, _rc.width, 20);
      _g.fillStyle = "rgb(0,0,255)";
      _g.fillText(str, 1, 14);
    }
    function drawConnectedPoint(from, to)
    {
      _g.beginPath();
      _g.moveTo(_points[from].X, _points[from].Y);
      _g.lineTo(_points[to].X, _points[to].Y);
      _g.closePath();
      _g.stroke();
    }
    function round(n, d) // round 'n' to 'd' decimals
    {
      d = Math.pow(10, d);
      return Math.round(n * d) / d
    }
    //
    // Unistroke Adding and Clearing
    //
    function onClickAddExisting()
    {
      if (_points.length >= 10)
      {
        var unistrokes = document.getElementById('unistrokes');
        var name = unistrokes[unistrokes.selectedIndex].value;
        var num = _r.AddGesture(name, _points);
        drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
      }
    }
    function onClickAddCustom()
    {
      var name = document.getElementById('custom').value;
      if (_points.length >= 10 && name.length > 0)
      {
        var num = _r.AddGesture(name, _points);
        drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
      }
    }
    function onClickCustom()
    {
      document.getElementById('custom').select();
    }
    function onClickDelete()
    {
      var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
      alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
    }


  // -->