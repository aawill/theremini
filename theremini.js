var pubnub = new PubNub({
    subscribeKey: 'sub-c-33edfb84-6861-11e8-847f-0e36953de9e2', 
    publishKey: 'pub-c-1faf5591-4729-4025-8ba1-cf4953039476' 
});

/*pubnub.addListener({
    message: function(m) {
        parseMessage(m.message);
    }
});

pubnub.subscribe({ 
    channels: ['theremini'],
});*/

function parseMessage(message) {
    if (message.type == 'shape') {
        switch(message.osc) {
            case 'osc1':
                osc1Shape = message.shape;
                $('#shape1').text(message.shape);
                if (typeof osc1 !== 'undefined') {
                    osc1.type = osc1Shape;
                }
                break;
            case 'osc2':
                osc2Shape = message.shape;
                $('#shape2').text(message.shape);
                if (typeof osc2 !== 'undefined') {
                    osc2.type = osc2Shape;
                }
                break;
            case 'osc3':
                osc3Shape = message.shape;
                $('#shape3').text(message.shape);
                if (typeof osc3 !== 'undefined') {
                    osc3.type = osc3Shape;
                }
        }
    }
    else if (message.type == 'freq') {
        switch(message.osc) {
            case 'osc1':
                osc1Freq = logslider(message.value);
                $('#freqLabel1').html(Math.trunc(osc1Freq));
                $('#freqSlider1').val(logposition(osc1Freq));
                if (typeof osc1 !== 'undefined') {
                    osc1.frequency.value = osc1Freq;
                }
                break;
            case 'osc2':
                osc2Freq = logslider(message.value);
                $('#freqLabel2').html(Math.trunc(osc2Freq));
                if (typeof osc2 !== 'undefined') {
                    osc2.frequency.value = osc2Freq;
                }
                break;
            case 'osc3':
                osc3Freq = logslider(message.value);
                $('#freqLabel3').html(Math.trunc(osc3Freq));
                if (typeof osc3 !== 'undefined') {
                    osc3.frequency.value = osc3Freq;
                }
        }
    }
}

$(document).ready(function() {
    initializeAudio(220);
    $('#freqLabel1').html(Math.trunc(osc1Freq));
    $('#freqLabel2').html(Math.trunc(osc2Freq));
    $('#freqLabel3').html(Math.trunc(osc3Freq));
    $('#filterLabel1').html(Math.trunc(filter1Freq));
    $('#freqSlider1').val(logposition(osc1Freq));
    $('#freqSlider2').val(logposition(osc2Freq));
    $('#freqSlider3').val(logposition(osc3Freq));
    $('#filterSlider1').val(logposition(filter1Freq));
    $('#soundBut').click(function() {
        audioCtx.resume();
        if ($(this).hasClass('active')) {
            stopOscs();
            $(this).removeClass('active');
        }
        else {
            playOscs();
            $(this).addClass('active');
        }
    });
    $('.oscShape').click(function() {
        switch(this.name) {
            case 'osc1':
                osc1Shape = $(this).text().toLowerCase();
                $('#shape1').text($(this).text());
                if (typeof osc1 !== 'undefined') {
                    osc1.type = osc1Shape;
                }
                break;
            case 'osc2':
                osc2Shape = $(this).text().toLowerCase();
                $('#shape2').text($(this).text());
                if (typeof osc2 !== 'undefined') {
                    osc2.type = osc2Shape;
                }
                break;
            case 'osc3':
                osc3Shape = $(this).text().toLowerCase();
                $('#shape3').text($(this).text());
                if (typeof osc3 !== 'undefined') {
                    osc3.type = osc3Shape;
                }
        }
        /*pubnub.publish({
            message: {
                type: 'shape',
                osc: this.name, 
                shape: $(this).text()
            },
            channel: 'theremini'
        });*/
    });
    $('.freqSlider').on('input', function() {
        switch(this.name) {
            case 'osc1':
                osc1Freq = logslider(this.value);
                $('#freqLabel1').html(Math.trunc(osc1Freq));
                if (typeof osc1 !== 'undefined') {
                    osc1.frequency.value = osc1Freq;
                }
                break;
            case 'osc2':
                osc2Freq = logslider(this.value);
                $('#freqLabel2').html(Math.trunc(osc2Freq));
                if (typeof osc2 !== 'undefined') {
                    osc2.frequency.value = osc2Freq;
                }
                break;
            case 'osc3':
                osc3Freq = logslider(this.value);
                $('#freqLabel3').html(Math.trunc(osc3Freq));
                if (typeof osc3 !== 'undefined') {
                    osc3.frequency.value = osc3Freq;
                }
        }
        /*pubnub.publish({
            message: {
                type: 'freq',
                osc: this.name,
                value: this.value
            },
            channel: 'theremini'
        });*/
    });
    $('.filter1Type').click(function() {
        filter1.type = this.name;
        $('#type1').text($(this).text());
    })
    $('#filterSlider1').on('input', function() {
        $('#filterLabel1').html(Math.trunc(logslider(this.value)));
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
    filter1.type = 'lowpass';
    filter1.frequency.value = filter1Freq;
    
    osc1Freq = freq;
    osc2Freq = freq * Math.pow(Math.pow(2, (1/12)), 7);
    osc3Freq = freq * 2;
    osc1Shape = 'sine', osc2Shape = 'sine', osc3Shape = 'sine';
    
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
