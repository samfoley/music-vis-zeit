import Proton from 'proton-js';

export default class Visualisation {
    
    constructor(canvas) {
        this.canvas = canvas;   
        
        this.proton = new Proton();
        this.intensityEmitter = new Proton.Emitter();
        this.intensityColor = new Proton.Color('random');
        this.intensityVelocity = new Proton.Velocity(new Proton.Span(1), new Proton.Span(0, 360), 'polar');
        this.intensityRepulsion = new Proton.Repulsion({x: 300, y: 300}, 10, 300);                        
        this.beat = 0;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.createIntensityEmitter();
        
        this.proton.addRenderer(this.createRenderer());
        this.destroy = false;
        requestAnimationFrame(() => this.draw());
    }

    destroy() {  
        this.destroy = true;      
        proton.destroy();
    }

    createIntensityEmitter() {        
        const intensityEmitter = this.intensityEmitter;
        const canvas = this.canvas;

        intensityEmitter.damping = 0.008;        
        intensityEmitter.addInitialize(new Proton.Mass(1));
        intensityEmitter.addInitialize(new Proton.Radius(4));        
        intensityEmitter.addInitialize(new Proton.Life(0.1, 6));
        let mouseObj = {
            x: 1003 / 2,
            y: 610 / 2
        };
        let attractionBehaviour = new Proton.Attraction(mouseObj, 0, 0);
        let crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(0, 0, canvas.width, canvas.height), 'cross');
        //emitter.addBehaviour(new Proton.Color(rgbToHex(intensity*255,0,0)));        
        const hue = Math.floor(Math.random()*360);
        
        this.addRepulsionBehaviours();
        intensityEmitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
        intensityEmitter.addBehaviour(new Proton.RandomDrift(10, 10, .05));
        intensityEmitter.p.x = canvas.width / 2;
        intensityEmitter.p.y = canvas.height / 2;
        
        this.proton.addEmitter(intensityEmitter);         
        
        intensityEmitter.addInitialize(this.intensityVelocity);        
        intensityEmitter.addBehaviour(this.intensityColor);
        intensityEmitter.emit();    
    }

    addRepulsionBehaviours() {
        var total = 12;
        var d = 360 / total;
        var R = 430;
        for (var i = 0; i < 360; i += d) {
            var x = R * Math.cos(i * Math.PI / 180);
            var y = R * Math.sin(i * Math.PI / 180);
            this.intensityEmitter.addBehaviour(new Proton.Attraction({
                x: x + this.canvas.width / 2,
                y: y + this.canvas.height / 2
            }, 10, 300));
        }     
        this.intensityEmitter.addBehaviour(this.intensityRepulsion);                
    }

    createRenderer() {        
        const renderer = new Proton.CanvasRenderer(this.canvas);
        const context = this.canvas.getContext('2d');
        renderer.onProtonUpdate = () => {                        
            context.fillStyle = "rgba(0, 0, 0, 0.05)";
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        };
        renderer.onParticleUpdate = (particle) => {
            
            context.beginPath();
            context.strokeStyle = particle.color;
            
            context.lineWidth = 1;
            context.moveTo(particle.old.p.x, particle.old.p.y);
            context.lineTo(particle.p.x, particle.p.y);
            context.closePath();
            context.stroke();            
            
        };
        return renderer;
    }

    draw() {
        if(this.destroy == false) requestAnimationFrame(() => this.draw());        
        this.proton.update();              
    }

  
    doIntensity(intensity) {                
        if(intensity>1) intensity=1;                        
        this.beat++;

        this.intensityEmitter.rate = new Proton.Rate(Math.log(1+intensity)*400);        
        this.intensityVelocity.reset(new Proton.Span(2*intensity), new Proton.Span(0, 360), 'polar');        
        const intensityPct = Math.floor(intensity*intensity*80)+20;
        const hue = Math.floor(Math.random()*360);
        
        this.intensityColor.reset(`hsl(${hue}, 100%, ${intensityPct}%)`);             
        this.intensityRepulsion.reset({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }, 10+intensity*10, 300);
        this.intensityEmitter.p.x = this.canvas.width/2 - 30 + (this.beat%4)*20;
        this.intensityEmitter.emit('once');                      
    }

    doOnset(intensity) {
        if(intensity>1) intensity=1;  

        this.intensityEmitter.rate = new Proton.Rate(Math.log(1+intensity)*20);        
        this.intensityVelocity.reset(new Proton.Span(5*intensity), new Proton.Span(0, 360), 'polar');        
        const intensityPct = Math.floor(intensity*intensity*80)+20;
        const hue = Math.floor(Math.random()*360);
        
        this.intensityColor.reset(`hsl(${hue}, 100%, ${intensityPct}%)`);             
        this.intensityRepulsion.reset({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }, 10+intensity*10, 300);
        this.intensityEmitter.p.x = this.canvas.width/2;
        this.intensityEmitter.emit('once');   
    }
}
