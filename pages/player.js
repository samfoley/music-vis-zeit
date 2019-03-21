import Header from '../components/header'
import Songs from '../src/songs'
//import Visualisation from '../src/visualisation'
import './style.css'

import {withRouter} from 'next/router'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react';



var audioElement = null;
var audioCtx;
var analyser;
var bufferLength;
var currentFrame;
var previousFrame;
var timeData;
var delayNode;
var fluxBuffer = new Array(11);
fluxBuffer.fill(0);
var rmsBuffer = new Array(11);
rmsBuffer.fill(0);
var fluxIndex = 0;
var maxFlux = 1;
var visualiser;
var rmsPeak = false;
var rmsPeakTime = 0;
var rmsMax = 0;

async function initVisualisation(audioRef, visRef) {    
    audioElement = audioRef.current;
    const VisualisationModule = await import('../src/visualisation');    
    visualiser = new VisualisationModule.default(visRef.current);    
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    delayNode = audioCtx.createDelay(1);
    analyser.fftSize = 1024;
    bufferLength = analyser.frequencyBinCount;
    currentFrame = new Float32Array(bufferLength);
    previousFrame = new Float32Array(bufferLength);
    timeData = new Float32Array(bufferLength);
    var source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    delayNode.delayTime.value = 0.116;
    source.connect(delayNode);
    delayNode.connect(audioCtx.destination);
}

function doPlay() {    
    if(audioElement==null || audioElement.paused) return {intensity: 0, minor: 1};

    previousFrame.set(currentFrame);
    analyser.getFloatFrequencyData(currentFrame);
    analyser.getFloatTimeDomainData(timeData);
    let flux = 0;
    for(let i = 0; i<bufferLength/4; i++) {
        let x = currentFrame[i+1*bufferLength/4]-previousFrame[i+1*bufferLength/4];
        if(x>0) flux += x;
    }
    let rms = Math.sqrt(timeData.reduce((acc, x) => (acc + x*x), 0));
    rmsBuffer[fluxIndex] = rms;
    fluxBuffer[fluxIndex] = flux;

    fluxIndex = (fluxIndex+1)%fluxBuffer.length;
    let threshold = fluxBuffer.reduce((acc,x) => (acc+x))/fluxBuffer.length*1.5;

    let previousFlux = fluxBuffer[(fluxIndex-5+11)%11];
    if(previousFlux > threshold) {        
        maxFlux = Math.max(maxFlux, previousFlux);
        
        visualiser.doOnset(previousFlux/500);
    }

    
    rms = rmsBuffer[(fluxIndex-5+11)%11];
    let rmsPrev = rmsBuffer[(fluxIndex-10+11)%11];
    rmsMax = Math.max(rms, rmsMax);
    if(rms>(rmsMax*0.5) && rmsPeak == false) {
        rmsPeak = true;
        var now = Date.now();
        console.log('rpm '+1/((Date.now()-rmsPeakTime)/1000)*60);
        rmsPeakTime = now;
        visualiser.doIntensity(rms/15);                    
    } 
    //rmsMax *= 0.8;
    
    if(rms<rmsPrev) {
        rmsPeak = false;        
    }
    setTimeout(doPlay, 23);

}

 class Player extends React.Component {
     constructor(props) {
        super(props);
     
        this.name = props.router.query.name;
        this.songs = new Songs();
        this.title = this.songs.getSongTitle(this.name);
        this.audioRef = React.createRef();
        this.visRef = React.createRef();
    }

    componentDidMount() {
        initVisualisation(this.audioRef, this.visRef);
    }

    render() {
        return (
            <div className="player">
                <canvas className="Visualisation" ref={this.visRef}></canvas>
                <Header />
                <main>
                    <h1>{this.title}</h1>
                    
                    <audio ref={this.audioRef} onPlay={doPlay} controls>
                        <source src={`/static/${this.name}.mp3`} type="audio/mpeg" />                
                    </audio>
                </main>
            </div>
        )
    }
}

export default withRouter(Player);