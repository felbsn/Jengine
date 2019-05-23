 





/**
 * Main Graphic Class
 * 
 * created for abstract primitive gl functions
 *
 * @class Graphics
 */
class Graphics {

    /**
     *Creates an instance of Graphics.
     * @param {*} canvasObj
     * @param {*} canvas2dObj
     * @memberof Graphics
     */
    constructor(canvasObj, canvas2dObj) {
        var elm = document.createElement('canvas')
        var elm = canvasObj;

        var elm2 = document.createElement('canvas')
        var elm2 = canvas2dObj;


        this.canvas3D = canvasObj;
        this.canvas2D = canvas2dObj;

        this.gl = elm.getContext('webgl');
        var ext = this.gl.getExtension('OES_element_index_uint');

        this.ctx2D = elm2.getContext('2d');

        this.width = canvasObj.width
        this.height = canvasObj.height

        this.shaderProgram = null;
        console.log("graphics build " + this.width + "x" + this.height)
    }



    


    /**
     * Set Uniform Vec4f
     *
     * @param {WebGLUniformLocation} loc
     * @param {vec4} value
     * @memberof Graphics
     */
    setVec4f(loc , value)
    {
        this.gl.uniform4fv(loc, value);
    }
    /**
     * Set Uniform Vec3f
     *
     * @param {WebGLUniformLocation} loc
     * @param {vec3} value
     * @memberof Graphics
     */
    setVec3f(loc , value)
    {
        this.gl.uniform3fv(loc, value);
    }
    /**
     * Set Uniform Int
     *
     * @param {WebGLUniformLocation} loc
     * @param {number} value
     * @memberof Graphics
     */
    setInt(loc , value)
    {
        var i = value

        this.gl.uniform1i(loc, i);
    }
    /**
     * Set Uniform Float
     *
     * @param {WebGLUniformLocation} loc
     * @param {float} value
     * @memberof Graphics
     */
    setFloat(loc, value) {
        this.gl.uniform1f(loc, value);
    }


    /**
     * Set Uniform Matrix
     *
     * @param {WebGLUniformLocation} loc
     * @param {mat4} value
     * @memberof Graphics
     */
    setMatrix(loc , value)
    {
      //  gl.uniformMatrix4fv(shader.u1 , false ,  camera.getViewProjectionMatrix())
       this.gl.uniformMatrix4fv( loc, false ,  value);
    }

    /**
     * Set Uniform ModelMatrix
     *
     * @param {mat4} value
     * @memberof Graphics
     */
    setModelMatrix(value)
    {
        let loc = this.shaderProgram.locations.modelMatrix
        if(loc)
        {
            this.setMatrix(loc , value)
        }else
        {
            console.error("unable to set ModelMatrix")
        }
    }

    /**
     * Set Uniform InvModelMatrix
     *
     * @param {mat4} value
     * @memberof Graphics
     */
    setInvModelMatrix(value)
    {
        let loc = this.shaderProgram.locations.inverseModelMatrix
        if(loc)
        {
            this.setMatrix(loc , value)
        }else
        {
            console.error("unable to set InvModelMatrix")
        }
    }

    /**
     * Set Uniform ViewProjectionMatrix
     *
     * @param {mat4} value
     * @memberof Graphics
     */
    setViewProjectionMatrix(value)
    {
        let loc = this.shaderProgram.locations.viewProjectionMatrix
        if(loc)
        {
            this.setMatrix(loc , value)
        }else
        {
            console.error("unable to set ViewProjectionMatrix")
        }
    }
    /**
     * Set Uniform ID value
     *
     * @param {Number} value
     * @memberof Graphics
     */
    setID(value)
    {
        let loc = this.shaderProgram.Locations.ID
        if(loc)
        {
            this.setInt(loc , value)
        }else
        {
            console.error("unable to set ID")
        }
    }


    /**
     * Set View pos of shader
     *
     * @param {vec3} pos
     * @memberof Graphics
     */
    setViewPosition(pos) {
       // this.setVec4f(this.shaderProgram.locations.viewPos ,pos )
        this.gl.uniform3f(this.shaderProgram.locations.viewPos, pos[0], pos[1], pos[2]);
    }



    


    /**
     * Input VS and FS shader and optional shader locations
     * Create shaderProgram and bind locations
     *
     * @param {*} VShader
     * @param {*} FShader
     * @param {*} Locations
     * @returns
     * @memberof Graphics
     */
    createProgram(VShader, FShader, Locations  ,programName) {
        var vertexShader = this.createShader(this.gl.VERTEX_SHADER, VShader)
        if (!vertexShader) console.log("vertex shader is null wad ? ")
        else console.log("vertex shader compiled successfully")
        var fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FShader)
        if (!vertexShader) console.log("fragment shader is null wad ? ")
        else console.log("fragment shader compiled successfully")
        var program = this.gl.createProgram();


        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        this.gl.linkProgram(program);


        // Check the result of linking
        var linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (!linked) {
            var error = this.gl.getProgramInfoLog(program);
            console.log('Failed to link program: ' + error);
            this.gl.deleteProgram(program);
            this.gl.deleteShader(fragmentShader);
            this.gl.deleteShader(vertexShader);
            alert("olmadı yaa");
        }

        this.gl.useProgram(program);
        this.gl.program = program;



        this.shaderProgram = new ShaderProgram(program ,programName);

        this.shaderProgram.addExtraLocation(Locations)

        this.shaderProgram.initLocations(this.gl);

        return  this.shaderProgram;
    }
    /**
     * creates shader
     *
     * @param {*} type
     * @param {*} source
     * @returns
     * @memberof Graphics
     */
    createShader(type, source) {
        // Create shader object
        var shader = this.gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }

        // Set the shader program
        this.gl.shaderSource(shader, source);

        // Compile the shader
        this.gl.compileShader(shader);

        // Check the result of compilation
        var compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!compiled) {
            var error = this.gl.getShaderInfoLog(shader);
            console.log('Failed to compile shader: ' + error);
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
    /**
     * initialize vbo or ibo buffer objects
     *
     * @param {*} data
     * @param {*} bufferType
     * @param {*} opt
     * @returns
     * @memberof Graphics
     */
    initBuffer(data, bufferType, opt) {
        if (data) {
            var buffer = this.gl.createBuffer()
            this.gl.bindBuffer(bufferType, buffer);
            this.gl.bufferData(bufferType, data, opt);
            this.gl.bindBuffer(bufferType, null);
            return buffer;
        } else
            return null
    }


    /**
     * Clears the buffer  , then you ready start render
     *
     * @memberof Graphics
     */
    beginScene() {

        this.gl.clearColor(0.8, 0.9, 0.85, 1.0);
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Use given shaderProgram
     *
     * @param {ShaderProgram} shaderProgram
     * @memberof Graphics
     */
    useShaderProgram(shaderProgram) {
        this.shaderProgram = shaderProgram;
        this.gl.useProgram(shaderProgram.program);
    }


    /**
     * Draw given Mesh
     *
     * @param {Mesh} mesh
     * @param {material} material
     * @memberof Graphics
     */
    drawMesh(mesh , material) {

       

        if(material && material.drawMode)
        this.gl.drawElements(material.drawMode, mesh.indexCount, mesh.indexType, 0)
        else
        this.gl.drawElements(this.gl.TRIANGLES, mesh.indexCount, mesh.indexType, 0)
    }

    /**
     * To stirng
     *
     * @memberof Graphics
     */
    toString() {
        console.log("here some tosring");
    }

    /**
     * returns maximum width
     *
     * @returns
     * @memberof Graphics
     */
    getWidth() {
        return this.gl.canvas.width;
    }

    /**
     * returns maximum height
     *
     * @returns
     * @memberof Graphics
     */
    getHeight() {
        return this.gl.canvas.height;
    }





    /**
     * load texture from own image format DEPRECIATED
     *
     * @param {*} textureName
     * @param {*} imgModel
     * @returns
     * @memberof Graphics
     */
    __loadTexture(textureName, imgModel) {
        let gl = this.gl;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);


        const level = 0;
        const internalFormat = gl.RGB
        const width = imgModel.width;
        const height = imgModel.height;
        const border = 0;
        const srcFormat = gl.RGB;
        const srcType = gl.UNSIGNED_BYTE;

        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            imgModel.data);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.


        if ((imgModel.width & (imgModel.width - 1)) == 0 && (imgModel.height & (imgModel.height - 1)) == 0) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        var texObj =
        {
            name: textureName,
            texture: texture
        }
   
        return texture;
    }
}




/** constant değerler */
const xAxis = vec3.fromValues(1, 0, 0)
const yAxis = vec3.fromValues(0, 1, 0)
const zAxis = vec3.fromValues(0, 0, 1)