
// boyle paramlı şeyler yazamıyorum ama canvasın width i ve hight i olcak w ,h fantastik şeyler yapmaya gerek yok


/**
 * Main Camera Class
 *
 * @class Camera
 */
class Camera {
    /**
     *Creates an instance of Camera.
     * @param {*} w  viewport width
     * @param {*} h  viewport height
     * @memberof Camera
     */
    constructor(w, h) {
        // pos
        this.position = vec3.fromValues(0, 0, 0) //vec3.create(); //d
        this.invPosition = vec3.fromValues(0, 0,0)
        // quaternion şeyleri  *** :/ pek iyi gitmedi
        this.rotation = quat.identity(quat.create())

        this.rotationMatrix = mat4.create();
        this.translationMatrix = mat4.create();
        this.viewMatrix = mat4.create();

        this.fieldOfView = 30 * Math.PI / 180;   // in radians ... bakın burası çok önemli
        this.aspect = w / h;
        this.zNear = 0.1;
        this.zFar = 1000.0;
        this.projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument // oyle diyorsa oyledir ::)
        // as the destination to receive the result.
        mat4.perspective(this.projectionMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);

        // karalama kampanyası başlangıc
        this.isViewDirty = false;
        this.isProjectionDirty = false;
        this.isRotationDirty = false;


        this.viewProjectionMatrix = mat4.create();

        this.roll = 0;
        this.pitch = 0;
        this.yaw = 0;
        this.gameObject = null



    }


    /**
     * Attach this camera to a game object
     *
     * @param {*} gameObject
     * @memberof Camera
     */
    attachToGameObject(gameObject)
    {
        this.gameObject = gameObject;
    }


    /**
     * Directly set aspect ration 
     *
     * @param {*} ratio
     * @memberof Camera
     */
    setAspectRatio(ratio)
    {
        this.isProjectionDirty = true;
        this.aspect = ratio;
    }



    /**
     * Translate camera like game objects (note if camera attached a gameObjet this function does not affect)
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @param {boolean} [isLocalSpace=true] transform local / world space
     * @memberof Camera
     */
    translate(x, y, z, isLocalSpace = true) {

        //console.log("values " + x +  ","+ y +  ","+ z)
        var translateVec = vec3.fromValues(x, y, z);
        if (isLocalSpace) {

            var mat = this.getViewMatrix()

            //viewMatrix_FPS.jpg burada biraz bir şeyler anlatıyorlar
            var forward = vec3.fromValues(mat[2], mat[1 * 4 + 2], mat[2 * 4 + 2]);
            var strafe = vec3.fromValues(mat[0], mat[1 * 4 + 0], mat[2 * 4 + 0]);

            vec3.scale(forward, forward, z)
            vec3.scale(strafe, strafe, -x)

            var forwardNstrafe = vec3.add(forward, forward, strafe)
            vec3.add(this.position, this.position, forwardNstrafe)
            this.position[1] += y





            // console.log('postion :', this.position);

        } else {
            //burada gerek yok öyle şeylere
            vec3.add(this.position, this.position, translateVec);
            console.log(this.position)
        }
        // karalama kampanyası 
        this.isViewDirty = true;
    }

    /**
     * Get Direction of camera
     *
     * @returns Vec3
     * @memberof Camera
     */
    getDirection() {

        var mat = this.getViewMatrix()
        var forward = vec3.fromValues(mat[2], mat[1 * 4 + 2], mat[2 * 4 + 2]);
        vec3.normalize(forward, forward);

        return forward;
    }

    /**
     * Get camera's current positon + direction
     *
     * @returns
     * @memberof Camera
     */
    getFront() {
        var dir = this.getDirection4();
        vec4.scale(dir, dir, 3)
        var vec = vec4.create();
        vec4.add(vec, dir, this.position);
        return vec;
    }

    /**
     * Get direction vec4
     *
     * @returns vec4
     * @memberof Camera
     */
    getDirection4() {

        var mat = this.getViewMatrix()
        var forward = vec4.fromValues(-mat[2], -mat[1 * 4 + 2], -mat[2 * 4 + 2], 0);
        vec4.normalize(forward, forward)
        return forward;
    }



    /**
     * Roll Pith Yaw transformer with Degrees
     *
     * @param {*} r   z axis
     * @param {*} p   x axis
     * @param {*} y   y axis
     * @memberof Camera
     */
    rotateRollPitchYaw(r, p, y) {

        this.roll = 0;
        this.pitch += p;
        this.yaw += y;

        this.isRotationDirty = true;
        this.isViewDirty = true;
    }

    /**
     * Calculate internal camera matrices
     *
     * @memberof Camera
     */
    calculateMatrices() {

        if(this.gameObject)
        {
            this.position = this.gameObject.position;
            this.rotation  = this.gameObject.rotation;
            this.isViewDirty = true;
            this.isProjectionDirty = true;
            this.isRotationDirty = true;
        }


        if (this.isViewDirty) {
            vec3.scale(this.invPosition, this.position, -1)
            this.translationMatrix = mat4.fromTranslation(mat4.identity(mat4.create()), this.invPosition)
            mat4.mul(this.viewMatrix, this.getRotationMatrix(), this.translationMatrix)

        }
        if (this.isProjectionDirty) {
            mat4.perspective(this.projectionMatrix,
                this.fieldOfView,
                this.aspect,
                this.zNear,
                this.zFar);
        }
    }

    /**
     *Calculate internal camera matrices and return view matrix
     *
     * @returns
     * @memberof Camera
     */
    getViewMatrix() {
        if (this.isViewDirty) {
            this.calculateMatrices();
        }
        return this.viewMatrix;
    }

    /**
     *Calculate internal camera matrices and return rotation matrix
     *
     * @returns
     * @memberof Camera
     */
    getRotationMatrix() {
        // sıralama gerçekten önemli
        if (this.isRotationDirty) {

 
          /*  let sum = vec3.fromValues(0 , 0, -1)
            let up = vec3.fromValues(0 , -1, 0)
            vec3.transformQuat(sum   ,sum , this.rotation);
            vec3.transformQuat(up   ,up , this.rotation);
            vec3.add(sum , sum ,this.position  )


            mat4.lookAt(this.rotationMatrix , this.position ,sum ,up);*/

            //var v =   vec3.fromValues(0 , 0 ,-1);
            //vec3.transformQuat(v,v , this.rotation)

            /*var clamp = function(x){
               // if(Math.abs(x) > 1.0)
                {
                //    return x < 0 ? -1 : 1;
                }
                return x;
            }
            var te = mat4.create();
            te =  mat3.fromQuat(te ,this.rotation)
        
   
            var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
            var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
            var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];
    

               var x , y ,z;
                y = Math.asin( clamp( m13, - 1, 1 ) );
    
                if ( Math.abs( m13 ) < 0.999999999 ) {
    
                    x = Math.atan2( - m23, m33 );
                    z = Math.atan2( - m12, m11 );
    
                } else {
    
                   x = Math.atan2( m32, m22 );
                   z = 0;
    
                }

          //    mat4.fromRotation(this.rotationMatrix,  x, xAxis);
              mat4.rotateY(this.rotationMatrix, this.rotationMatrix, y)
    */
            

          //  mat4.fromQuat(this.rotationMatrix, this.rotation);

          
        
            //mat4.fromRotation(this.rotationMatrix, toRadian(this.pitch), xAxis);
           // mat4.rotateY(this.rotationMatrix, this.rotationMatrix, toRadian(this.yaw))


           //  old y p r 
            mat4.fromRotation(this.rotationMatrix, toRadian(this.pitch), xAxis);
            mat4.rotateY(this.rotationMatrix, this.rotationMatrix, toRadian(this.yaw))
            this.isRotationDirty = false;
        }


        return this.rotationMatrix
    }

    /**
     *Calculate internal camera matrices and return viewprojectin Matrix
     *
     * @returns
     * @memberof Camera
     */
    getViewProjectionMatrix() {
        if (this.isViewDirty || this.isProjectionDirty) {
            this.calculateMatrices();
        }
        mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix)

        return this.viewProjectionMatrix;
    }

}