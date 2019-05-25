var MULTIPLE_LIGHTS_FS = ` 

#ifdef GL_ES
precision mediump float;
#endif

 

varying vec4 v_vertexID;
varying vec2 v_TexCoord;
varying vec4 v_vertexNormWS;
varying vec4 v_vertexPosWS;



struct Material {

    float shininess;


    vec3 ambient;
    vec3 diffuse;
    vec3 emissive;
    vec3 specular;

    int useTexture;
    int useEmissiveMap;
    int useNormalMap;   
    int useSpecularMap;    

}; 



struct Light {
    vec3 direction;
    vec3 color;

    float cutOff;
    float outerCutOff;
  
    float constant;
    float linear;
    float quadratic;

    vec3 position;
    int type;
};

// light types
// 0 disable
// 1 directional
// 2 point
// 3 flash light



uniform Material material;
uniform vec3 viewPos;
uniform vec3 globalAmbient;

uniform Light lights[30];

uniform sampler2D textureDiffuse;
uniform sampler2D textureNormal;
uniform sampler2D textureEmissive;
uniform sampler2D textureSpecular;

// function prototypes
vec3 CalcDirLight(Light light, vec3 normal, vec3 viewDir);
vec3 CalcPointLight(Light light, vec3 normal, vec3 fragPos, vec3 viewDir);
vec3 CalcSpotLight(Light light, vec3 normal, vec3 fragPos, vec3 viewDir);

void main()
{    
    // properties
    vec3 norm ;


    norm = normalize(v_vertexNormWS.xyz);
    
    
    
    vec3 viewDir = normalize(viewPos - v_vertexPosWS.xyz);

    
    
    // == =====================================================
    // Our lighting is set up in 3 phases: directional, point lights ansd an optional flashlight
    // For each phase, a calculate function is defined that calculates the corresponding color
    // per lamp. In the main() function we take all the calculated colors and sum them up for
    // this fragment's final color.
    // == =====================================================
    // phase 1: directional lighting
    vec3 res = vec3(0);



    for(int i = 0 ; i < 30 ; i ++)
    {

        if(lights[i].type == 1 )
        {
            res += CalcDirLight(lights[i], norm, viewDir);
        }else
        if(lights[i].type == 2 )
        {
            res += CalcPointLight(lights[i], norm ,v_vertexPosWS.xyz , viewDir);
        }else
        if(lights[i].type == 3 )
        {
            res += CalcSpotLight(lights[i], norm ,v_vertexPosWS.xyz , viewDir);
        }
    }

   

    if(material.useTexture != 0)
    {
            res *= texture2D(textureDiffuse , v_TexCoord).xyz;
             res += material.emissive* texture2D(textureDiffuse , v_TexCoord).xyz;;
    }else
    {
        res +=material.emissive;
    }
 
      
    if(material.useEmissiveMap != 0)
    {
          res += texture2D(textureEmissive , v_TexCoord).xyz;
          
    }


   /* if(material.useTexture == 1)
    {
        res *= texture2D(textureDiffuse , v_TexCoord).xyz;
    }*/

 
   
    /*if(material.useDiffuseMap == 1)
    {
      // xxx = texture2D( material.diffuseMap , v_TexCoord).xyz;
       //result = vec3(0);
    }*/

    gl_FragColor = vec4(res, 1.0);;//vec4(result, 1.0);
}


// calculates the color when using a directional light.
vec3 CalcDirLight(Light light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // combine results

    vec3 ambient ;
    vec3 diffuse;
    vec3 specular = light.color * spec *material.specular;


    ambient = light.color * material.ambient *globalAmbient;
    diffuse = light.color * diff *material.diffuse;


    return (ambient + diffuse + specular);
}

// calculates the color when using a point light.
vec3 CalcPointLight(Light light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient = light.color * material.ambient;
    vec3 diffuse = light.color * diff *material.diffuse;
    vec3 specular = light.color * spec;



    diffuse *= attenuation;
    specular *= attenuation*material.specular;;
    return (ambient + diffuse + specular);
}

// calculates the color when using a spot light.
vec3 CalcSpotLight(Light light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // spotlight intensity

    vec3 LightToPixel = normalize(fragPos - light.position);
    float SpotFactor = dot(LightToPixel, light.direction);


    float factor = 0.0;
    if(SpotFactor > light.outerCutOff)
    {
         float x = (1.0 - (1.0 - SpotFactor) * 1.0/(1.0 - light.outerCutOff));
        
        factor = x;
    } 

    

    /* float theta = dot(lightDir, normalize(light.direction)); 
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
 
    // combine results*/
    float intensity = factor;

    vec3 ambient = light.color * material.ambient;
    vec3 diffuse = light.color * diff *material.diffuse;
    vec3 specular = light.color * spec;


    ambient *= attenuation * intensity;
    diffuse *= attenuation * intensity;
    specular *= attenuation * intensity;


    
    //*/
 
    return (ambient + diffuse + specular);

}` 