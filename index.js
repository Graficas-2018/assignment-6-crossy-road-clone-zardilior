var sections = [];
sections[0] = {};
sections[0].floor = [
    "grass","grass","grass","grass","grass","grass",
    "road","road","road","road","road","road",
    "water","log","water","water","water","water",
    "grass","grass","grass","grass","grass","grass"
];
sections[0].object =  [
    "tree","tree","tree","","tree","tree",
    "vehicule","","","","vehicule","",
    "","","","","","",
    "tree","","","","tree","tree"
]
for(var i=1;i<5;i++){
    sections[i] = {};
    sections[i].object = Object.assign({},sections[0].object);
    sections[i].floor = Object.assign({},sections[0].floor);
}
sections[0].object[4+18]="character";

// We create our app with scene, camera, world and lights
var app = {
    d:200,
    sectionConstructors:[],
    world:null,
    stop:false,
    setup:function(){
        app.scene = new THREE.Scene(); 
        app.width = window.innerWidth;
        app.height = window.innerHeight*.8;
        var aspect = app.width/app.height;
        var d = app.d;
        app.camera = new THREE.OrthographicCamera(-d*aspect,d*aspect,d,-d,1,1000); 
        app.camera.position.set(-d/2,d,d/2);
        app.camera.lookAt(app.scene.position);
        app.camera.rotation.z = Math.PI;
        app.canvas = document.getElementById("canvas");
        console.log(app.canvas,document.getElementById('canvas'));
        app.renderer = new THREE.WebGLRenderer({
            antialias:true,
            canvas:app.canvas
        });
        var light = new THREE.AmbientLight( 0x404040 ); 
        app.scene.add( light );
        app.renderer.setClearColor( 0x000000);
        app.renderer.setSize(app.height,app.height);
        app.scene.add(app.camera);
        app.hemisphereLight = new THREE.HemisphereLight(0xffffff,0x000000);
        app.scene.add(app.hemisphereLight);

        // Create sections
        app.world = new THREE.Group();
        for(var i in sections){
            app.sectionConstructors.push(objects.section(
                sections[i].object,
                sections[i].floor
            ));
            app.sectionConstructors[i](app.world);
            app.world.children[i].position.y -= 4*i*50;
            console.log(app.world.children)
        }
        app.world.position.x -=d/4;
        app.world.position.y +=d/4;
        app.scene.add(app.world);

        // We create a player and add controls to it

        app.renderer.render( app.scene, app.camera );
        app.character = objects.objects["character"][0];
        document.addEventListener("keydown",app.onKeyDown);
        app.run();
    },
    onKeyDown:function(e){
        console.log(e.key);
        /*app.character.moveAnimation = new KF.KeyFrameAnimator;
        app.character.moveAnimation.init({
            interps:[{
                keys:[0,.5,1], 
                values:[{z:0},{z:Math.PI/4.5},{z:Math.PI/3}],
                target:target
            }],
            loop:true,
            duration:app.duration*1000,
            easing:TWEEN.Easing.Cubic.Out
        });
        app.character.moveAnimation.start();*/
    },
    run : function(){
        if( !app.stop )
             requestAnimationFrame(app.run);

        // Render the scene
        app.renderer.render( app.scene, app.camera );

        // Update the animations
        KF.update();

        for(let collision of object.collisions){
            collision();
        }
    },
}
document.addEventListener('DOMContentLoaded',app.setup);


// The controls add to the score
// A die function and a reset function, dies also resets the score
// We add collisions with vehicules as a way to die
// We add collision with trees as stopping any keyframe activity
// We add keyframe activity to our character on move
// We register and replicate the sections
// We create the win reset condition when the score % number of steps forward
