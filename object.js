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
    // Character is made of  three boxes, jeans, a shirt and a head
    object:function(color,type){
        var obj = {};
        obj.model = createCube(color);
        obj.type = type;
        obj.intersects = function(box){
            return obj.model.intersectsBox(box);
        }
        obj.setPos = function(x,y){
           obj.model.position.x = x;  
           obj.model.position.y = y;  
        }
        if(!objects.objects['type'])
            objects.objects['type']=[];
        objects.objects['type'].push(obj);
        return obj;
    },
    floorObject:function(color,type){
        obj = object(color,type);
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
    }
    // Sections, 
    /** A section has many objects within it and one on each tile, a tile can be created and it will      *  return a constructor function to replicate that tile */
    section:function(objectMap,floorMap){
        return function(scene){
            var group = new THREE.Group(); 
            for(var i in floorMap){
                var x = i % objects.sectionWidth;
                var y = Math.floor(i/objects.sectionWidth);
                if(objectMap[i]!=""){
                   group.add(objects[objectMap[i]](x,y)); 
                }
                group.add(objects[floorMap[i]](x,y));  
            }
            scene.add(group);
            return group;
        }
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
// We declare the objects constructors
objects.character = generateObject(0xf1c27d,'character');
objects.tree = generateObject(0x42f471,'tree');
objects.vehicule = generateObject(0x42f471,'vehicule');

// We declare the floor objects constructors
objects.water = generateFloorObject(0x41e2f4,'water');
objects.road = generateFloorObject(0xf7f9f9,'road');
objects.grass = generateFloorObject(0x42f471,'grass');
objects.logs = generateFloorObject(0xa36f3c,'logs');
