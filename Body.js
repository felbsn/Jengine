


/**
 *  Body Class 
 * 
 * Handles physic body and gameObject communication
 *
 * @class Body
 */
class Body
{
    /**
     *Creates an instance of Body.
     * @param {*} gameObject
     * @param {*} physicBody
     * @memberof Body
     */
    constructor(gameObject , physicBody)
    {
        this.gameObject = gameObject;
        this.physicBody = physicBody;

        Body.list.push(this)

        Engine.Instance.world.addBody(physicBody)

        physicBody.gameObject = gameObject;
        physicBody.addEventListener("collide",function(e){
            var relativeVelocity = e.contact.getImpactVelocityAlongNormal();

           // console.log(gameObject.name , "  coliiled "  ,e)

            if(physicBody.gameObject.onCollision)physicBody.gameObject.onCollision(e)


            if(Math.abs(relativeVelocity) > 10){
                // More energy
            } else {
                // Less energy
            }
        });


        return this;
    }
    /**
     * update corresponding gameobjet properities
     *
     * @memberof Body
     */
    update()
    {
        //console.log("xyz " ,"-> " ,this.physicBody.position.x , this.physicBody.position.z ,this.physicBody.position.y )

        this.gameObject.setPosition(this.physicBody.position.x , this.physicBody.position.z , this.physicBody.position.y )
        this.gameObject.rotation[3] = -this.physicBody.quaternion.w;
        this.gameObject.rotation[0] = this.physicBody.quaternion.x;
        this.gameObject.rotation[2] = this.physicBody.quaternion.y;
        this.gameObject.rotation[1] = this.physicBody.quaternion.z;


        //this.gameObject.rotation[1] = this.physicBody.quaternion.x;
        //this.gameObject.rotation[3] = this.physicBody.quaternion.y;
        //this.gameObject.rotation[2] = this.physicBody.quaternion.z;
        //this.gameObject.rotation[0] = this.physicBody.quaternion.w;
    }

    /**
     * Apply force to linked physic body
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {Number} intensity
     * @memberof Body
     */
    applyForce( x, y ,z  , intensity)
    {
        this.physicBody.applyLocalImpulse ( new CANNON.Vec3(  x*intensity ,  z*intensity,y*intensity  ) ,  new CANNON.Vec3(  0 , 0 , 0 ) )
   
    }

    /**
     * Apply force to linked physic body 
     *
     * @param {vec3} vec
     * @param {Number} intensity
     * @memberof Body
     */
    applyForceVector( vec , intensity)
    {
        this.physicBody.applyLocalImpulse ( new CANNON.Vec3(  vec[0]*intensity ,  vec[2]*intensity,vec[1]*intensity  ) ,  new CANNON.Vec3(  0 , 0 , 0 ) )
   
    }

    /**
     * Remove physicall body
     *
     * @memberof Body
     */
    destroy()
    {

        Engine.Instance.world.removeBody(this.physicBody)

        Body.list.splice(Body.list.indexOf(this) , 1 )
        
    }

}


/**
 * Scheduler function for physic bodies
 *
 */
Body.PhysicScheduler = function()
{
    for (let i = 0; i < Body.list.length; i++) {
       Body.list[i].update();
        
    }


}


Body.list = [];