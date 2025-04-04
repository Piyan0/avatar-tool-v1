<script setup>
  import { ref, computed, toRaw , useTemplateRef, onMounted } from 'vue'
  import SkinTones from './SkinTones.vue'
  import ColorSelectionWide from './ColorSelectionWide.vue'
  import Data from '@/data/current_data.js'
  import TraitsData from '@/data/traits_data.js'
  
  
  
  //it was array of ref! cool!
  const items = ref()
  
  const emit= defineEmits(['color_selected'])
  //SAVE
  const last_state= {
    'base': [-1, -1],
    'eye': [-1, -1],
    'brows': [-1, -1],
    'nose': [-1, -1],
    'mouth': [-1, -1],
    'beard': [-1, -1],
    'mark1': [-1, -1],
    'mark2': [-1, -1],
    'hair': [-1, -1],
    'bangs': [-1, -1],
    'hat': [-1, -1],
    'shirt': [-1, -1],
    'sleeve': [-1, -1],
    'top': [-1, -1],
    'special': [-1, -1],
    'acc1': [-1, -1],
    'acc2': [-1, -1],
  }
  const data= Data()
  const traits_data= TraitsData()
  const current_category= data.current_category
  const max_color= ref(1)
  
  var color_data= computed(()=>{
    var r= []
    var _data= ref(traits_data.get_data(current_category.value))
    for(let i = 0; i<_data.value.total_color; i+=1){
      var category_name= ()=>{
        var r= ``
        var is_first= true
        for(let i of current_category.value){
          if(is_first){
            is_first= false
            r+= i.toUpperCase()
          }
          else{r+= i}
        }
        
        return r
      }
      r.push({
      'idx': i,
      'category_name': current_category.value,
      'colors' :_data.value.colors[i],
      'tittle': `${category_name()} ( ${parse_tittle(i)} )`
    }
      )
    }
    return r
  }
  )
  function parse_tittle(int){
    if (int==0){
      return 'Primary'
    }
    else if(int == 1){
      return 'Secondary'
    }
    else{
      return 'Tertiery'
    }
  }
  
  function color_selected(color, idx_to_affect, current_id){
    
    emit('color_selected', toRaw(color), idx_to_affect)
    //console.log('>>>',current_id)
   // console.log('affecting', idx_to_affect)
    last_state[current_category.value][idx_to_affect]= current_id
    //console.log(last_state)
    
  }
  
  function idle(){
    for(let i of items.value){
      i.set_active(-1, false)
      i
    }
    
  }
  
  defineExpose({
    idle
  })
    
</script>


<template>

  <div class="flex flex-col">
    <SkinTones  @skin_tone_selected="color_selected" ref="items" :key="i.tittle" v-for="i in color_data" :colors="i.colors" :tittle="i.tittle" :idx_to_affect="i.idx" :last_id="last_state[i.category_name][i.idx]"></SkinTones>
  </div>

</template>

