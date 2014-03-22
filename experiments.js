var array = [{name: 'andrius'}, {name: 'petras'}, {name: 'arunas'}]

function remove(array, object) {
    var property = Object.keys(object)[0]
    for (var i = 0; i < array.length; i++) {
        if (array[i][property] === object[property])
            return array.s
    }
    return array
}

var test = remove(array, {vardas: 'kotletas'})

remove
// console.log(array)