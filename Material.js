


/**
 * Material Class
 *
 * @class Material
 */
class Material
{



    /**
     *Creates an instance of Material.
     * @memberof Material
     */
    constructor()
    {
        this.emissive = vec3.fromValues(0.05,0.05,0.05);
        this.diffuse = vec3.fromValues(0.7,0.7,0.7);
        this.ambient = vec3.fromValues(0.0,0.0,0.0);
        this.specular =vec3.fromValues(1,1,1);

        this.shininess = 27;
        this.useTexture = false;
        this.useSpecularMap = false;


        this.texture = null;
        this.specularMap = null;
        this.normalMap = null;
        this.emissiveMap = null;
    }


    /**
     * Set emissive values of material
     *
     * @param {*} r
     * @param {*} g
     * @param {*} b
     * @memberof Material
     */
    setEmissive(r ,g ,b)
    {

            this.emissive[0] = r
            this.emissive[1] = g
            this.emissive[2] = b

    }

    /**
     *bind this material 
     *
     * @param {*} engine
     * @memberof Material
     */
    bind(gfx)
    {

        let matLoc = gfx.shaderProgram.locations.material;

        gfx.setVec3f(matLoc.emissive ,this.emissive )
        gfx.setVec3f(matLoc.diffuse ,this.diffuse )
        gfx.setVec3f(matLoc.ambient ,this.ambient )
        gfx.setVec3f(matLoc.specular ,this.specular )
        gfx.setFloat(matLoc.shininess ,this.shininess )
        gfx.setInt(matLoc.useTexture ,this.texture ? 1 :0   ); 
        gfx.setInt(matLoc.useSpecularMap , this.specularMap ? 1 :0 );
        gfx.setInt(matLoc.useNormalMap , this.normalMap ? 1 :0 );
        gfx.setInt(matLoc.useEmissiveMap , this.emissiveMap ? 1 :0 );
        


    }

}


/**
 * Material.Standart
 * 
 * @returns
 */
Material.Standart = function()
{
    return new Material();
}

/**
 * Material.Red
 *
 * @returns 
 */
Material.Red = function()
{
    let mat = new Material();

    mat.diffuse =  vec3.fromValues(1,0.25,0.25);
    return mat;
}

/**
 *Material.Blue 
 *
 * @returns
 */
Material.Blue = function()
{
    let mat = new Material();
    mat.diffuse =  vec3.fromValues(0.25 , .25,1,0);

    return mat;
}

/**
 * Material.White
 * 
 * @returns
 */
Material.White = function()
{
    let mat = new Material();


    mat.shininess = 8;

    mat.emissive = vec3.fromValues(0.1,0.1,0.1);
    mat.diffuse = vec3.fromValues(0.5,0.5,0.5);
    mat.ambient = vec3.fromValues(0.0,0.0,0.0);
    mat.specular =vec3.fromValues(1,1,1);


    return mat;

}


/**
 * Very Bright material for ligths
 *
 * @param {*} color
 * @returns
 */
Material.Light = function( color)
{
    let mat = new Material();
    mat.emissive = vec3.fromValues(color[0],color[1],color[2]);
    mat.diffuse= vec3.fromValues(color[0],color[1],color[2]);
    //mat.diffuse = vec3.fromValues(color[0]*0.2,color[1]*0.2,color[2]*0.2);
    mat.ambient = vec3.fromValues(0.07,0.07,0.07);
    mat.specular =vec3.fromValues(0.0,0.0,0.0);

    mat.shininess = 1;

    return mat;
}

/**
 *Material.Green
 *
 * @returns
 */
Material.Green = function()
{
    let mat = new Material();
    mat.diffuse =  vec3.fromValues(0.2, 1 ,0.2);
    mat.shininess = 14;

    return mat;
}

/**
 * Some kind of metallic material
 *
 * @returns
 */
Material.Metal = function()
{
    let mat = new Material();
    mat.diffuse =  vec3.fromValues(0.7, 0.7 ,0.7);
    mat.ambient =  vec3.fromValues(0, 0 ,0);


    mat.shininess = 74;

    return mat;
}

/**
 *  Material.Dark 
 *
 * @returns
 */
Material.Dark = function()
{
    let mat = new Material();
    mat.shininess = 99;

    mat.emissive = vec3.fromValues(0 ,0 ,0);
    mat.diffuse = vec3.fromValues( 0.2,0.2,0.2);
  //  mat.ambient = vec3.fromValues(0.1,0.1,0.1);
    mat.specular =vec3.fromValues(0.1,0.1,0.1);

    return mat;
}
