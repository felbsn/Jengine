
/**
 * Yet simple Time class
 *
 * @class Time
 */
class Time
{

    /**
     *Creates an instance of Time.
     * @memberof Time
     */
    constructor()
    {

        Time.instance = this;

        this.time = 0.0;
        this.deltaTime = 0.0;
        this._oldTime = 0;

    }


    /**
     * calculates current time , delta 
     *
     * @param {*} time
     * @memberof Time
     */
    advance(time) 
    {
        time *= 0.001;

         this.deltaTime = Math.min(time - this.time  , 0.30);

         this.time = time

        Time.deltaTime = this.deltaTime;
        Time.time =  this.time;

    }

}

 





