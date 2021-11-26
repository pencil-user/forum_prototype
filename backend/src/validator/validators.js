"use strict"

/*
    making strings of
        bool
        number
        date
    not of
        arr
        object
*/
//let changed = false

module.exports = 
{
    context : 'client',
    
    ////////////
    //// string

    string (value)
    {

        let toReturn = {}

        if(Array.isArray(value))
           return {errors:['Not a string'], value:''}

        if(typeof value === 'object')
            return {errors:['Not a string'], value:''}

        if(typeof value === 'boolean')
        {
            value = String(value)
            toReturn.value = value
        }

        if(typeof value === 'number')
        {
            value = String(value)
            toReturn.value = value
        }        

        if(!(Object.prototype.toString.call(value) === "[object String]" && typeof value  === 'string'))
            return {errors:['Not a string']}
        
        return toReturn
    },

    minlength(value, minlength)
    {
        let toReturn = {}
        
        console.log("MINLENGTH ", value, minlength)
        if(minlength != null && value.length < minlength)
            toReturn.errors = ['Must be at least '+ minlength + ' characters']
        return toReturn       
    },

    maxlength(value, maxlength)
    {
        let toReturn = {}

        if(maxlength != null && value.length > maxlength)
            toReturn.errors = ['Must be less than '+ (maxlength+1) + ' characters']
        return toReturn       
    },

    ////////////
    // number

    number(value)
    {
        let toReturn = {}

        if(Array.isArray(value))
           return {errors:['Not a number'], value: 0}

        if(typeof value === 'object')
            return {errors:['Not a number'], value: 0}
        
        if(typeof value === 'boolean')
        {
            value = Number(value)
            toReturn.value = value
        }
    
        if(typeof value === 'string')
        {
            value = Number(value)
            toReturn.value = value
        }
        
        if(typeof value !== 'number' || isNaN(value))
            return {errors:['Not a number']}    
        
        return toReturn 
    },

    min(value, min)
    {
        let toReturn = {}
        

        if(min != null && value < min)
            toReturn.errors = ['Must be equal or higher than '+ min]
        return toReturn   
    },

    max(value, max)
    {
        let toReturn = {}

        if(max != null && value > max)
            toReturn.errors = ['Must be equal or less than '+ (max) ]
        return toReturn   
    },

    round(value, digits = 0)
    {
        let factor = 1
        if(digits > 0)
            factor = 10 * digits
        console.log('digits', digits)
        let value2 = Math.round(value * factor) / factor
        if(value !== value2)
            return {value:value2}
        return {}
    },

    ///////////
    // email

    email(value)
    {
        let toReturn = {}
        if(!(Object.prototype.toString.call(value) === "[object String]" && typeof value  === 'string'))
        {
            return {errors:['Not a string']}
        }
        
        if(value.trim() != value)
        {
            value = value.trim()
            toReturn.value = value
        }

        if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)))
        {
            toReturn.errors = ['Not a valid email']
        }

        return toReturn
    },

    //////////
    // Date

    date(value)
    {
        let toReturn = {}

        if(Array.isArray(value))
           return {errors:['Not a date'], value: 0}

        if(typeof value === 'string')
        {
            let parts =value.trim().split('-');
            if(parts.length == 3)
            {
                if(!isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2]))
                {
                    parts[0] = Math.round(Number(parts[0]))
                    parts[1] = Math.round(Number(parts[1]))
                    parts[2] = Math.round(Number(parts[2]))

                    if(parts[0]< 1000 || parts[0]> 9999)
                        return {errors:['Not a valid date'], value: 0}

                    if(parts[1] < 1 || parts[1] > 12)
                        return {errors:['Not a valid date'], value: 0}

                    let maxday = getDaysInMonth(parts[1], parts[0])

                    if(parts[2] < 1 || parts[2] > maxday)
                        return {errors:['Not a valid date'], value: 0}

                    if(parts[1] <10)
                        parts[1] = '0' + parts[1]

                    if(parts[2] <10)
                        parts[2] = '0' + parts[2]                          
                    
                    return {value: parts[0] + '-' + parts[1] + '-' + parts[2]}

                }
            }
        }       

        return {errors:['Not a date'], value: 0}
    },

    mindate(value, min)
    {
        let mindate = new Date(min)
        let valueD = new Date(value)

        if(valueD.getTime() < mindate.getTime())
        {
            return {errors: ['Date too low']}
        }
        return {}

    },

    maxdate(value, max)
    {
        let maxdate = new Date(max)
        let valueD = new Date(value)

        if(valueD.getTime() > maxdate.getTime())
        {
            return {errors: ['Date too low']}
        }
        return {}  
    },

    //////
    // bool

    bool(value)
    {
        let toReturn = {}
        if(typeof value === 'boolean')
        {
            return {}
        }
        else
        {
            if(value)
            {
                toReturn.value = true
                return toReturn
            }
            else
            {
                toReturn.value = false
                return toReturn                
            }
        }     
    }
}

let getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(Number(year), Number(month), 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };





/*

function toISO(value)
{
    let parts =value.split('-');
    if(parts.length == 3)
    {
        if(!isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2]))
        {
            let D = new Date(Number(parts[0]), (Number(parts[1])-1), Number(parts[2]),1) ;
            console.log(D) 
            return D.toISOString()
        }
    }
}

*/

/*
    date(value)
    {
        let toReturn = {}

        if(Array.isArray(value))
           return {errors:['Not a date'], value: 0}
        
        // if we get Date object
        if(Object.prototype.toString.call(value) === '[object Date]')
        {
            if(this.context === 'client')
            {
                return {value : value.toISOString()}
            }
            else
            {
                return {value: value}
            }
        }

        // if we get a Number
        if(typeof value === 'number' && !isNaN(value))
        {
            let D = new Date(value)
            if(this.context === 'client')
                return {value : D.toISOString()}
            else
                return {value: D}

        }

        // if get a string
        if(typeof value === 'string')
        {
            // if ISOString
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value))
            {
                let D = new Date(value)
                if(this.context === 'client')
                    return {value : D.toISOString()}
                else
                    return {value: D}                
            }

            // if not ISOString
            let parts =value.split('-');
            if(parts.length == 3)
            {
                console.log(parts)
                if(!isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2]))
                {
                    let D = new Date(Number(parts[0]), (Number(parts[1])-1), Number(parts[2]),1) ; 
                    if(this.context === 'client')
                        return {value : D.toISOString()}
                    else
                        return {value: D}
                }
            }
        }
        toReturn.errors = ['Not a date']

        return toReturn
    }

*/