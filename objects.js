/** In this file all of the objects are including including the section, this section includes
 *  a constructor per object which creates the models and their methods. The objects have a type 
 *  used for collisions as well as their respective models and tags. objects are saved in groups 
 *  automatically corresponding to their classes, collisions can be saved by creating a 
 *  collision between two types passing a function as parameter which receives both objects  
 *  in the order of the corresponding types.
 */
var objects ={
    sectionWidth:6,
    sectionHeight:4,
    tileDim:50,
    objects:[],
    collisions:[],
    objectProportion:.8,
    // Character is made of  three boxes, jeans, a shirt and a head
    object:function(color,type){
        var obj = {};
        obj.model = objects.createCube(color);
        obj.type = type;
        obj.intersects = function(obj2){
            return obj.model.intersectsBox(obj2.model);
        }
        obj.setPos = function(x,y){
           obj.model.position.x = x*objects.tileDim;  
           obj.model.position.y = y*objects.tileDim;  
        }
        if(!objects.objects['type'])
            objects.objects['type']=[];
        objects.objects['type'].push(obj);
        return obj;
    },
    floorObject:function(color,type){
        obj = objects.object(color,type);
        obj.model.position.z = -objects.tileDim;
        return obj;
    },
    generateFloorObject(color,type){
        return function(x,y){
            var obj =  objects.floorObject(color,type);
            obj.setPos(x,y);
            return obj;
        }
    },
    generateObject(color,type){
        return function(x,y){
            var obj =  objects.object(color,type);
            obj.setPos(x,y);
            return obj;
        }
    },
    // Sections, 
    /** A section has many objects within it and one on each tile, a tile can be created and it will      *  return a constructor function to replicate that tile */
    section:function(objectMap,floorMap){
        return function(scene){
            var group = new THREE.Group(); 
            for(var i in floorMap){
                var x = i % objects.sectionWidth;
                var y = Math.floor(i/objects.sectionWidth);
                if(objectMap[i]!=""){
                   group.add(objects[objectMap[i]](x,y).model); 
                }
                group.add(objects[floorMap[i]](x,y).model);  
            }
            scene.add(group);
            return group;
        }
    },
    createCube: function(color,proportion=1){
        var material = new THREE.MeshStandardMaterial({ color: color });

        // Create the cube geometry
        var dim = objects.tileDim*proportion;
        var geometry = new THREE.CubeGeometry(dim,dim,dim);

        // And put the geometry and material together into a mesh
        var cube = new THREE.Mesh(geometry, material);
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
// We declare the objects constructors
objects.character = objects.generateObject(0xf1c27d,'character');
objects.tree = objects.generateObject(0x42f471,'tree');
objects.vehicule = objects.generateObject(0x42f471,'vehicule');

// We declare the floor objects constructors
objects.water = objects.generateFloorObject(0x41e2f4,'water');
objects.road = objects.generateFloorObject(0xf7f9f9,'road');
objects.grass = objects.generateFloorObject(0x42f471,'grass');
objects.log = objects.generateFloorObject(0xa36f3c,'logs');
