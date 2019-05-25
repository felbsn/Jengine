/**
 * ShaderProgram Class
 * 
 * Shader handler class utilizes all shader location settings and much more 
 *
 * @class ShaderProgram
 */
class ShaderProgram
{
    /**
     *Creates an instance of ShaderProgram.
     * @param {WebGLProgram} glProgram
     * @param {String} programName
     * @memberof ShaderProgram
     */
    constructor(glProgram ,programName)
    {
        this.name = programName
        this.locations = {
            // vertex shader
            modelMatrix:"uModelMatrix",
            inverseModelMatrix:"uInvModelMatrix",
            viewProjectionMatrix:"uViewProjMatrix"
        };


        this.targets = []

        this.program = glProgram;
        return this;
    }



    /**
     * Add user shader defined uniforms
     *
     * @param {*} extralocs
     * @memberof ShaderProgram
     */
    addExtraLocation( extralocs)
    {
        for(let key in extralocs)
        {
            this.locations[key] = extralocs[key];
        }


        
    }


    /**
     * Begin to initialize all shader uniforms from given names , hiearchy
     *
     * @param {*} gl
     * @memberof ShaderProgram
     */
    initLocations(gl)
    {

        for(var keys in this.locations)
        {
            this.initAttribute(gl ,this.locations ,keys , "")
        }

        console.log(this.locations)
    }


    /**
     * Workfroce of uniform getter function -recuresive , do not call outside of this class!!!
     *
     * @param {*} gl
     * @param {*} parent
     * @param {*} property
     * @param {*} prefix
     * @returns
     * @memberof ShaderProgram
     */
    initAttribute(gl ,parent, property  ,prefix )
    {


        if(parent[property] instanceof Object)
        {

            console.log("prop obj " , property)

            if(parent[property] instanceof Array)
            {
                for(var i = 0 ; i <parent[property].length ; i++)
                {
                    for(var key in parent[property][i])
                    {
                        this.initAttribute(gl , parent[property][i] , key ,prefix+ property +"["+i+"].")

                    }

                }



            }else
            {
                for(var prop in parent[property])
                {
    
                  
                    this.initAttribute(gl , parent[property] ,prop ,prefix+ property +".")
    
                }
            }





        }else
        {


     
            let finalProp = prefix +parent[property]
            var loc =  gl.getUniformLocation(this.program, finalProp)

            

            console.log("fin "   , finalProp , " prop " , property  ," L: " ,  loc != null );
            parent[property] = loc


            if(loc == null)
            {
                console.error("Attribute " + finalProp  + " can not be located!")
            }
       
        }


        return;

    }

}

ShaderProgram.DefaultLocations = {

        // vertex shader
        modelMatrix:"uModelMatrix",
        inverseModelMatrix:"uInvModelMatrix",
        viewProjectionMatrix:"uViewProjMatrix",
        ID:"uID_Click",


            textureDiffuse : "textureDiffuse",
            textureNormal  : "textureNormal",
            textureEmissive: "textureEmissive",
            textureSpecular: "textureSpecular",
  
        //fragment shader
        material:
        {
            shininess:"shininess",
            emissive:"emissive",
            ambient:"ambient",
            diffuse:"diffuse",
            specular:"specular",
            useTexture:"useTexture",
            useEmissiveMap:"useEmissiveMap",
            useNormalMap:"useNormalMap",
            useSpecularMap:"useSpecularMap"
        },

        viewPos:"viewPos",
        globalAmbient:"globalAmbient",

        lights:Array.from({length:30},()=> ({
            color               :"color",
            position            :"position",
            constantAttenuation :"constant",
            linearAttenuation   :"linear",
            quadraticAttenuation:"quadratic",
            cutOff              :"cutOff",
            outerCutOff         :"outerCutOff",
            lightType           :"type",
            direction           : "direction"
            }))
    };

