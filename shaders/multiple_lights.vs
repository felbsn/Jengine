var MULTIPLE_LIGHTS_VS = ` 
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


void main()
{

    gl_Position =  uViewProjMatrix  *uModelMatrix* aVertexPos;


    v_vertexID = uID_Click;
    v_TexCoord = aTextureCoord;

    v_vertexNormWS = uInvModelMatrix*aVertexNormal;

    v_vertexPosWS =  uModelMatrix*aVertexPos;
}` 