// *.html|*.js|*.css


function main()
{
    var engine = new Engine(document.getElementById("container"));

    engine.setup
    (
        //objectAndLightTest
        horroScape
    )

    engine.start
    (
        function()
        {
            gunnerLoop()
        }
    )
}




// ( eng , gfx , time , camera , input )
function objectAndLightTest()
{
    
    let planeObj = new GameObject("Plane" ,null, "Plane").setScale(500 , 0.1 , 500).translate(0 , -2 , 0);
    planeObj.material = Material.White()
    planeObj.addBoxBody(0, [1,0.1,1]);

    
    function rotate()
    {
        let tim = Time.time;
        let rad = 5
        this.setPosition( Math.sin(tim)*rad , 0.3 , Math.cos(tim)*rad -10 )
    }

    function rotateRed()
    {
        let tim = -Time.time;
        let rad = 5
        this.setPosition( Math.sin(tim)*rad , 0.3 , Math.cos(tim)*rad -10 )
    }

    let l  =new Light(Light.Types.PointLight).setColorHex("#00ff00")
    l.setDirection(0 , -1 , -0.2);
    l.useObject()
    l.gameObject.translate(3, 0, -10)
    l.setIntensity(0.7, 50)

    l.gameObject.onUpdate = rotate;
    
    let l2  =new Light(Light.Types.PointLight).setColorHex("#ff0000")
    l2.setDirection(0 , -1 , -0.2);
    l2.useObject()
    l2.gameObject.translate(-3, 0, -10)
    l2.setIntensity(1, 70)
    l2.gameObject.onUpdate = rotateRed
    
    let obj = new GameObject("test" , null  ,"Monkey")
    obj.translate(0 , 0 , -10)
    obj.useMaterial(Material.Blue())

    let objx = new GameObject("cameraHolder");
    objx.onUpdate = function(input , time)
    {
        let delta = time.deltaTime
        let mov = delta * 10

        Camera.rotateRollPitchYaw( 0, input.mouse.relY  ,input.mouse.relX  )
        Camera.translate( input.xAxis()*mov ,input.yAxis() *mov,input.zAxis() *mov)
    }
    
}


function horroScape()
{
    SoundManager.registerSounds([
        ["s0" ,'res/sounds/monkey_cry.ogg'],
        ["s1" ,'res/sounds/hit_explode.ogg'],

    ])

    new Texture().fromURL("res/Tex/shipTex.jpg" , function(texture){

        let jet = new GameObject("Jet", null, "Jet");
        jet.translate(0, 15, -5)

        jet.material = Material.Metal()

        jet.material.texture = texture;

        jet.deg = 0;
        jet.onStart = function () {
            this.deg = 0;
            this.r = 15;
            this.speed = 10;

            console.log("started , ", this.deg)
        }
        jet.onUpdate = function (       ) {
            //this.deg += time.deltaTime * this.speed;
            //this.rotate(0, this.speed * time.deltaTime, 0)
            //this.position[1] =  Math.sin(time.time*0.1) * 5 +7;
            //this.position[0] =  Math.sin(time.time) * 7 ;
            //this.position[2] =  Math.sin(time.time) * 15;

            let time =Time.time *0.6;
            let rad = 15
            this.setPosition( Math.sin(time)*rad, 6 , Math.cos(time)*rad)

            this.rotate(0,  time* Math.PI/65 ,0)
        }

        new Texture().fromURL("res/Tex/shipEmissive.jpg" , function(texture){
            jet.useEmissive(texture)
        })

        new Texture().fromURL("res/Tex/shipNorm.jpg" , function(texture){
            jet.useNormal(texture)
        })

    })

    new Texture().fromURL("res/Tex/skydomeL.png" , function(texture){

        let testObj = new GameObject("simple"  ,null ,"Sphere" ).setScale(600 , 600 ,600);
        testObj.material.setEmissive(1 , 1, 1)
        testObj.material.texture = texture;
        testObj.onUpdate = function(){ this.position = Camera.position}
    })

    let planeObj = new GameObject("Plane" ,null, "Plane").setScale(40 , 0.1 , 40).translate(0 , -2 , 0);
    planeObj.material = Material.White()
    planeObj.addBoxBody(0, [1,0.1,1]);


    new Texture().fromURL("res/Tex/uniq.jpg" , function(texture){

        for (let i = -40 ; i < 40; i+=10) {
            {
                let testObj = new GameObject("simple"  ,null ,"Cube" ).setScale(5 , 5 ,5);
                //testObj.material = Material.Dark()
                testObj.useTexture(texture)
                testObj.setScale(5 ,15*Math.random()+5 , 5 )
                testObj.setPosition(i ,  2  ,40)
                testObj.addBoxBody(0);
            }
            {
                let testObj = new GameObject("simple"  ,null ,"Cube" ).setScale(5 , 5 ,5);
                //testObj.material = Material.Dark()
                testObj.useTexture(texture)
                testObj.setScale(5 ,15*Math.random()+5 , 5 )
                testObj.setPosition(i ,  2 ,-40)
                testObj.addBoxBody(0);
            }
        }
        for (let i = -40 ; i < 40; i+=10) {
            {
                let testObj = new GameObject("simple"  ,null ,"Cube" )
               // testObj.material = Material.Dark()
                testObj.useTexture(texture)
                testObj.setScale(5 ,15*Math.random()+5 , 5 )
                testObj.setPosition(40 , 2  ,i)
                testObj.addBoxBody(0);
            }
            {
                let testObj = new GameObject("simple"  ,null ,"Cube" )
               // testObj.material = Material.Dark()
                testObj.useTexture(texture)
                testObj.setScale(5 ,15*Math.random()+5 , 5 )
                testObj.setPosition(-40 , 2 ,i)
                testObj.addBoxBody(0);
              
            }
        }
    })


    


    let spawner = new GameObject("Spawner")
    spawner.onStart = function()
    {
        if(!this.interval) this.interval= 5;
        this.lastSpawn = 0;
    }

    function monkeyDestroy()
    {
        SoundManager.play("s0")
   

        let o0 = new GameObject("Cubes" , null , "Sphere");
        o0.setScale(this.scale[0]*0.7 )
        o0.setPositionVector(this.position);
        o0.position[0] +=0.2
        o0.setMask(1).useMaterial(Material.Metal())

        let o1 = new GameObject("Cubes" , null , "Cube");
        o1.setScale(this.scale[0]* 0.7 )
        o1.setPositionVector(this.position);
        o1.position[0] -=0.2
        o1.setMask(1).useMaterial(Material.Metal())

        let o2 = new GameObject("Cubes" , null , "Cube");
        o2.setScale(this.scale[0]*0.7)
        o2.setPositionVector(this.position);
        o2.setMask(1).useMaterial(Material.Metal())
        o2.position[2] -=0.2
        o2.onDestroy = o1.onDestroy = o0.onDestroy = function(){SoundManager.play("s1");}


        o0.addSphereBody(0.3);
        o0.body.applyForce( Math.random()-0.5 , 1 , Math.random()-0.5 , 1 );
        o1.addBoxBody(0.3);
        o1.body.applyForce( Math.random() -0.5, 1 , Math.random()-0.5 , 1 );
        o2.addBoxBody(0.3);
        o2.body.applyForce( Math.random() -0.5, 1 , Math.random()-0.5 , 1 );


        
    }

    spawner.onUpdate = function()
    {
       if(  Time.time  -this.lastSpawn  >= this.interval )
       {
           let x = Math.trunc( 40*(Math.random()-0.5));
           let z =  Math.trunc( 40*(Math.random()-0.5))
           let s =  (Math.random()+ 0.1) *2
    
           let obj = new GameObject("Plane" ,null, "Monkey").translate( x, 9 , z).setScale(s , s ,s).addSphereBody(s , s)
           obj.material = Material.Red();
           obj.onDestroy = monkeyDestroy;
           obj.mask = 1
           let camPos = Camera.getPosition();

           let dir = vec3.create()
           vec3.sub(dir ,camPos , obj.position);
           vec3.normalize(dir , dir);
        
           obj.body.applyForceVector( dir   ,3);

        this.lastSpawn =  Time.time;
        console.log("spawn!")
       }
    }

    let cloneObj = spawner.clone();

    cloneObj.interval = 6;
 


    let bspawner = new GameObject("bossSPawn" , null );
    bspawner.onUpdate = function()
    {
        if(!this.lastSpawn) this.lastSpawn = 0;
        if(Time.time - this.lastSpawn > 10 )
        {
            if(this.obj && this.obj.isAlive)
            {

            }else
            {

                this.obj = new GameObject("boss" , null  , "Monkey");

                this.obj.onDestroy =   monkeyDestroy

 


                 this.obj.hp = 5;

                this.obj.setScale(3 ,3, 3)
                this.obj.material = Material.Light(vec3.fromValues(1 , 0.1,0.1));


                let l0 = new Light(Light.Types.PointLight );
                l0.setColor(0.9,0.2,0.2);
                l0.useObject();
    
                l0.gameObject.setParent(this.obj)

                l0.gameObject.onUpdate= function(){ this.setPosition(  Math.sin(Time.time*2)*2, Math.cos(Time.time)*-1 , Math.sin(Time.time) ); }


                let l1 = new Light(Light.Types.PointLight );
                l1.setColor(0.9,0.2,0.2);
                l1.useObject();

                l1.gameObject.setParent(this.obj)
                l1.gameObject.onUpdate= function(){ this.setPosition(  Math.sin(Time.time)*-1.5, Math.cos(Time.time)*2 , Math.cos(Time.time*2)   ); }


                this.obj.mask = 2;
                this.obj.addSphereBody(5 ,4 );

                var target  = vec3.create()
                vec3.sub(target , Camera.getPosition() ,  this.obj.position);


                this.obj.body.applyForceVector(target , 1);
              
            }
            


            this.lastSpawn = Time.time
        }


    }


    
    {
        let l4 = new Light(Light.Types.FlashLight);
        l4.setIntensity(0.3, 100)
        l4.useObject();
        l4.gameObject.setPosition(-1, 6, -6)
        l4.gameObject.setRotation(-60, 0, 0)
        l4.gameObject.onUpdate = function () { this.rotate(0, -Time.deltaTime * 45, -Time.deltaTime * 45) }
        l4.outerCutOff = 0.94
    }


    {
        let l4 = new Light(Light.Types.FlashLight);
        l4.setIntensity(0.3, 100)
        l4.useObject();
        l4.gameObject.setPosition(0, 6, 2)
        l4.gameObject.setRotation(-45, 0, 0)
        l4.gameObject.onUpdate = function () { this.rotate(0, Time.deltaTime * 20, Time.deltaTime * 20) }
        l4.outerCutOff = 0.94
    }



    {
        let l4 = new Light(Light.Types.FlashLight);
        l4.setIntensity(0.3, 100)
        l4.useObject();
        l4.gameObject.setPosition(4, 6, -2)
        l4.gameObject.setRotation(-45, 0, 0)
        l4.gameObject.onUpdate = function () { this.rotate(0, Time.deltaTime * 90, Time.deltaTime * 90) }
        l4.outerCutOff = 0.92
    }



 

    var lx = new Light(Light.Types.FlashLight);
    lx.setIntensity(0.3, 100)
    lx.outerCutOff = 0.96


    let objx = new GameObject("cameraHolder");
    objx.onStart = function()
    {
        this.upVec = -9;
    }
    objx.onUpdate = function(input , time)
    {
        let delta = time.deltaTime
        let mov = delta * 10
        let mouseMov = delta * 15
        Camera.rotateRollPitchYaw( 0, input.mouse.relY  ,input.mouse.relX  )
        Camera.translate( input.xAxis()*mov ,input.yAxis() *mov,input.zAxis() *mov)

        if(Input.isKeyPressed(key.spacebar) == true)
        {
           this.upVec = 10;
        }
        this.upVec += -9* time.deltaTime*2;
        if(this.upVec  <= -9) this.upVec  = -9;
        
        Camera.position[1] += time.deltaTime * this.upVec;
        if(Camera.position[1] < 0)Camera.position[1] = 0;

        if(lx)
        {
            lx.direction = Camera.getDirection();
            lx.position = Camera.getFront()
        }
    }

    var soundOnDeath = function()
    {
        SoundManager.play("s0");
    }



   let ballDestroyer =  new GameObject("BallDestroyer" ,null, "Plane").translate(0, -30 ,0)
   ballDestroyer.addPlaneBody();
   ballDestroyer.onCollision = function(e)
   {
       console.log("dusen topu yok ediyoruz "  ,e.body.gameObject.name);

       GameObject.DestroyObject(e.body.gameObject);

   }


}

function gunnerLoop()
{
    if(this.gunHolder)
    {
        this.gunHolder.position = Camera.getFront() 
        this.gunHolder.position[1] -= 0.4

        this.gunHolder.setRotation(-Camera.pitch ,-Camera.yaw , 0)

    }else
    {
        this.gunHolder = new GameObject("gunHolder")

        this.gunobj =  new GameObject("gun" ,null , "Cylinder")

        this.gunobj.setScale(0.5 ,0.6 ,0.5)
        this.gunobj.setParent( this.gunHolder )

        this.gunobj.translate(0.7,0,0);
        this.gunobj.setRotation(90 ,0 ,0)

        gunobj.onUpdate = function(){ this.rotate(0 ,  Time.deltaTime *90 ,0 );}

        this.nozzle =  new GameObject("Nozzle" ,null , );
        this.nozzle.setParent( this.gunobj)


    }

    //this.lx.direction = this.nozzle.getDirection()
    
    if(Input.mouse.left)
    {
        let vec = vec3.create()
        vec3.add(vec , Camera.getRight(0.4) ,Camera.getFront())
        vec[1] -= 0.2
        let obj = new GameObject("Light Sphere" ,null, "LSphere").setPositionVector(vec )
     

        obj.onCollision = function(collision)
        {
            if(collision.body.gameObject.mask & 1)
            {
                GameObject.DestroyObject(collision.body.gameObject);  
                GameObject.DestroyObject(this);  
            }else
            if(collision.body.gameObject.mask & 2)
            {
                collision.body.gameObject.hp--;
                SoundManager.play("s1")
                if( collision.body.gameObject.hp == 0)
                {
                   
                    GameObject.DestroyObject(collision.body.gameObject);  
                    
                }
                GameObject.DestroyObject(this); 
            }
        }
        obj.onStart = function() {this.time =Time.time;}
        obj.onUpdate = function(){ if(Time.time - this.time > 10) GameObject.DestroyObject(this); }

      //  obj.setScale(0.3,0.3,0.3)
        obj.addSphereBody(1 )
 
        obj.body.applyForceVector(Camera.getDirection() ,100);
        obj.addLightRGB(Math.random() , Math.random() ,Math.random())
        obj.lights[0].setIntensity(0.6 , 6)

    }
    if(Input.mouse.right)
    {

        let vec = vec3.create()
        vec3.add(vec , Camera.getRight(0.4) ,Camera.getFront())
        vec[1] -= 0.2
        let obj = new GameObject("Light Sphere" ,null, "Torus").setPositionVector(vec )
     

        obj.onCollision = function(collision)
        {
            if(collision.body.gameObject.mask & 1)
            {
                GameObject.DestroyObject(collision.body.gameObject);  
                
            }else
            if(collision.body.gameObject.mask & 2)
            {
                collision.body.gameObject.hp--;
                SoundManager.play("s1")
                if( collision.body.gameObject.hp == 0)
                {
                   
                    GameObject.DestroyObject(collision.body.gameObject);  
                  
                }
                GameObject.DestroyObject(this); 
            }
        }
        obj.onStart = function() {this.time =Time.time;}
        obj.onUpdate = function(){ if(Time.time - this.time > 10) GameObject.DestroyObject(this); }


        obj.addSphereBody(1 )
 
        obj.body.applyForceVector(Camera.getDirection() ,10);
        obj.addLightRGB(Math.random() , Math.random() ,Math.random())
        obj.lights[0].setIntensity(0.7 ,8)
       
    }
}


//testModel