







/**
 * Light class
 *
 * @class Light
 */
class Light {

    /**
     *Creates an instance of Light.
     * @param {*} [type=Light.Types.DirectionalLight]
     * @param {*} color
     * @param {*} [gameObject=null]
     * @memberof Light
     */
    constructor(type = Light.Types.DirectionalLight  , color ,   gameObject = null) {
        
        this.position = vec3.create();
        this.direction = vec3.fromValues(0, -1, 0);
        this.autoDirection = false;
        this.color = vec3.fromValues(1, 1, 1);
   
        this.outerCutOff = 0.9;
        this.cutOff = 0.2 ;
        this.constantAttenuation = 0.2;
        this.linearAttenuation = 0.1;
        this.quadraticAttenuation = 0.005;
        this.lightType = type;
        this._oldlightType = type;
        this.gameObject = gameObject;
        this.intensity = 2;


        


        Light.list.push(this);
        this.lightType = this._oldlightType;
        return this

    }


    /**
     * Set color with hexedecimal string ex:"#ff00ee"
     *
     * @param {String} hex
     * @returns
     * @memberof Light
     */
    setColorHex(hex)
    {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {

              c = [c[0], c[0], c[1], c[1], c[2], c[2]];

            }
            c = c.join("")
            const multp = 0.00392156862;

            this.color[0] = parseInt( c.slice(0 ,2)  , 16)  * multp;
            this.color[1] = parseInt( c.slice(2 ,4)  , 16)  * multp
            this.color[2] = parseInt( c.slice(4 ,6)  , 16)  * multp
        } else
            throw new Error('Bad Hex');

        return this

    }

    /**
     * Set direction vector
     *
     * @param {vec3} vector
     * @returns
     * @memberof Light
     */
    setDirectionVector(vector)
    {
        this.direction = direction;
        return this

    }
    /**
     * Set direction from values
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns
     * @memberof Light
     */
    setDirection(x , y  , z)
    {
        this.direction[0] = x;
        this.direction[1] = y;
        this.direction[2] = z;
        return this


    }


    setColor(r ,  g , b)
    {
        this.color[0] = r
        this.color[1] = g
        this.color[2] = b
        return this;
    }


    /**
     * Bind this light to graphic card
     *
     * @param {*} gfx
     * @param {*} num
     * @memberof Light
     */
    bind(gfx, num) {


     //   let dir = vec3.fromValues(0, 0, 1);
     

        let lightLocs = gfx.shaderProgram.locations.lights;

        if (num >= lightLocs.length) 
        {
            console.log("Maximum light count exceed");
            return;
        }

        let gl = gfx.gl
        if (this.gameObject != null) {

            //gl.uniform3fv(lightLocs[num].position,  this.gameObject.position);

            var  vec = vec3.create();
            vec3.transformMat4(vec , vec ,this.gameObject.matrix )
            gl.uniform3fv(lightLocs[num].position, vec);

            if(this.autoDirection) this.direction = this.gameObject.getDirection();
            gl.uniform3fv(lightLocs[num].direction,   this.direction );
         // gl.uniform3fv(lightLocs[num].direction,  dir );


        }
        else {
            gl.uniform3fv(lightLocs[num].position, this.position);
            gl.uniform3fv(lightLocs[num].direction, this.direction);

          //  gl.uniform3fv(lightLocs[num].direction,  dir );
        }
        gl.uniform3fv(lightLocs[num].color, this.color);
        gl.uniform1f(lightLocs[num].cutOff, this.cutOff);
        gl.uniform1f(lightLocs[num].outerCutOff, this.outerCutOff);
        gl.uniform1f(lightLocs[num].constantAttenuation, this.constantAttenuation);
        gl.uniform1f(lightLocs[num].linearAttenuation, this.linearAttenuation);
        gl.uniform1f(lightLocs[num].quadraticAttenuation, this.quadraticAttenuation);
        gl.uniform1i(lightLocs[num].lightType, this.lightType);

    }


    /**
     * Activate light
     *
     * @returns
     * @memberof Light
     */
    activate() {
        if (this.lightType == 0) {
            Light.list.push(this);
            this.lightType = this._oldlightType;
        }

        return this

    }
    /**
     * Deactivate light
     *
     * @returns
     * @memberof Light
     */
    disable() {
        if (this.lightType != 0) {
            this._oldlightType = this.lightType;
            this.lightType = 0;
            Light.list.splice(Light.list.indexOf(this), 1);
        }
        return this
    }

    /**
     * to hint light location , light object create a sphere object in same location
     *
     * @returns
     * @memberof Light
     */
    useObject()
    {
        this.gameObject = new GameObject("lightObj" , null , "Sphere" );
        this.gameObject.material = Material.Light(this.color);
        this.gameObject.position = this.position;
        this.gameObject.setScale(0.2,0.2,0.2);
        if(this.gameObject.lights.indexOf(this) == -1)
            this.gameObject.lights.push(this)
        return this

    }
    /**
     * Attach this light object ot game object 
     *
     * @param {*} gameObject
     * @returns
     * @memberof Light
     */
    attachGameObject( gameObject)
    {
        this.gameObject =  gameObject
        return this

    }

    destroy()
    {
        Light.list.splice( Light.list.indexOf(this) , 1 );
        console.log("light destroyed! , active lights" ,Light.list.length)

        Light.dirty = true;
      
    }


    /**
     * set intenstiy 0 - 1 
     *
     * @param {*} val
     * @memberof Light
     */
    setIntensity(val)
    {
        let rval = 1.001 - Math.min(1 ,Math.max(val, 0) ) 

        console.log("rval" , rval)
        this.constantAttenuation = rval 
        this.linearAttenuation = rval*0.3
        this.quadraticAttenuation = rval*0.01
       

    }


}

Light.dirty = false;

Light.Types  =
{
    Disable:0,
    DirectionalLight:1,
    PointLight:2,
    FlashLight:3
}
Light.list = [];
