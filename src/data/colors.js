import base_color from './base_color.js'
import hair_color from './hair_color.js'
import hat_color from './hat_color.js'
import eye_color from './eye_color.js'
import univ_color from './univ_color.js'

const colors=  {
  'base': base_color,
  'hair': hair_color,
  'hat': hat_color,
  'eye': eye_color,
  'univ': univ_color,
}

const all_colors= [
  ...base_color,...hair_color, ...hat_color, ...eye_color, ...univ_color
  ]
export default colors

export function get_color_category(color){
  for(let i in colors){
    for(let j of colors[i]){
      if(JSON.stringify(j.rgba)== JSON.stringify(color.rgba)) return {'category': i, 'preview': j.preview}
    }
}
  return 'no match'
}

export function get_random_colors(sample_colors){
  var r= []
  for (let i of sample_colors){
    var category_name= get_color_category(i.preview)
    var random_idx= Math.floor(Math.random()*(colors[category_name].length-1))
    r.push(colors[category_name][random_idx])
  }

  return r

}
export function get_random_color(sample_color){
  var category_name= get_color_category(sample_color).category
  //console.log(category_name)
  var random_idx= Math.floor(Math.random()*(colors[category_name].length-1))
  return colors[category_name][random_idx]
  

  

}

export function get_color_by_global_id(idx){
  return all_colors[idx]
}

export function color_to_global_id(color){
  for(let i=0; i< all_colors.length; i+= 1){
    if(all_colors[i].preview== color.preview){
      return i
    }
  }
  
  return 'no match'
}

export function get_color_by_id(id_preview){
  
  for (let i in colors){
    
    for(let j of colors[i]){
      //console.log(j)
      if(JSON.stringify(i.rgba)== JSON.stringify(color.rgba)){
        return j
      }
    }
  }
}
export function color_to_id(_color){
  for (let i in colors){
    for(let j of colors[i]){
      //console.log(j)
      if(j.preview== _color.preview){
        return j.preview
      }
    }
  }
  
}


export function change_colors_to_id(_colors){
  //console.log(_colors)
  var r= []
  
  for(let i of _colors){
    r.push(color_to_id(i))
  }
  
  return r
}
export function colors_from_id(ids){
  var r= []
  
  for(let i of ids){
    r.push(get_color_by_id(i))
  }
  
  return r
}

export function change_colors_to_global_id(_colors){
  //console.log(_colors)
  var r= []
  
  for(let i of _colors){
    r.push(color_to_global_id(i))
  }
  
  return r
}

export function colors_from_global_id(ids){
  var r= []
  
  for(let i of ids){
    r.push(get_color_by_global_id(i))
  }

  return r
}