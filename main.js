// *.html|*.js|*.css

deltatime = 0;

function main()
{

 

    var engine = new Engine(document.getElementById("container"));






    engine.setup(
      //  testSuite0
      horroScape
    );

    engine.start(function()
    {

      
        gunnerLoop()



    }
    );

}


// ( eng , gfx , time , camera , input )
function testSuite0()
{

        SoundManager.registerSounds([
            ["s0" ,'res/sounds/blunt_hit_high_1.ogg'],
            ["s1" ,'res/sounds/clang_metal_2.ogg'],

        ])

        new Texture().fromURL("res/Tex/shipTex.jpg" , function(texture){

            let jet = new GameObject("Jet", null, "Jet");
            jet.translate(0, 0, -5)
    
            jet.material = Material.Metal()

            jet.material.texture = texture;

            jet.deg = 0;
            jet.onStart = function () {
                this.deg = 0;
                this.r = 15;
                this.speed = 10;

                console.log("started , ", this.deg)
            }
            jet.onUpdate = function (input, time) {
                this.deg += time.deltaTime * this.speed;
                this.rotate(0, this.speed * time.deltaTime, 0)
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


        console.log(  "quat "  , planeObj.rotation[0], " : ", planeObj.rotation[1]," : ", planeObj.rotation[2] ," : ",planeObj.rotation[3]) ;

       // planeObj.addPlaneBody(0);
        

       let objx = new GameObject("cameraHolder");
    

       new GameObject("Plane" ,null, "Torus").translate(1 , 4 , 0).addBoxBody(1);
       new GameObject("Plane" ,null, "Torus").translate(0 , 5 , 1).addBoxBody(1);
       new GameObject("Plane" ,null, "Torus").translate(1 , 6 , 0).addBoxBody(1);
       new GameObject("Plane" ,null, "Torus").translate(0 , 7 , 1).addBoxBody(1);
       new GameObject("Plane" ,null, "Torus").translate(1 , 8 , 1).addBoxBody(1);


       new GameObject("Plane" ,null, "Monkey").translate(3 , 6 , 1).addBoxBody(1).material = Material.Red();


     //  let dirl = new Light(Light.Types.DirectionalLight).setColorHex("#ffffff").useObject();
     //  dirl.setDirection(0 ,-1 ,0)


        
       let l0 = new Light(Light.Types.PointLight).setColorHex("#FF8F7F").useObject();
       let l1 = new Light(Light.Types.PointLight).setColorHex("#0D8FFF").useObject();
       let l2 = new Light(Light.Types.PointLight).setColorHex("#0Fe464").useObject();
     
       l0.gameObject.onUpdate = function()
       {
           let delta = -Time.time+60;
           this.setPosition( Math.cos(delta) *7   ,  (Math.sin(delta)+1) *2 ,   Math.sin(delta) *10 );
       }
     
       l1.gameObject.onUpdate = function()
       {
           let delta = Time.time;
           this.setPosition( Math.cos(delta) *10   ,  Math.sin(delta) *-1  ,   Math.sin(delta) *6 );
       }

      l2.gameObject.onUpdate = function()
       {
           let delta = -Time.time+1.7 ;
           this.setPosition( Math.cos(delta) *-7   ,  (Math.sin(delta)+5) *1 ,   Math.sin(delta) *-10 );
       }



       let orbitl0 = new Light(Light.Types.PointLight).setColorHex("#ffffff").useObject();
       orbitl0.gameObject.onUpdate = function()
       {
           let delta = -Time.time*6+60;
           this.setPosition( Math.cos(delta) *1   ,   0 ,   Math.sin(delta) *0.9 );
       }
       orbitl0.gameObject.setScale(0.3,0.3,0.3)
       orbitl0.gameObject.setParent(l0.gameObject)
       orbitl0.setIntensity(0.2)

       let orbitl1 = new Light(Light.Types.PointLight).setColorHex("#ffffff").useObject();
       orbitl1.gameObject.setScale(0.5,0.5,0.5)
       orbitl1.gameObject.onUpdate = function()
       {
           let delta = Time.time*2;
           this.setPosition( Math.cos(delta) *2   ,  (Math.sin(delta)) *2 ,   Math.sin(delta) *2 );
       }
       orbitl1.gameObject.setParent(l0.gameObject)
       orbitl1.setIntensity(0.2)


        let l4 = new Light(Light.Types.FlashLight); 
        l4.setIntensity(0.6)
        l4.constantAttenuation = 0.1
        l4.linearAttenuation = 0.02
      //  l4.position = Camera.position;
      //  l4.direction = Camera.getDirection()



        objx.onUpdate = function(input , time)
        {
            Camera.rotateRollPitchYaw( 0, input.mouse.relY,input.mouse.relX)
            Camera.translate( input.xAxis() ,input.yAxis() ,input.zAxis() )
     
        }


        var soundOnDeath = function()
        {
            SoundManager.play("s0");
        }

        

        new Texture().fromURL("res/Tex/vodaa.png" , function(texture){
            for (let i = 0; i < 10; i++) {
                let obj = new GameObject("Box" ,null, "Cube").translate(2 , i*2, 3).addBoxBody(2)
    
                obj.onDestroy = soundOnDeath
                obj.useTexture(texture)
            }
        })


        new GameObject("Cone" ,null, "Cone").translate(0, -2 ,0).useMaterial(Material.Green()).addBoxBody(0 )
        new GameObject("Cone" ,null, "Cone").translate(6, -2 ,0).useMaterial(Material.Green()).addBoxBody(0 )
        new GameObject("Cone" ,null, "Cone").translate(0, -2 ,7).useMaterial(Material.Green()).addBoxBody(0 )
        new GameObject("Cone" ,null, "Cone").translate(9, -2 ,3).useMaterial(Material.Green()).addBoxBody(0 )
        new GameObject("Cone" ,null, "Cone").translate(4, -2 ,-4).useMaterial(Material.Green()).addBoxBody(0 )

 
       let ballDestroyer =  new GameObject("BallDestroyer" ,null, "Plane").translate(0, -30 ,0)
       ballDestroyer.addPlaneBody();
       ballDestroyer.onCollision = function(e)
       {
           console.log("dusen topu yok ediyoruz "  ,e.body.gameObject.name);

           GameObject.DestroyObject(e.body.gameObject);

       }

}


function horroScape()
{
    SoundManager.registerSounds([
        ["s0" ,'res/sounds/blunt_hit_high_1.ogg'],
        ["s1" ,'res/sounds/clang_metal_2.ogg'],

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
        jet.onUpdate = function (input, time) {
            this.deg += time.deltaTime * this.speed;
            this.rotate(0, this.speed * time.deltaTime, 0)
            this.position[1] =  Math.sin(time.time*0.1) * 5 +7;
            this.position[0] =  Math.sin(time.time) * 7 ;
            this.position[2] =  Math.sin(time.time) * 15;
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


    new Texture().fromURL("res/Tex/vodaa.png" , function(texture){

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
               // l0.gameObject.setScale(0.2)
                l0.gameObject.setParent(this.obj)

                l0.gameObject.onUpdate= function(){ this.setPosition(  Math.sin(Time.time*2)*2, Math.cos(Time.time)*-1 , Math.sin(Time.time) ); }


                let l1 = new Light(Light.Types.PointLight );
                l1.setColor(0.9,0.2,0.2);
                l1.useObject();
              //  l1.gameObject.setScale(0.2)
                l1.gameObject.setParent(this.obj)
                l1.gameObject.onUpdate= function(){ this.setPosition(  Math.sin(Time.time)*-1.5, Math.cos(Time.time)*2 , Math.cos(Time.time*2)   ); }


                this.obj.mask = 2;
                this.obj.addSphereBody(5 ,4 );
              
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
           // Camera.position[1] += 3
           this.upVec = 10;

           // Camera.position[1] +=  this.upVec * time.deltaTime;
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

function basciLoop()
{

    if(Input.mouse.left)
    {
        let obj = new GameObject("Sphere" ,null, "Sphere").setPositionVector(Camera.getFront())
        obj.onDestroy = function() { console.log("Destroying sphere " , this.name) }

        obj.material.diffuse[0] =  Math.random(); 
        obj.material.diffuse[1] =  Math.random(); 
        obj.material.diffuse[2] =  Math.random(); 

        let size = Math.max(Math.random() , 0.5)
        obj.setScale(size , size , size)
        obj.addSphereBody(3 )
        obj.body.applyForceVector( Camera.getDirection() ,60);

    }
    if(Input.mouse.right)
    {

        let obj = new GameObject("Light Sphere" ,null, "LSphere").setPositionVector(Camera.getFront())
     
        obj.onCollision = function(collision)
        {
            if(collision.body.gameObject.mask & 1)
            {
                GameObject.DestroyObject(collision.body.gameObject);  
            }else
            if(collision.body.gameObject.mask & 2)
            {
                collision.body.gameObject.hp--;
                if( collision.body.gameObject.hp == 0)
                {
                    GameObject.DestroyObject(collision.body.gameObject);  
                    GameObject.DestroyObject(this); 
                }
            }

              //GameObject.DestroyObject(collision.body.gameObject);          
        }
        obj.addSphereBody(2)
        //obj.addBoxBody(1);
        obj.body.applyForceVector(Camera.getDirection() ,40);
        obj.addLightRGB(Math.random() , Math.random() ,Math.random())
        obj.lights[0].setIntensity(0.6 , 1.3)
       
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
        this.gunobj.setParent( this.gunHolder )

        this.gunobj.translate(0.7,0,0);
        this.gunobj.setRotation(90 ,0 ,0)

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