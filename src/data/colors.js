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

export function get_color_by_global_id(idx){
  return all_colors[idx]
}

export function color_to_global_id(color){
  return all_colors.indexOf(color)
}

export function get_color_by_id(id_preview){
  
  for (let i in colors){
    
    for(let j of colors[i]){
      //console.log(j)
      if(j.preview== id_preview){
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
    r.push(all_colors.indexOf(i))
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