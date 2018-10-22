var sectionOne = {};
sectionOne.floor = [
    "grass","grass","grass","grass","grass","grass",
    "road","road","road","road","road","road",
    "water","log","water","water","water","water",
    "grass","grass","grass","grass","grass","grass"
];
sectionOne.object =  [
    "tree","tree","","character","tree","tree",
    "vehicule","","vehicule","","","",
    "","","","","","",
    "tree","","","tree","tree","tree"
]
// We create our app with scene, camera, world and lights
var app = {
    d:200,
    sectionConstructors:[],
    setup:function(){
        app.scene = new THREE.Scene(); 
        app.width = window.innerWidth;
        app.height = window.innerHeight*.8;
        var aspect = app.width/app.height;
        var d = app.d;
        app.camera = new THREE.OrthographicCamera(-d*aspect,d*aspect,d,-d,1,1000); 
        app.camera.position.set(d,d,d);
        app.camera.lookAt(app.scene.position);
        app.canvas = document.getElementById("canvas");
        console.log(app.canvas,document.getElementById('canvas'));
        app.renderer = new THREE.WebGLRenderer({
            antialias:true,
            canvas:app.canvas
        });
        app.renderer.setClearColor( 0x000000);
        app.renderer.setSize(app.height,app.height);
        app.scene.add(app.camera);
        app.hemisphereLight = new THREE.HemisphereLight(0xffffff,0x000000);
        app.scene.add(app.hemisphereLight);

        // Create sections
        app.sectionConstructors.push(objects.section(sectionOne.object,sectionOne.floor));
        app.sectionConstructors[0](app.scene);

        // We create a player and add controls to it

        app.renderer.render( app.scene, app.camera );
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
