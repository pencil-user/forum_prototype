"use strict"

let validators = require('./validators.js')

const util = require('util')


function isFunction(obj)
{
    !!(obj && obj.constructor && obj.call && obj.apply);
}

function logObject(obj)
{
    console.log(util.inspect(obj, false, null, true /* enable colors */))
}

function V(value, schema = null, method = 'POST')
{
    /// schema describes simple value

    if(isObject(schema) && '__vSchema' in schema)
    {
        return validateItem(value, schema)
    }

    // schema describes object
    
    if(isObject(schema) && !Array.isArray(schema))
    {
        if(isObject(value) && !Array.isArray(value))  // if both value and schema are object, verify value object via schema object
        {
            let values = {}
            let errors = {}
            let hasErrors = false
            let atLeastOne = false
            for(let x in schema)
            {
                if(x in value) 
                {
                    if(isEmpty(value[x]) === null)
                    {
                        // entry exists and is not is empty

                        let result = V(value[x], schema[x], method)
                        values[x] = result.value
                        if('errors' in result)
                        {
                            hasErrors = true
                            errors[x] = result.errors
                        }
                        atLeastOne = true                        
                    }
                    else // entry exist but it is empty
                    {
                        if('__vProps' in schema[x] && 'required' in schema[x].__vProps)
                        {
                            hasErrors = true
                            errors[x] = ['Entry exists but is empty.']
                        }  
                        else if(!('__vProps' in schema[x]))
                        {

                            hasErrors = true
                            errors[x] = ['Entry exists but is empty.']
                        }
                        else
                        {
                            values[x] = null
                            atLeastOne = true
                        }
                    }

                }
                else // entry doesn't exist
                {
                    // if schema is builder object and there is required
                    if('__vProps' in schema[x] && 'required' in schema[x].__vProps && (method === 'POST' || methid === 'PUT'))
                    {
                        hasErrors = true
                        errors[x] = ['Missing entry.']
                    }

                    // if is schema regular object
                    if(!('__vProps' in schema[x]) &&  (method === 'POST' || methid === 'PUT'))
                    {
                        hasErrors = true
                        errors[x] = ['Missing entry.']  
                    }

                }
            }
            //return {errors:errors, value:values}
            let final = {}
            final.value = values

            if(!atLeastOne) 
            { 
                final.errors = ['Empty object.'] 
            }
            else if(hasErrors) 
            {final.errors = errors}

            return final
        }
        else
        {
            return {value: {}, errors:['Not an object.']}
        }
    }

    // schema describes array

    if(Array.isArray(schema))
    {
        if(Array.isArray(value))
        {
            
            let elemSchema = schema[0]
            console.log('elemSchema::', elemSchema)
            let arrValues = []
            let arrErrors = []

            let hasErrors = false;

            for(let x of value)
            {
                let result = V(x, elemSchema, method)
                arrValues.push(result.value)
                if('errors' in result)
                {
                    hasErrors = true
                    arrErrors.push(result.errors)
                }
                else
                {
                    arrErrors.push(null)
                }
            }

            let final = {}
            final.value = arrValues
            if(hasErrors) final.errors = arrErrors
            return final
        }
        else
        {
            return {value: {}, errors:['Not an array.']}
        }
    }

    return {}
}

function validateItem (value, schema)
{
    let results = []
    let newValue = value

    for(const x of schema.__vSchema)
    {
        //console.log('x:', x);
        if(Array.isArray(x[1]))  /// validator with arguments
            results.push( validators[x[0]].apply(validators, [newValue, ...x[1]] ) )
        else /// validator without arguments
            results.push( validators[x[0]].apply(validators, [newValue] ) )

        if("value" in results[results.length-1])
            newValue = results[results.length-1].value

        if('errors' in results[0])
            break;
    }

    console.log('results::: ', results)

    let errors = []

    for(let x of results)
    {
        if('errors' in x)
        {
            errors = [...errors, ...x.errors]
        }
    }

    let final = {}

    if(errors.length > 0) final.errors = errors

    final.value = newValue

    console.log('final::: ', final)
    return final
}

function isEmpty(value)
{
    if(typeof value === 'undefined') return "is undefined"
    if(typeof value === 'number' && isNaN(value))   return "NaN"
    if(value === '')   return "empty string"
    if(value === null) return "is null"
    if(Array.isArray(value) && value.length ===0) return "empty array"
    if(typeof value === 'object' && Object.entries(value).length === 0) return "empty object"
    
    return null
}

function isObject(value)
{
    if(typeof value === 'object' && value !== null)
    {
        return true
    }

    return false
}

///////////////
// builders

V.context = 'client'

V.setContext = function(context)
{
    if(context === 'client')
    { 
        this.context = 'client'
        validators.context = 'client'
        return 'client'
    }

    if(context === 'server')  
    {
        this.context = 'server'
        validators.context = 'server'
        return 'server'
    }
    return null
}

V.number = function (min=null, max=null, step=null)
{
    let builder = setupBuilder('number')
    builder.__vSchema.push(['number'])

    if(min != null)
    {
        builder.__vSchema.push(['min', [min]])
        builder.__vProps.min = min
    }

    if(max != null)
    {
        builder.__vSchema.push(['max', [max]])
        builder.__vProps.max = max
    }

    if(step !=null)
    {
        builder.__vProps.step = step
    }

    return builder
}

V.string = function (minlength=null, maxlength=null)
{
    let builder = setupBuilder('string')
    builder.__vSchema.push(['string'])

    if(minlength != null)
    {
        builder.__vSchema.push(['minlength', [minlength]])
        builder.__vProps.minlength = minlength
    }

    if(maxlength != null)
    {
        builder.__vSchema.push(['maxlength', [maxlength]] )
        builder.__vProps.maxlength = maxlength       
    }

    return builder
}

V.email = function ()
{
    let builder = setupBuilder('email')
    builder.__vSchema.push(['email'])
    

    return builder
}

V.date = function (min, max)
{
    let builder = setupBuilder('date')
    builder.__vSchema.push(['date'])

    if(min != null)
    {
        let Valid = validators['date'].apply({context:'client'}, [min])

        builder.__vSchema.push(['mindate', [Valid.value]])
        builder.__vProps.min = Valid.value
    }

    if(max != null)
    {
        let Valid = validators['date'].apply({context:'client'}, [max])

        builder.__vSchema.push(['maxdate', [Valid.value]])
        builder.__vProps.max = Valid.value
    }

    return builder
}

V.bool = function()
{
    let builder = setupBuilder('bool')
    builder.__vSchema.push(['bool'])
    

    return builder    
}


let builders =
{
    number : 
    {
        round(digits = null)
        {
            if(digits)
                this.__vSchema.push(['round', [digits]])
            else
                this.__vSchema.push(['round'])

            return this
        }
    },


    string :
    {

        uppercase()
        {
            this.__vSchema.push(['uppercase'])
            return this
        }
    },

    email :{},

    date :{}

}

function setupBuilder(type)
{    
    let builder =  {__proto__ : builders[type] }
    builder.__vSchema = [ ] 
    builder.__vProps = {}

    return builder
}

function addUniversal()
{
    for(let b in builders)
    {
        builders[b].required = function(level = 1)
        {
            this.__vProps.required = level
            return this
        }

    }
}

addUniversal()

// END builders
//////////////

//////////////
// Express extensions

V.params = (schema) =>
{
    return (req, res, next) =>
    {
        let {value, errors} = V(req.params, schema)
        if(errors)
        {
            res.status(400).json({
                errors: errors
            })
        }
        else
        {
            req.params = value
            next();
        }
    }
}

V.query = (schema) =>
{
    return (req, res, next) =>
    {
        let {value, errors} = V(req.query, schema)
        if(errors)
        {
            res.status(400).json({
                errors: errors
            })
        }
        else
        {
            req.params = value
            next();
        }
    }
}

V.body = (schema) =>
{
    return (req, res, next) =>
    {

        let {value, errors} = V(req.body, schema, req.method)
        if(errors)
        {
            res.status(400).json({
                errors: errors
            })
        }
        else
        {
            req.body = value
            next();
        }
    }
}

// END Express extensions
//////////////


module.exports = V




//-----------------

//logObject(V('2017-2-7', V.date('2011-11-11', '2017-2-7')))

