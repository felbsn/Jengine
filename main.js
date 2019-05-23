// *.html|*.js|*.css

deltatime = 0;

function main()
{
    var engine = new Engine(document.getElementById("container"));


    engine.setup(function( eng , gfx , time , camera , input )
    {

        SoundManager.registerSounds([
            ["s0" ,'res/sounds/blunt_hit_high_1.ogg'],
            ["s1" ,'res/sounds/clang_metal_2.ogg'],

        ])


        new Texture().fromURL("res/Tex/shipTex.jpg" , function(texture){

            let jet = new GameObject("Jet", null, "Jet");
  
            jet.translate(0, 0, -5)
            jet.texture =texture;
            jet.material = Material.Metal()
            jet.material.useTexture = 1;
            jet.useTexture = 1;


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

        })

        new Texture().fromURL("res/Tex/skydomeL.png" , function(texture){


            let testObj = new GameObject("simple"  ,null ,"Sphere" ).setScale(600 , 600 ,600);
            testObj.material.setEmissive(1 , 1, 1)
            testObj.texture = texture
            testObj.material.useTexture = 1;
            testObj.onUpdate = function(){ this.position = Camera.position}


        })





  

        let planeObj = new GameObject("Plane" ,null, "Plane").setScale(40 , 40 , 40).translate(0 , -2 , 0);
      //  planeObj.rotate( 0 , 0 , 1, 0)
        planeObj.material = Material.Dark()
        planeObj.addBoxBody(40 , 0.01  ,40);
        

       let objx = new GameObject("cameraHolder");
    

        

        
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

 
      /* l0.setIntensity(0.9)
       l0.constantAttenuation = 0.2 
       l0.linearAttenuation = 0
       l0.quadraticAttenuation = 0*/

       let l6 = new Light(Light.Types.PointLight).setColorHex("#ffffff").useObject();

       l6.gameObject.onUpdate = function()
       {
           let delta = -Time.time*2+60;
           this.setPosition( Math.cos(delta) *2   ,  (Math.sin(delta)) *2 ,   Math.sin(delta) *2 );
       }
       l6.gameObject.setParent(l0.gameObject)
       l6.setIntensity(0.2)


        let l4 = new Light(Light.Types.FlashLight); 
        
        l4.constantAttenuation = 1;
        l4.linearAttenuation = 0.1;
        l4.quadraticAttenuation = 0;


        Camera.attachToGameObject( objx)
        objx.onUpdate = function(input , time)
        {
            Camera.rotateRollPitchYaw( 0, input.mouse.relY,input.mouse.relX)
            Camera.translate( input.xAxis() ,input.yAxis() ,input.zAxis() )
         
            l4.position = Camera.position;
            let  camdir = Camera.getDirection()
            l4.direction = camdir
        }


        var soundOnDeath = function()
        {
            SoundManager.play("s0");
        }


        var a  = new GameObject("Box" ,null, "Cube").translate(3 , 20 ,0).addBoxBody(1 , 1, 1 ,2 )
        a.onDestroy =  soundOnDeath

        new GameObject("Box" ,null, "Cube").translate(3.5 , 22, 4).addBoxBody(1 , 1, 1 ,2).onDestroy = soundOnDeath
        new GameObject("Box" ,null, "Cube").translate(3 , 19 ,1).addBoxBody(1 , 1, 1 ,2 ).onDestroy = soundOnDeath
        new GameObject("Box" ,null, "Cube").translate(3 , 14 ,8).addBoxBody(1 , 1, 1 ,2 ).onDestroy = soundOnDeath
        new GameObject("Box" ,null, "Cube").translate(3 , 26 ,8).addBoxBody(1 , 1, 1 ,2 ).onDestroy = soundOnDeath
        new GameObject("Box" ,null, "Cube").translate(3 , 28 ,8).addBoxBody(1 , 1, 1 ,2 ).onDestroy = soundOnDeath
        new GameObject("Box" ,null, "Cube").translate(3 , 16 ,8).addBoxBody(1 , 1, 1 ,2 ).onDestroy = soundOnDeath
        new GameObject("Box" ,null, "Cube").translate(6, 13 ,5).addBoxBody(1 , 1, 1 ,1 ).onDestroy = soundOnDeath*


        new GameObject("Sphere" ,null, "Sphere").translate(6, 13 ,5).addSphereBody(1 , 1, 1 ,1 );

      

        new GameObject("Box" ,null, "Sphere").translate(6, 13 ,5).addSphereBody(1 , 2 );

        new GameObject("Box" ,null, "Sphere").translate(5, 5 ,1).addSphereBody(1 , 2 );

       
 
       // planeObj.addPlaneBody();

      

       let ballDestroyer =  new GameObject("BallDestroyer" ,null, "Plane").translate(0, -30 ,0)
       ballDestroyer.addPlaneBody();
       ballDestroyer.onCollision = function(e)
       {
           console.log("dusen topu yok ediyoruz "  ,e.body.gameObject.name);

           GameObject.DestroyObject(e.body.gameObject);

       }


    });





 

    engine.start(function()
    {

      

        if(Input.mouse.left)
        {
            let camPos = Camera.position;
            let camDir = Camera.getDirection();
            let obj = new GameObject("Sphere" ,null, "Sphere").setPosition(camPos[0] + camDir[0]*-2 , camPos[1] +camDir[1]*-2 ,camPos[2] +camDir[2]*-2)

            obj.onCollision = function(collision)
            {
      
               // console.log("coll " , e)
               if( collision.body.gameObject.name != "Plane" &&  collision.body.gameObject.name != "Jet" &&  collision.body.gameObject.name != "Sphere")
               {

                SoundManager.play("s1")
               
                }
            }

            obj.onDestroy = function()
            {
                console.log("Destroying objecr " , this.name)
            }

            //obj.material = Material.Dark();
            obj.material.diffuse[0] =  Math.random(); 
            obj.material.diffuse[1] =  Math.random(); 
            obj.material.diffuse[2] =  Math.random(); 

            let size = Math.max(Math.random() , 0.5)
            obj.setScale(size , size , size)
            obj.addSphereBody(size, 3 )
            obj.body.applyForce(-camDir[0] ,-camDir[1], -camDir[2] ,60);

        }
        if(Input.mouse.right)
        {
            let camPos = Camera.position;
            let camDir = Camera.getDirection();
            let obj = new GameObject("Light Sphere" ,null, "Sphere").setPosition(camPos[0] + camDir[0]*-2 , camPos[1] +camDir[1]*-2 ,camPos[2] +camDir[2]*-2)
         


            obj.onCollision = function(collision)
            {
                let otherName = collision.body.gameObject.name 
               if( otherName != "Plane" &&  otherName != "BallDestroyer" && otherName != "Light Sphere")
               {
              

                     if(collision.body.gameObject.isAlive &&   collision.body.gameObject.name != "Jet")
                    {        
                    GameObject.DestroyObject(collision.body.gameObject);          
                     SoundManager.play("s1")
                    }
               }

            }

            obj.onDestroy = function()
            {
                console.log("Destroying object " , this.name)
            }


            let size = 0.4
            obj.setScale(size , size , size)
            obj.addSphereBody(size, 2 )
            obj.body.applyForce(-camDir[0] ,-camDir[1], -camDir[2] ,40);

            

            obj.addLightRGB(Math.random() , Math.random() ,Math.random())
            obj.lights[0].setIntensity(0.7)
           
        }



    }
    );


}





//testModel