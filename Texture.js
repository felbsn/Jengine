



/**
 * Simple texture class for handling textures
 *
 * @class Texture
 */
class Texture
{
    /**
     *Creates an instance of Texture.
     * @param {string} [name="texture"+ Texture._id]
     * @param {*} [unit=null]
     * @memberof Texture
     */
    constructor(name ="texture"+ Texture._id , unit = null)
    {
        this.name = name;
        this.tex = null
      
        this.unit = unit

 


        this.id = Texture._id
        Texture._id++


    }

    /**
     * Generate texture from url
     *
     * @param {*} url
     * @param {string} [name="texture"+ Texture._id]
     * @memberof Texture
     */
    fromURL( url ,  loadFunc = null,name ="texture"+ Texture._id ) 
    {

    if(!Engine.Instance) throw error("Engine not initialized!")
    let gl = Engine.Instance.gfx.gl;


    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);

    const image = new Image();
    image.crossOrigin = "anonymous"

    this.tex = texture;

    var current = this;

    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        if ((image.width & (image.width - 1)) == 0 && (image.height & (image.height - 1)) == 0) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }


        if(loadFunc) loadFunc(current);
         
    };
    image.src = url;


    return this;


    }




    /**
     * Bind this texture to specific texture unit
     *
     * @param {*} num
     * @memberof Texture
     */
    bind( num = 0)
    {

        if(!Engine.Instance) throw "Engine not initialized!";
        let gl = Engine.Instance.gfx.gl;

        {
            gl.activeTexture(gl["TEXTURE"+num]);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
        }

       
    }

    /**
     * Bind texture ( default texture unit:0)
     *
     * @memberof Texture
     */
    /*bind( )
    {
        if(!Engine.Instance) throw "Engine not initialized!";
        let gl = Engine.Instance.gfx.gl;

        let num =  this.unit;

        if(!num)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);


        }else
        {
            gl.activeTexture(gl["TEXTURE"+num]);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
        }
    }*/


}



Texture._id = 1;
Texture.dict = {};