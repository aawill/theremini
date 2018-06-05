var pubnub = new PubNub({
    subscribeKey: 'sub-c-33edfb84-6861-11e8-847f-0e36953de9e2', 
    publishKey: 'pub-c-1faf5591-4729-4025-8ba1-cf4953039476' 
});

pubnub.addListener({
    message: function(m) {
        console.log(m.message);
        $('#received').text(m.message);
        osc1Shape = m.message.shape;
        if (typeof osc1 !== "undefined") {
            osc1.type = osc1Shape;
        }
        $("#shape1").text(m.message.text);
    }
});

pubnub.subscribe({ 
    channels: ['theremini'],
});

$(document).ready(function() {
    initializeAudio(220);
    $("#freqLabel1").html(Math.trunc(osc1Freq));
    $("#freqLabel2").html(Math.trunc(osc2Freq));
    $("#freqLabel3").html(Math.trunc(osc3Freq));
    $("#filterLabel1").html(Math.trunc(filter1Freq));
    $("#freqSlider1").val(logposition(osc1Freq));
    $("#freqSlider2").val(logposition(osc2Freq));
    $("#freqSlider3").val(logposition(osc3Freq));
    $("#filterSlider1").val(logposition(filter1Freq));
    $("#soundBut").click(function() {
        audioCtx.resume();
        if ($(this).hasClass("active")) {
            stopOscs();
            $(this).removeClass("active");
        }
        else {
            playOscs();
            $(this).addClass("active");
        }
    });
    $(".osc1Shape").click(function() {
        osc1Shape = this.name;
        if (typeof osc1 !== "undefined") {
            osc1.type = osc1Shape;
        }
        $("#shape1").text($(this).text());
    });
    $(".osc2Shape").click(function() {
        osc2Shape = this.name;
        if (typeof osc2 !== "undefined") {
            osc2.type = osc2Shape;
        }
        $("#shape2").text($(this).text());
    });
    $(".osc3Shape").click(function() {
        osc3Shape = this.name;
        if (typeof osc3 !== "undefined") {
            osc3.type = osc3Shape;
        }
        $("#shape3").text($(this).text());
    });
    $(".filter1Type").click(function() {
        filter1.type = this.name;
        $("#type1").text($(this).text());
    })
    $("#freqSlider1").on("input", function() {
        $("#freqLabel1").html(Math.trunc(logslider(this.value)));
        osc1Freq = logslider(this.value);
        if (typeof osc1 !== "undefined") {
            osc1.frequency.value = osc1Freq;
        }
    });
    $("#freqSlider2").on("input", function() {
        $("#freqLabel2").html(Math.trunc(logslider(this.value)));
        osc2Freq = logslider(this.value);
        if (typeof osc2 !== "undefined") {
            osc2.frequency.value = osc2Freq;
        }
    });
    $("#freqSlider3").on("input", function() {
        $("#freqLabel3").html(Math.trunc(logslider(this.value)));
        osc3Freq = logslider(this.value);
        if (typeof osc3 !== "undefined") {
            osc3.frequency.value = osc3Freq;
        }
    });
    $("#filterSlider1").on("input", function() {
        $("#filterLabel1").html(Math.trunc(logslider(this.value)));
        filter1.frequency.value = logslider(this.value);
    })
});  

function logslider(position) {
    var minp = 0;
    var maxp = 100;
    var minv = Math.log(20);
    var maxv = Math.log(20000);

    var scale = (maxv-minv) / (maxp-minp);
    return Math.exp(minv + scale*(position-minp));
}    

function logposition(value) {
    var minp = 0;
    var maxp = 100;
    var minv = Math.log(20);
    var maxv = Math.log(20000);

    var scale = (maxv-minv) / (maxp-minp);
    return (Math.log(value)-minv) / scale + minp;
}
    
function initializeAudio(freqIn) {
    var freq = freqIn;
    audioCtx = new (window.AudioContext || window.webkitAudioContext);
    volume = audioCtx.createGain();
    comp = audioCtx.createDynamicsCompressor();
    volume.connect(comp);
    comp.connect(audioCtx.destination);
    
    filter1Freq = 20000;
    filter1 = audioCtx.createBiquadFilter();
    filter1.connect(volume);
    filter1.type = "lowpass";
    filter1.frequency.value = filter1Freq;
    
    osc1Freq = freq;
    osc2Freq = freq * Math.pow(Math.pow(2, (1/12)), 7);
    osc3Freq = freq * 2;
    osc1Shape = "sine", osc2Shape = "sine", osc3Shape = "sine";
    
    var osc1 = audioCtx.createOscillator();
    osc1.frequency.value = osc1Freq;
    osc1.type = osc1Shape;
    var osc2 = audioCtx.createOscillator();
    osc2.frequency.value = osc2Freq;
    osc2.type = osc2Shape;
    var osc3 = audioCtx.createOscillator();
    osc3.frequency.value = osc3Freq;
    osc3.type = osc3Shape;
}
  
function playOscs() {
    osc1 = audioCtx.createOscillator();
    osc1.frequency.value = osc1Freq;
    osc1.type = osc1Shape;
    osc1.connect(filter1);
    osc2 = audioCtx.createOscillator();
    osc2.frequency.value = osc2Freq;
    osc2.type = osc2Shape;
    osc2.connect(filter1);
    osc3 = audioCtx.createOscillator();
    osc3.frequency.value = osc3Freq;
    osc3.type = osc3Shape;
    osc3.connect(filter1);
    osc1.start();
    osc2.start();
    osc3.start();
}
    
function stopOscs() {
    osc1.stop();
    osc2.stop();
    osc3.stop();
}    
