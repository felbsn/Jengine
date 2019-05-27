 


/**
 * Main Class for Engine libraryr
 * 
 * Includes and initializes all required settings
 *
 * @class Engine
 */
class Engine
{
    /**
     *Creates an instance of Engine. Creates 2 canvas inside the given container
     * @param {*} container
     * @memberof Engine
     */
    constructor(container)
    {
        this.container =container;
        if(this.container == null)
        {
            console.log("container is not set , try to append body");
            this.container = document.body;
        }

        this.canvas = document.createElement('canvas');
        this.canvas2D = document.createElement('canvas');
        this.canvas2D.style.position = "absolute";
        this.canvas2D.style.width = "100%";
        this.canvas2D.style.height = "100%";
        this.canvas.style.position = "absolute";
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
       

        this.gfx = new Graphics(this.canvas , this.canvas2D );
        this.camera = new Camera(this.gfx.getWidth(), this.gfx.getHeight());
        this.input = new Input(this.canvas2D);
        this.time = new Time();

        this.container.appendChild(this.canvas);
        this.container.appendChild(this.canvas2D);

        this.soundManager = new SoundManager();

        this.lastFrameTime = 0;
        this.fps = 0;
        this.frameCounter =0;

        this.batchInterval = 10;

        this.batchFps = 0;
        this.batchFrameCounter =0;
        this.lastBatchFrameTime = 0;

        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -9.82);  
      //  this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.tolerance = 0.001;


        console.log("Engine constructed")
        Engine.Instance = this;

        Mesh.InitDefault()




        this.resize();
        this.initCallBacks();
    }


    /**
     * Update lights
     *
     * @memberof Engine
     */
    updateLights()
    {

       for(let i = 0 ; i <  Light.list.length ; i++)
       {
            let light =  Light.list[i];
            light.bind(this.gfx ,i);
       }

       if(  Light.dirty)
       {

        let lightLocs = this.gfx.shaderProgram.locations.lights;

        for(let i = Light.list.length ; i <  lightLocs.length  ; i++)
        {
            this.gfx.gl.uniform1i(lightLocs[i].lightType, 0);
        }
            Light.dirty = false;
       }
    }

    /**
     * Draw mesh data
     *
     * @memberof Engine
     */
    draw3D()
    {
        var mesh = null
        for (let i = 0; i < GameObject.list.length; i++) {
            const element = GameObject.list[i];


            if (element.mesh) {
                element.mesh.bind(this.gfx);

                if (element.material) {
                    element.material.bind(this.gfx);

                    if(element.material.texture) element.material.texture.bind(0);
                    if(element.material.normalMap) element.material.normalMap.bind(1);
                    if(element.material.emissiveMap) element.material.emissiveMap.bind(2);
                    if(element.material.specularMap) element.material.specularMap.bind(3);

                }
                if (element.texture) {
                    element.texture.bind(0);
                }

                this.gfx.setModelMatrix(element.matrix)
                this.gfx.setInvModelMatrix(element.invMatrix)
        
                this.gfx.drawMesh(element.mesh);

            }

        }
    }

    /**
     *  Draw 2d stuff with canvas context
     *
     * @memberof Engine
     */
    draw2D()
    {

        const instance = Engine.Instance;
        const ctx = instance.gfx.ctx2D;

        let w =  instance.gfx.getWidth() , h = instance.gfx.getHeight();
        ctx.clearRect (0, 0, w, h);


        ctx.font = "30px Arial";

        ctx.fillStyle = "white";
        ctx.fillText("Fps:"+ instance.fps.toFixed(2) , 10, 50);

        ctx.fillText("Avg fps:"+ instance.batchFps.toFixed(2)+ "/" + instance.batchInterval.toFixed(1) +"s" , 10, 100);
        //ctx.fillText("fps:"+ (1.0/Time.deltaTime).toFixed(2), 10, 50);
        ctx.fillStyle = "white";
        ctx.fillText("Active Lights:"+ Light.list.length, 10, 150);
        ctx.fillText("Game Objects:"+ GameObject.list.length, 10, 200);
        ctx.fillText("Physic Objects:"+ Body.list.length, 10, 250);
        ctx.fillText("Elapsed Time:"+   Time.time.toFixed(2), 10, 300);


        //ctx.fillText("Event Counter:"+    GameObject.eventList.length, 10, h-50);
        ctx.fillText("Event Counter:"+    GameObject.eventList.length, 10, h-50);

    }


    /**
     * Start game loop
     * 
     *
     * @param {*} loop user defined loop function
     * @memberof Engine
     */
    start( loop)
    {
        this.running = true;


        Engine.Instance.time.advance(100);
    
        function renderFuntion(elapsedMs) {
          
            let instance = Engine.Instance;

            if(elapsedMs)
            {
                instance.time.advance(elapsedMs);
                instance.world.step(1/60, Time.deltaTime, 3);

                let timePassFrame = instance.time.time - instance.lastFrameTime;
                if(timePassFrame >= 0.5)
                {
                    instance.fps = instance.frameCounter / timePassFrame;
                    instance.frameCounter = 0;

                    instance.lastFrameTime = instance.time.time
                }
                instance.frameCounter++;


                let timePassBatch = instance.time.time - instance.lastBatchFrameTime;
                if(timePassBatch >= instance.batchInterval)
                {
                    instance.batchFps = instance.batchFrameCounter / timePassBatch;
                    instance.batchFrameCounter = 0;

                    instance.lastBatchFrameTime = instance.time.time
                }
                instance.batchFrameCounter++;
 



                Body.PhysicScheduler();
            }
            

            let gfx = instance.gfx;
            let input = instance.inputs
            let camera = instance.camera;
            


            instance.input.frame(instance.time.deltaTime);

            GameObject.GameObjectScheduler();

          

            if(loop)loop()
            // pure rendering area
            instance.gfx.beginScene();
            GameObject.CalculateMatrices()

            instance.gfx.setViewPosition(instance.camera.getPosition())
            instance.gfx.setViewProjectionMatrix(instance.camera.getViewProjectionMatrix())
            
            instance.updateLights();

            instance.draw2D();
            instance.draw3D();


            if(instance.running)
            requestAnimationFrame(renderFuntion);
        }
        renderFuntion();
    }

    /**
     * Internal call back functions for Engine
     *
     * @memberof Engine
     */
    initCallBacks()
    {
        window.addEventListener('resize', this.resize);
       // document.addEventListener('mousedown', this.mouseDown, false);
    }

    /**
     *  Internal call back functions for Engine
     *
     * @param {*} event
     * @memberof Engine
     */
    mouseDown(event)
    {
        event.preventDefault();
        let x = (event.clientX / window.innerWidth) * 2 - 1;
        let y = - (event.clientY / window.innerHeight) * 2 + 1;
    }


 

    /**
     * Internal call back functions for Engine
     *
     * @memberof Engine
     */
    resize()
    {
        let instance = Engine.Instance;

        let w = window.innerWidth;
        let h = window.innerHeight;
        instance.canvas.width = w
        instance.canvas.height = h
        instance.canvas2D.width = w
        instance.canvas2D.height = h
        instance.gfx.width =w
        instance.gfx.height =h

        instance.gfx.gl.viewport(0, 0, instance.gfx.width, instance.gfx.height);

        instance.camera.setAspectRatio(w/h);
    }



    

    /**
     * Main Setup of Engine class
     *
     * @param {*} init
     * @memberof Engine
     */
    setup(  init)
    {

        GameObject._id = 1;
        GameObject.rootObject =  new GameObject("Root")

        this.gfx.createProgram(MULTIPLE_LIGHTS_VS ,MULTIPLE_LIGHTS_FS , ShaderProgram.DefaultLocations , "DefaultShader" );


        this.gfx.setInt(this.gfx.shaderProgram.locations.texture ,0 )
        this.gfx.setInt(this.gfx.shaderProgram.locations.textureNormal ,1 )
        this.gfx.setInt(this.gfx.shaderProgram.locations.textureEmissive ,2 )
        this.gfx.setInt(this.gfx.shaderProgram.locations.textureSpecular ,3 )
       
        


        Camera = this.camera
        Input = this.input
        Time = this.time
        SoundManager = this.soundManager

        init(this , this.gfx ,this.time  ,this.camera , this.input);
    }

}

