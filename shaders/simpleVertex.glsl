var simpleVS_Raw =`
attribute vec4 aVertexPos;
attribute vec4 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uInvModelMatrix;
uniform mat4 uViewProjMatrix;
uniform vec4 uID_Click;



varying vec4 v_vertexID;
varying vec2 v_TexCoord;
varying vec4 v_vertexNormWS;
varying vec4 v_vertexPosWS;

  void main() {
    gl_Position =  uViewProjMatrix  *uModelMatrix* aVertexPos;

    
    
    v_vertexID = uID_Click;
    v_TexCoord = aTextureCoord;

    v_vertexNormWS = uInvModelMatrix*aVertexNormal;

    v_vertexPosWS =  uModelMatrix*aVertexPos;


  }`


// currently using simple shader to see what happening
var simpleFS_Raw=`
  #ifdef GL_ES
  precision mediump float;
  #endif
  
  varying vec4 v_vertexID;
  varying vec2 v_TexCoord;

  varying vec4 v_vertexNormWS;
  varying vec4 v_vertexPosWS;

   struct Light{
        vec4 position;
        vec4 direction;
        vec4 color;
        float       spotAngle;              // 4 bytes
        float       constantAttenuation;    // 4 bytes
        float       linearAttenuation;      // 4 bytes
        float       quadraticAttenuation;   // 4 bytes
        int lightType;
        int  active;
      };

  uniform Light Lights[10];
  uniform vec4  eyePos;

  uniform sampler2D uSampler;



  void main() {
    if(v_vertexID.w > 0.0){
    gl_FragColor = v_vertexID;
    }
    else
    {
      vec4  texColor = texture2D(uSampler, v_TexCoord);

      //calculateLights(v_vertexPosWS , normalize(v_vertexNormWS.xyz)) ;

       gl_FragColor = texColor;
    } 
  }`

