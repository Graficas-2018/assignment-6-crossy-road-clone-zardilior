/** In this file all of the objects are including including the section, this section includes
 *  a constructor per object which creates the models and their methods. The objects have a type 
 *  used for collisions as well as their respective models and tags. objects are saved in groups 
 *  automatically corresponding to their classes, collisions can be saved by creating a 
 *  collision between two types passing a function as parameter which receives both objects  
 *  in the order of the corresponding types.
 */
var objects ={
    sectionWidth:6,
    tileDim:50,
    objects:[],
    collisions:[],
    // Character is made of  three boxes, jeans, a shirt and a head
    object:function(color){
        this.model = createCube(color);
        this.intersects = function(box){
            return this.model.intersectsBox(box);
        }
        this.setPos = function(x,y){
           this.model.position.x = x;  
           this.model.position.y = y;  
        }
    },
    // Sections, 
    /** A section has many objects within it and one on each tile, a tile can be created and it will      *  return a constructor function to replicate that tile */
    section:function(){

    },
    createCube: function(color){
        var material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

        // Create the cube geometry
        var geometry = new THREE.CubeGeometry(2, 2, 2);

        // And put the geometry and material together into a mesh
        var cube = new THREE.Mesh(geometry, material);
        cube.setPosition(x,y);
        return cube;
    },
    createCollision: function(type1,type2,collideFunc){
        var firstTypes = this.objects.filter((x)=>x.type==type1); 
        var secondTypes = this.objects.filter((x)=>x.type==type2); 
        var func = function(){
            for(var i of firstTypes){
                for(var j of secondTypes){
                    collideFunc(i,j); 
                }
            }
        }    
        objects.collisions.push(func);
    }
}
