 


/**
 * Main GameObject Class 
 *
 * @class GameObject
 */
class GameObject
{

    /**
     *Creates an instance of GameObject.
     * @param {string} [name="gameObject"+GameObject._id]  name of object
     * @param {*} [parent=null]  parent of object
     * @param {*} [meshName=null]
     * @memberof GameObject
     */
    constructor(name = "gameObject"+GameObject._id ,  parent = null  , meshName = null )
    {
  //  var mesh =null , texture = null , material = 

    this.name=name;

    this.isAlive = true;
    this.visible = true;

    this.id=GameObject._id;
    GameObject._id++;

    if(meshName)
    {
        this.mesh=  new Mesh(meshName);
    }else
        this.mesh= null;
 

    this.parent=parent;
    this.texture=null;
    this.textureNormal=null;
    this.textureSpecular=null;

    this.mask = 0;

    this.textures = [];
    this.lights = [];

    this.childs= [];

     // pos ..
    this.position=vec3.create();
    this.rotation=quat.create();
    this.scale= vec3.fromValues( 1,  1, 1);
    this.material=Material.Standart()
    this.matrix=mat4.create();
    this.invMatrix=mat4.create();

    this.body = null


    if(parent != null)
    {
        parent.addChild(this)
    }else{
        ///if no root defined push obj to root base
        if(GameObject.rootObject)
        {
            GameObject.rootObject.childs.push(this);
            this.parent = GameObject.rootObject;
        }
  
        
    }

    GameObject.RegisterEvent(this, GameObject.Events.Start )
    GameObject.list.push(this)

    return this;
    }

    /**
     *  for physics add Box collider
     *
     * @param {Number} xs
     * @param {Number} ys
     * @param {Number} zs
     * @param {Number} mass
     * @returns
     * @memberof GameObject
     */
    addBoxBody( mass = 0 , scales = null  )
    {
        if(scales == null){
            scales = this.mesh.bbox;


        }else
        if(scales.length == 1)
        {

            scales = [scales[0] ,scales[0] ,scales[0] ]

        }else
        if(scales.length != 3)
        {
            console.log("Invalid parameters!");
            return this;
        }

        let scaleVec = vec3.fromValues(scales[0] , scales[1] ,scales[2] )

       // vec3.scale(forward, forward, z)

       vec3.mul(scaleVec , scaleVec , this.scale);

        

        var shape = new CANNON.Box(new CANNON.Vec3(  scaleVec[0] , scaleVec[2] ,scaleVec[1]   ));

        var physicBody = new CANNON.Body({
            mass: mass, 
            position: new CANNON.Vec3(this.position[0], this.position[2], this.position[1]), 

            // some floating point error occur on some rotations still not fixed ...
           // quaternion: new CANNON.Quaternion(this.rotation[1], this.rotation[3], this.rotation[2] ,this.rotation[0]),
            shape: shape
         });
         this.body = new Body( this ,physicBody )

         return this
    }


    /**
     * for physics add Plane collider
     *
     * @param {number} [mass=0]
     * @returns
     * @memberof GameObject
     */
    addPlaneBody(mass = 0)
    {
        console.log(  "quat "  , this.rotation[0], " : ", this.rotation[1]," : ", this.rotation[2] ," : ",this.rotation[3]) ;

        var shape = new CANNON.Plane();
     
        var physicBody = new CANNON.Body({
           mass: mass, 
           position: new CANNON.Vec3(this.position[0], this.position[2], this.position[1]), // m
         // quaternion: new CANNON.Quaternion(this.rotation[0], this.rotation[1], this.rotation[2] ,this.rotation[3]),

           quaternion: new CANNON.Quaternion(0, 0, 0 ,1),
           shape: shape
        });
        this.body = new Body( this ,physicBody )

        return this
    }


    /**
     * Set current mask to given value
     *
     * @param {*} intValue
     * @memberof GameObject
     */
    setMask(intValue)
    {
        this.mask = intValue;
        return this;
    }

    /**
     * Set selected mask values
     *
     * @param {*} intValue
     * @memberof GameObject
     */
    appendMask(intValue)
    {
        this.mask |= intValue;
        return this;
    }

    /**
     * Clear selected mask values
     *
     * @param {*} intValue
     * @memberof GameObject
     */
    removeMask(intValue)
    {
        this.mask &= !intValue;
        return this;
    }

    /**
     * for physics add shpere collider
     *
     * @param {Number} radius
     * @param {number} [mass=1]
     * @returns
     * @memberof GameObject
     */
    addSphereBody(  mass = 1 ,radius = -1)
    {

        if(radius <= 0) radius = this.mesh.radius;
 
         var shape = new CANNON.Sphere(radius)
     
         var physicBody = new CANNON.Body({
            mass: mass, 
            position: new CANNON.Vec3(this.position[0], this.position[2], this.position[1]), // m
           // quaternion: new CANNON.Quaternion(this.rotation[0], this.rotation[1], this.rotation[2] ,this.rotation[3]),
            shape: shape
         });
         this.body = new Body( this ,physicBody )

         return this
    }

    /**
     * Use ony string, mesh manager handles everything
     *
     * @param {String} MeshName
     * @returns
     * @memberof GameObject
     */
    useMesh(MeshName) {
        this.mesh = new Mesh()
        return this;
    }

    useTexture(texture)
    {
        if(!this.material)
        {
            this.material = new Material();
        }
        this.material.texture = texture;
        return this;
    }
    useEmissive(texture)
    {
        if(!this.material)
        {
            this.material = new Material();
        }
        this.material.emissiveMap = texture;
        return this;
    }
    useSpecular(texture)
    {
        if(!this.material)
        {
            this.material = new Material();
        }
        this.material.specularMap = texture;
        return this;
    }
    useNormal(texture)
    {
        if(!this.material)
        {
            this.material = new Material();
        }
        this.material.normalMap = texture;
        return this;
    }

    /**
     * Set Parent for 
     *
     * @param {GameObject} newparent
     * @returns
     * @memberof GameObject
     */
    setParent (newparent) {
        let oldparent = this.parent
        if (oldparent != newparent) {
            if (newparent != null) {

                oldparent.removeChild(this);
                newparent.childs.push(this)

            } else {
                oldparent.removeChild(this);
                rootObject.childs.push(this);
            }

            this.parent = newparent

        }
        return this;
    }

    /**
     *Add new Child
     *
     * @param {GameObject} child
     * @returns
     * @memberof GameObject
     */
    addChild  (child) {
        let oldparent = child.parent
        if (oldparent != this) {
            oldparent.removeChild(this);
            this.childs.push(this)
            child.parent = this
        }
        return this;
    }

    /**
     * Remove child
     *
     * @param {GameObject} obj
     * @returns
     * @memberof GameObject
     */
    removeChild (obj) {
        this.childs.splice(this.childs.indexOf(obj), 1);
        //obj.parent = GameObject.rootObject;
        return this;
    }

    /**
     * Add light to object
     *
     * @param {*} hexColor
     * @memberof GameObject
     */
    addLight(hexColor)
    {
        var l =  new Light(Light.Types.PointLight).setColorHex(hexColor)
        this.lights.push(l);

        this.material = Material.Light(l.color)
        l.gameObject = this;
    }


    addLightRGB(r , g ,b)
    {
        var l =  new Light(Light.Types.PointLight).setColor(r , g ,b)
        this.lights.push(l);

        this.material = Material.Light(l.color)
        l.gameObject = this;
    }


    /**
     * Translate object
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns
     * @memberof GameObject
     */
    translate  (x, y, z) {
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;
        return this;
    }

    /**
     * Set New Position
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns
     * @memberof GameObject
     */
    setPosition (x, y, z) {
     //  this.position = vec3.fromValues(x , y ,z)
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
        return this;
    }

    /**
     * Use material as
     *
     * @param {*} mat
     * @returns
     * @memberof GameObject
     */
    useMaterial(mat)
    {
        this.material = mat;

        return this;
    }

    /**
     * Set new position from a vec3/vec4
     *
     * @param {vec3} vec
     * @returns
     * @memberof GameObject
     */
    setPositionVector (vec) {
        this.position[0] =vec[0];
        this.position[1] =vec[1];
        this.position[2] =vec[2];
        return this;
    }

    /**
     *  Add rotation in degrees
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns
     * @memberof GameObject
     */
    rotate  (x, y, z) {
        quat.rotateX(this.rotation, this.rotation, toRadian(x))
        quat.rotateY(this.rotation, this.rotation, toRadian(y))
        quat.rotateZ(this.rotation, this.rotation, toRadian(z))
        return this;
    }

    /**
     * Set New Rotation for Object , in degrees
     *
     * @param {Numbee} x
     * @param {Numbee} y
     * @param {Numbee} z
     * @returns
     * @memberof GameObject
     */
    setRotation (x, y, z) {
        quat.fromEuler(this.rotation, x, y, z)
        return this;
    }

    /**
     *  Adjust Scale
     *
     * @param {Number} x  
     * @param {Number} y
     * @param {Number} z
     * @returnsNumber
     * @memberof GameObject
     */
    setScale (x, y=x, z=x) {
        this.scale[0] = x;
        this.scale[1] = y;
        this.scale[2] = z;
        return this;
    }

    /**
     *  Adjust Scale Vector
     *
     * @param {Number} x  
     * @param {Number} y
     * @param {Number} z
     * @returnsNumber
     * @memberof GameObject
     */
    setScaleVector (vec) {
        this.scale[0] = vec[0];
        this.scale[1] = vec[1];
        this.scale[2] = vec[2];
        return this;
    }






    clone  (parent = null) {

        let cloned = new GameObject();
        let id = cloned.id
        for(let key in this)
        {
          

            if(this.hasOwnProperty(key))
            {
                console.log("my keys ", key ," type " ,  typeof(this[key] ) );

                

                cloned[key] = this[key];
            }
        }
        cloned.id = id;
        cloned.name = this.name+"Clone"




        return cloned;
       

       /* for(let key in this)
        {
          

            if(this.hasOwnProperty(key))
            {
                console.log("my keys ", key ," type " ,  typeof(this[key] ) );

            }

        }
        var cloned = {};
        cloned =  deepCopy(this , cloned)


        for(let key in cloned)
        {
          

            if(this.hasOwnProperty(key))
            {
                console.log("clone keys ", key ," type " ,  typeof(cloned[key] ) );

            }

            

        }

       

        var clone = new GameObject(this.name + "Clone")

        var id = clone.id;
        var name = clone.name;
    
        clone.position[0] = this.position[0]
        clone.position[1] = this.position[1]
        clone.position[2] = this.position[2]
        clone.mesh = this.mesh
        clone.texture = this.texture
        clone.material = this.material
        clone.parent = this.parent;
        clone.id = id
        clone.name = name
        return clone;
        */
    }


    getFront(factor = 3)
    {
        let front = vec3.fromValues(this.position[0], this.position[1],this.position[2]);
        vec3.scaleAndAdd(front ,front , this.getDirection() , factor)
        return front;
    }


    getDirection()
    {

        const forward = vec3.fromValues(0 , 0 , -1);
        let vec = vec3.create()
        vec3.transformQuat(vec , forward , this.rotation);

        return vec;
    }


    translateLocal(x , y ,z )
    {
        let mat = this.matrix;

        //viewMatrix_FPS.jpg burada biraz bir şeyler anlatıyorlar
        var forward = vec3.fromValues(mat[2], mat[1 * 4 + 2], mat[2 * 4 + 2]);
        var strafe = vec3.fromValues(mat[0], mat[1 * 4 + 0], mat[2 * 4 + 0]);

        vec3.scale(forward, forward, z)
        vec3.scale(strafe, strafe, -x)

        var forwardNstrafe = vec3.add(forward, forward, strafe)
        vec3.add(this.position, this.position, forwardNstrafe)
        this.position[1] += y
        return this;


    }



}

 
// static functions

GameObject.GameObjectScheduler = function ()
{
 

    while( GameObject.eventList.length > 0   )
    {
        let event = GameObject.eventList.pop()
        let obj = event.obj;

        switch (event.type) {
            case GameObject.Events.Start:
                if(obj.onStart) obj.onStart();


                break;

            case GameObject.Events.Begin:

                if(obj.onBegin) obj.onBegin();
                break;
            
            case GameObject.Events.Destroy:
         
            if(obj.onDestroy) obj.onDestroy();

            GameObject.Remove(obj)
            // obj.parent.removeChild(obj);
            // GameObject.list.splice( GameObject.list.indexOf(obj) , 1  );
             //if(obj.body) obj.body.destroy();
            // if(obj.lights) 
                
            break;
            
            case GameObject.Events.Hit:

            if(obj.onHit) obj.onHit();
                
                break;

            default:

            console.log("Unhandled event "  , event.type  ," for", obj.name)
                break;
        }
    }


    const time = Engine.Instance.time ;

    for (let i = 0; i < GameObject.list.length; i++) {
        const element = GameObject.list[i];

        if(element.onUpdate) element.onUpdate(Engine.Instance.input, time );
        
    }
}
GameObject.GetObjectByID = function(id)
{
    //console.log(GameObject.list.filter(function(obj) {  return obj.id == id }))
    return GameObject.list.filter(function(obj) {  return obj.id == id })[0];
}
GameObject.RegisterEventByID = function(objID  , e)
{
    GameObject.eventList.push({type:e  , obj:GameObject.GetObjectByID(objID)});
}
GameObject.RegisterEvent = function(obj  , e)
{
    GameObject.eventList.push({type:e  , obj:obj});
}
GameObject.DestroyObjectByID =  function (objectID)
{
    var obj = GameObject.GetObjectByID(objectID);
    if( ! obj.isAlive ) return;
   

    if(obj == null) alert("object not found , "  ,objectID );

    GameObject.RegisterEvent(obj ,GameObject.Events.Destroy )
}
GameObject.DestroyObject =  function (obj)
{
    if(!obj.isAlive ) return;

    obj.isAlive  = false;

   // if(GameObject.eventList.filter(function(ev) {  return ev.obj.id == id  && ev.type == GameObject.Events.Destroy }).length == 0)
        GameObject.RegisterEvent(obj ,GameObject.Events.Destroy )
 
}

GameObject.list = [];
GameObject.Events = 
{
    Hit:1,
    Destroy:2,
    Start:3,
    Begin:4
}
GameObject.eventList = [];
GameObject._id = 1;
GameObject.rootObject = null



function _removeRec(obj)
{
    for (let i = 0; i < obj.childs.length; i++) {
        _removeRec(obj.childs[i] )
    }
    GameObject.list.splice( GameObject.list.indexOf(obj) , 1  );
    if(obj.body) obj.body.destroy();
    if(obj.lights.length > 0)
    {
        for (let i = 0; i < obj.lights.length; i++) {
            obj.lights[i].destroy();
        }
    }

}

GameObject.Remove = function(gameObject)
{
    _removeRec(gameObject)
}

// recursive version
function _CalculateMatricesRec(obj, constMatrix) {

    if(!obj.visible) return;


 
    mat4.fromRotationTranslationScale(obj.matrix, obj.rotation, obj.position, obj.scale);

    if(obj.body == null)
    mat4.multiply(obj.matrix, constMatrix, obj.matrix);

 

    mat4.invert(obj.invMatrix ,obj.matrix );
    mat4.transpose(obj.invMatrix ,obj.invMatrix)

    for (let i = 0; i < obj.childs.length; i++) {
        _CalculateMatricesRec(obj.childs[i], obj.matrix)
    }
}
GameObject.CalculateMatrices = function()
{
    if(GameObject.rootObject )
    {
        mat4.fromRotationTranslationScale( GameObject.rootObject .matrix , GameObject.rootObject .rotation , GameObject.rootObject .position , GameObject.rootObject .scale);
        for (let i = 0; i < GameObject.rootObject .childs.length; i++) {
            _CalculateMatricesRec(GameObject.rootObject .childs[i]  , GameObject.rootObject .matrix)
        }
    }

}
GameObject.Root = function()
{
    return GameObject.rootObject;
}



function deepCopy(oldObj , parent = null , key = null) {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {

        if(oldObj instanceof GameObject)
        {

            console.log("gameobjet instance")

            //newObj = deepCopy(oldObj , newObj);

            //newObj = {}
            obj = new GameObject(oldObj.name , null , null);
            let id = obj.id;
            for(let key in oldObj)
            {
              
    
                if(this.hasOwnProperty(key))
                {
                    //console.log("clone keys ", key ," type " ,  typeof(newObj[key] ) );

                 //   newObj[key] = oldObj[key];

                 console.log("key loaded in " , key)

                 obj[key] = oldObj[key];
                }
    
            }
            newObj = obj;


        }else         
        if(oldObj instanceof Light)
        {
            let l = new Light(oldObj.lightType ,oldObj.color);
            l.attachGameObject(parent);
            
        }else
        if(oldObj instanceof Body)
        {
         
           // newObj = oldObj ;
           // new Body()
            
        }else
        if(oldObj instanceof Material)
        {
            newObj = oldObj;
        }else{
            newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
            for (let key in oldObj) {
                newObj[key] = deepCopy(oldObj[key] , newObj , key);
            }
        }
 
        //console.log(" instance of  , " , (oldObj instanceof GameObject))

    }else
    if (oldObj && typeof oldObj === 'function') {
     
    }
    return newObj;
}