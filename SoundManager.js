

class SoundManager
{

    constructor()
    {
        this.sounds = {};

        SoundManager.Instance = this;


    }


    play(sound , single = true)
    {
        if(this.sounds[sound])
        {
            if(single)
            {
                this.sounds[sound].currentTime = 0;
                this.sounds[sound].play()
            }else
            {
                this.sounds[sound].play()
            }

        }else
        {
            console.error("Given song not registered in sound manager ! ->" , sound)
        }
    }

    stop(sound)
    {
        if(this.sounds[sound])
        {

            this.sounds[sound].stop()
        }else
        {
            console.error("Given song not registered in sound manager ! ->" , sound)
        }
    }

    registerSound(name , url)
    {
        this.sounds[name] =  new Audio(url)
    }

    registerSounds( soundsList)
    {

        for (let i = 0; i < soundsList.length; i++) {
            const element = soundsList[i];

            this.sounds[element[0]] =  new Audio(element[1])
            
        }

        
    }








}

SoundManager.Instance = null;