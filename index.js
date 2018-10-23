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
    duration:.15,
    setup:function(){
        // Create scene and get width and height
        app.scene = new THREE.Scene(); 
        app.width = window.innerWidth;
        app.height = window.innerHeight*.8;

        // Create and set camera
        var aspect = app.width/app.height;
        var d = app.d;
        app.camera = new THREE.OrthographicCamera(-d*aspect,d*aspect,d,-d,.1,1000); 
        app.camera.position.set(-d,d,d);
        app.camera.lookAt(app.scene.position);
        app.camera.rotation.z = Math.PI;
        app.scene.add(app.camera);

        // Create and set renderer
        app.canvas = document.getElementById("canvas");
        app.renderer = new THREE.WebGLRenderer({
            antialias:true,
            canvas:app.canvas
        });
        app.renderer.setClearColor( 0x000000);
        app.renderer.setSize(app.height,app.height);

        // Create and set lights
        var light = new THREE.AmbientLight( 0x404040 ); 
        app.scene.add( light );
        app.hemisphereLight = new THREE.HemisphereLight(0xffffff,0x000000);
        app.hemisphereLight.position.z = d/2;
        app.hemisphereLight.position.x = d/4;
        app.scene.add(app.hemisphereLight);

        // Create sections
        app.world = new THREE.Group();
        for(var i in sections){
            app.sectionConstructors.push(objects.section(
                sections[i].object,
                sections[i].floor
            ));
            app.sectionConstructors[i](app.world);
            app.world.children[i].position.y -= 4*i*objects.tileDim;
        }
        app.world.position.x -=objects.tileDim*4;
        app.world.position.y -=objects.tileDim;
        app.scene.add(app.world);

        // We create a player and add controls to it
        app.character = objects.objects["character"][0];
        app.character.moveAnimation = {};
        // We lower the character so he collides with the ground
        app.character.model.position.z -=5;
        document.addEventListener("keydown",app.onKeyDown);

        // Save initial position
        app.initialPosition = Object.assign({},app.character.model.position);
        app.worldInitialPosition = Object.assign({},app.world.position);

        // Add Collision functions
        objects.createCollision("character","tree",app.characterAgainstTree);
        objects.createCollision("character","vehicule",app.characterAgainstVehicule);
        objects.createCollision("character","water",app.characterAgainstWater);
        console.log(objects.collisions);

        // run function keeps everything animated
        app.run();
    },
    onKeyDown:function(e){
        var values;
        var rvalues;
        var cvalues;
        var target = app.character.model.position;
        var rtarget = app.character.model.rotation;
        var target2 = app.world.position;
        if(e.key=="ArrowRight"){
            values = [{x:target.x},{x:target.x-objects.tileDim}];
            cvalues = [{x:target2.x},{x:target2.x+objects.tileDim}];
            rvalues = [{y:rtarget.y},{y:rtarget.y-Math.PI/2}];
        }
        if(e.key=="ArrowLeft"){
            values = [{x:target.x},{x:target.x+objects.tileDim}];
            cvalues = [{x:target2.x},{x:target2.x-objects.tileDim}];
            rvalues = [{y:rtarget.y},{y:rtarget.y+Math.PI/2}];
        }
        if(e.key=="ArrowUp"){
            values = [{y:target.y},{y:target.y-objects.tileDim}];
            cvalues = [{y:target2.y},{y:target2.y+objects.tileDim}];
            rvalues = [{x:rtarget.x},{x:rtarget.x-Math.PI/2}];
        }
        if(e.key=="ArrowDown"){
            values = [{y:target.y},{y:target.y+objects.tileDim}];
            cvalues = [{y:target2.y},{y:target2.y-objects.tileDim}];
            rvalues = [{x:rtarget.x},{x:rtarget.x+Math.PI/2}];
        }
        if(target && values && !app.character.moveAnimation.running){
            app.character.moveAnimation = new KF.KeyFrameAnimator;
            app.character.moveAnimation.init({
                interps:[{
                    keys:[0,1], 
                    values:values,
                    target:target
                },{
                    keys:[0,.5,1],
                    values:[{z:target.z},{z:target.z+objects.tileDim},{z:target.z}],
                    target:target
                },{
                    keys:[0,1],
                    values:rvalues,
                    target:rtarget
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
            // We add keyframe activity to our character on move
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
    characterAgainstTree:function(character,tree){
        console.log("tree");
        character.moveAnimation.stop();
        character.cameraAnimation.stop();
        app.snapToTile(character.model);
    },
    characterAgainstVehicule:function(character,vehicule){
        console.log("vehicule");
        app.characterDie();
    },
    characterAgainstWater:function(character,water){
        console.log("water");
        app.characterDie();
    },
    characterDie:function(){
        app.character.moveAnimation.stop();
        app.character.cameraAnimation.stop();

        app.character.model.rotation.set(0,0,0);
        app.character.model.position.x = app.initialPosition.x;
        app.character.model.position.y = app.initialPosition.y;
        app.character.model.position.z = app.initialPosition.z;

        app.world.position.x = app.worldInitialPosition.x;
        app.world.position.y = app.worldInitialPosition.y;
        app.world.position.z = app.worldInitialPosition.z;
    },
    snapToTile(model){
        model.rotation.set(0,0,0);

        model.position.x = Math.round(model.position.x/objects.tileDim)*objects.tileDim;
        model.position.y = Math.round(model.position.y/objects.tileDim)*objects.tileDim;
        model.position.z = app.initialPosition.z;

        app.world.position.x = Math.round(app.world.position.x/objects.tileDim)*objects.tileDim;
        app.world.position.y = Math.round(app.world.position.y/objects.tileDim)*objects.tileDim;
    }
}
document.addEventListener('DOMContentLoaded',app.setup);


// The controls add to the score
// A die function and a reset function, dies also resets the score
// We add collisions with vehicules as a way to die
// We add collision with trees as stopping any keyframe activity
// We register and replicate the sections
// We create the win reset condition when the score % number of steps forward
