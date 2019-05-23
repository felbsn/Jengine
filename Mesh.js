

/**
 * mesh sınıfı
 *
 * @class Mesh
 */
class Mesh
{
    /**
     *Creates an instance of Mesh.
     * @param {Graphics} gfx 
     * @param {ModelData} modeldata
     * @memberof Mesh
     */
    constructor(meshNameID = "Mesh"+Mesh._id ,modeldata = null  , override = false) {

        if(!Engine.Instance) throw error("Engine not initialized!")

        let gfx = Engine.Instance.gfx;

        this.name = meshNameID; 

        if(!override && Mesh.dict[this.name] )
        {
            return Mesh.dict[this.name];
        }

        if(!modeldata)
        {
            if(MeshBundle[this.name ])
            {
                modeldata =     MeshBundle[this.name ]


            } else
            {
                throw  ("Unable to locate your mesh in bundle ! -> "+this.name );

            }
        }

        var vertexBuffer = gfx.initBuffer(modeldata.vertices, gfx.gl.ARRAY_BUFFER, gfx.gl.STATIC_DRAW)
        if (vertexBuffer == null) {
            alert("vbo buffer olusurken  bir sıkıntı meydana geldi , model:" + modeldata)
            return null;
        }

        var indexBuffer = gfx.initBuffer(modeldata.indices, gfx.gl.ELEMENT_ARRAY_BUFFER, gfx.gl.STATIC_DRAW)
        if (indexBuffer == null) {
            alert("index buffer olusurken bir sıkıntı meydana geldi , model:" + modeldata)
            return null;
        }

        var indexType = modeldata.indexCount < 255 ? gfx.gl.UNSIGNED_BYTE :
            (modeldata.indexCount < 65535 ? gfx.gl.UNSIGNED_SHORT :
                gfx.gl.UNSIGNED_INT)

       
        this.vbo = vertexBuffer;
        this.ibo = indexBuffer;
        this.attributes = modeldata.attributes;
        this.indexCount = modeldata.indexCount;
        this.stride = modeldata.stride;
        this.indexType = indexType;
        this.rawMesh = modeldata;

        Mesh.dict[this.name] = this;

        Mesh._id++;
        return this;
    }

    /**
     * bind object to graphics
     *
     * @param {*} gfx
     * @memberof Mesh
     */
    bind() {

        if(!Engine.Instance) throw error("Engine not initialized!")
        let gfx = Engine.Instance.gfx;

        gfx.gl.bindBuffer(gfx.gl.ARRAY_BUFFER, this.vbo)
        for (var i = 0; i < this.attributes.length; i++) {
            let attrbInfo = this.attributes[i];

            gfx.gl.vertexAttribPointer(
                i, //location
                attrbInfo[0],       // numComponents
                gfx.gl.FLOAT,     // type
                false,            // normalize
                this.stride,    //stride
                attrbInfo[1]);  //offset
            gfx.gl.enableVertexAttribArray(
                i);

        }
        // bind indices
        gfx.gl.bindBuffer(gfx.gl.ELEMENT_ARRAY_BUFFER, this.ibo);

    }
}

Mesh.Cube = null;
Mesh.Sphere = null;
/**
 * Initialize basic types of mesh elements , "Cube" and "Sphere"
 *
 */
Mesh.InitDefault = function()
{
 
    Mesh.Cube  =  new Mesh("Cube" );
    Mesh.Sphere = new Mesh("Sphere");
 
}


Mesh._id = 0;
Mesh.dict = {};






var DefaultCubeMesh = 
{
vertices: new Float32Array([1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 0.75, 0.25, -1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 1.0, 0.5, 1.0, -1.0, -1.0, 0.0, -1.0, 0.0, 0.75, 0.5, -1.0, 1.0, -1.0, 0.0, 1.0, 0.0, 0.25, 0.5, 0.999999, 1.0, 1.000001, 0.0, 1.0, 0.0, 0.5, 0.25, 1.0, 1.0, -0.999999, 0.0, 1.0, 0.0, 0.5, 0.5, 1.0, 1.0, -0.999999, 1.0, -0.0, 0.0, 0.5, 0.5, 1.0, -1.0, 1.0, 1.0, -0.0, 0.0, 0.75, 0.25, 1.0, -1.0, -1.0, 1.0, -0.0, 0.0, 0.75, 0.5, 0.999999, 1.0, 1.000001, 0.0, -0.0, 1.0, 0.5, 0.25, -1.0, -1.0, 1.0, 0.0, -0.0, 1.0, 0.25, 0.0, 1.0, -1.0, 1.0, 0.0, -0.0, 1.0, 0.5, 0.0, -1.0, -1.0, 1.0, -1.0, -0.0, -0.0, 0.0, 0.25, -1.0, 1.0, -1.0, -1.0, -0.0, -0.0, 0.25, 0.5, -1.0, -1.0, -1.0, -1.0, -0.0, -0.0, 0.0, 0.5, 1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.5, 0.75, -1.0, 1.0, -1.0, 0.0, 0.0, -1.0, 0.25, 0.5, 1.0, 1.0, -0.999999, 0.0, 0.0, -1.0, 0.5, 0.5, -1.0, -1.0, 1.0, 0.0, -1.0, 0.0, 1.0, 0.25, -1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.25, 0.25, 0.999999, 1.0, 1.000001, 1.0, -0.0, 0.0, 0.5, 0.25, -1.0, 1.0, 1.0, 0.0, -0.0, 1.0, 0.25, 0.25, -1.0, 1.0, 1.0, -1.0, -0.0, -0.0, 0.25, 0.25, -1.0, -1.0, -1.0, 0.0, 0.0, -1.0, 0.25, 0.75]),
indices: new  Uint8Array  ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 18, 1, 3, 19, 4, 6, 20, 7, 9, 21, 10, 12, 22, 13, 15, 23, 16]),
attributes:[
  [ 3 ,0]
, [ 3 ,12]
, [ 2 ,24]
],
indexCount:36 ,
vertexCount:24,
stride:32
};

 