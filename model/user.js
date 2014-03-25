module.exports = {
    properties: [
        { 
            name: 'name', 
            type: 'TEXT' 
        },
        
        { 
            name: 'email', 
            type: 'TEXT', 
            rules: [
                {
                    ruleName: 'length',
                    min: 10,
                    max: 20,
                    message: '\'<value>\' length is too short or too big.'  
                },
                {
                    ruleName: 'isEmail',
                    message: '\'<value>\' is not a valid email address.'
                }
            ] 
        }
    ]
}