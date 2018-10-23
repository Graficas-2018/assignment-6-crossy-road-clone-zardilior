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
    duration:.1,
    setup:function(){
        app.scene = new THREE.Scene(); 
        app.width = window.innerWidth;
        app.height = window.innerHeight*.8;
        var aspect = app.width/app.height;
        var d = app.d;
        app.camera = new THREE.OrthographicCamera(-d*aspect,d*aspect,d,-d,.1,1000); 
        app.camera.position.set(-d,d,d);
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
        app.world.position.x -=d/1.5;
        app.world.position.y -=d/5;
        app.scene.add(app.world);

        // We create a player and add controls to it

        app.renderer.render( app.scene, app.camera );
        app.character = objects.objects["character"][0];
        app.character.moveAnimation = {};
        document.addEventListener("keydown",app.onKeyDown);
        app.run();
    },
    onKeyDown:function(e){
        var values;
        var cvalues;
        var target = app.character.model.position;
        var target2 = app.world.position;
        if(e.key=="ArrowRight"){
            values = [{x:target.x},{x:target.x-50}];
            cvalues = [{x:target2.x},{x:target2.x+50}];
        }
        if(e.key=="ArrowLeft"){
            values = [{x:target.x},{x:target.x+50}];
            cvalues = [{x:target2.x},{x:target2.x-50}];
        }
        if(e.key=="ArrowUp"){
            values = [{y:target.y},{y:target.y-50}];
            cvalues = [{y:target2.y},{y:target2.y+50}];
        }
        if(e.key=="ArrowDown"){
            values = [{y:target.y},{y:target.y+50}];
            cvalues = [{y:target2.y},{y:target2.y-50}];
        }
        console.log(app.character.moveAnimation);
        if(target && values && !app.character.moveAnimation.running){
            app.character.moveAnimation = new KF.KeyFrameAnimator;
            app.character.moveAnimation.init({
                interps:[{
                    keys:[0,1], 
                    values:values,
                    target:target
                }],
                loop:false,
                duration:app.duration*1000,
            });
            app.character.cameraAnimation = new KF.KeyFrameAnimator;
            app.character.cameraAnimation.init({
                interps:[{
                    keys:[0,1], 
                    values:cvalues,
                    target:target2
                }],
                loop:false,
                duration:app.duration*1000,
            });
            app.character.cameraAnimation.start();
            app.character.moveAnimation.start();
        }
    },
    run : function(){
        if( !app.stop )
             requestAnimationFrame(app.run);

        // Render the scene
        app.renderer.render( app.scene, app.camera );

        // Update the animations
        KF.update();

        for(let collision of objects.collisions){
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
