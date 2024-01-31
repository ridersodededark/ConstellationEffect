"use strict";
//Create maximum variables outside the class to increase the performance.
//@ Instead of defining  object.prototype.function it is 1000% recommendd to crste function directly indide it.
//*Tip:- Those variable which wont change keeo it outside the class like fillstyle,width,heights etc.
const canvas1 = document.getElementById("canvas1");
console.dir(canvas1);
const ctx = canvas1.getContext("2d");
ctx.fillStyle = "red";
//Basically  stroke width.
//Covering the whole window with canvas.
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;

//MAke class as independent as possible from surrounding code
//Particle Class: -To create and draw particles
class Particles {
    constructor(effect) {
        this.effect = effect; //@This allow us to access the below class "Effect"
        this.x = Math.random() * this.effect.width; //Effected area width and height.
        this.y = Math.random() * this.effect.height;
        this.radius = 10;
        this.vx = Math.random() * 2;
        this.vy = Math.random() * 2;
    }

    //! Drawing
    draw(context) {
        context.fillStyle = `hsl(${this.x * 0.5},100%,50%)`; //Perfect brightness combination.
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); //This only defines the path.
        // context.closePath(); //Not required as we are using context.fill
        context.fill();
        context.strokeStyle = "black";
        context.lineWidth = 0.85;
        context.stroke(); //to outline
        //


    }

    //!Move
    update() {
        if (this.effect.mouse.pressed) {
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            if (distance < this.effect.mouse.radius) {
                const angle = Math.atan2(dy, dx); //First write dy not dx according to the formualt tan=perpendicula/base.
                this.x += Math.cos(angle) * 20; //Multiple by 10 to amplify the effect.
                this.y += Math.sin(angle) * 20;
                setInterval(function () {
                    this.effect.style.backgroundColor = "red";

                }, 1000)


            }
        }



        this.x += this.vx; //Move then draw
        this.y += this.vy;
        if (this.x >= canvas1.width - this.radius) this.vx = -this.vx;
        else if (this.x <= 0) this.vx = -this.vx;
        if (this.y >= canvas1.height) this.vy = -this.vy;
        else if (this.y <= 0) this.vy = -this.vy;


    }

}

const Particle1 = new Particles(canvas1);
//@ Particle1 will only call "Constructor" function but draw() and update() need to be called separetly.
console.log(Particle1);

//Effect(Brain of code): Stores helper methods and custom settings
class Effects {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [] //THis eomty array will store all the particles here.
        this.numberOfParticles = 400;
        this.createParticles(); //Automatically creates 20 particles as soon as Effect class is called to create its object.
        this.mouse = { //Initially set to 0,0 values
            x: 0,
            y: 0,
            pressed: false, //"Mouse key STatus": Initially no one presses the key that's why it is set to false.
            radius: 200,
        }
        window.addEventListener("mousemove", (e) => { //If you use conventional functions then you will see errors on the screen
            if (this.mouse.pressed) { //* Brilliantly setting the values of x and y with this logic
                this.mouse.x = e.x;
                this.mouse.y = e.y; //@If pressed then only these values are equal.



            };
            console.log(e.x, this.mouse.x);

        });
        window.addEventListener("mousedown", (e) => { //If you use conventional functions then you will see errors on the screen
            this.mouse.pressed = true;
            this.mouse.x = e.x; //* As the mouse is pressed then assign immmediately x and y to e.x and e.y
            this.mouse.y = e.y;
            console.log(this.mouse.x, this.mouse.y);




        });
        window.addEventListener("mouseup", (e) => { //If you use conventional functions then you will see errors on the screen
            this.mouse.pressed = false;
        });

    }

    //!Creating particles
    //Filling empty array with these particles.Automatically runs once you create the object.
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particles(this)); //"this" refers to the Object so created by "Effects" class.
            //Inside prototype you will find this class "Particles"
            //Above push dosent give any name to objects.
        }
    }

    //@ VVVVIP:- Drawing drawn first is drawn first then drawing drawn latter is drawn over previous drawing.
    //!Drawing the particles
    handleParticles(context) {
        this.connectedParticles(context)//Calling below function why??
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        })
    }

    //@ Below code is very important to find distance between two particles. Industry Standard.Used a lot in 2d games.
    //! Connects Near by particles.---Finding distance between two particles
    connectedParticles(context) {
        const maxDistance = 80;
        for (let a = 0; a < this.numberOfParticles; a++) { //comparing every particles
            for (let b = a; b < this.numberOfParticles; b++) { //comparing every other particles amongst each other.
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    //Drawing line
                    context.save(); //Save and restore make sures it is only applied at these below line of code ONLY.
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.strokeStyle = "red";
                    context.lineWidth = 2.5;

                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y); //Starting points of the line
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke(); //*All four steps are required.
                    context.restore();

                }

            }
        }
    }
}

const effect1 = new Effects(canvas1); //ANy NAN and undefined value on console we can realize it as potential error.    
console.log(effect1);
function update() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    effect1.handleParticles(ctx);



    requestAnimationFrame(update);
}
update();




//@  When drawing a circle using ctx.arc() and filling it with ctx.fill(),
//@ you don't explicitly need ctx.closePath().