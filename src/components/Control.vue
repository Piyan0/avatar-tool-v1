<script setup>
  import {ref, computed} from 'vue'
  import GenderButton from './GenderButton.vue'
  const emit= defineEmits(['color_selected', 'gender_changed', 'reset'])
  const tittle=ref("Colors")
  const g_male= ref()
  const g_female= ref()
  const last_id= ref(0)
  const gender= [g_male, g_female] 
  const naming= {
    0: "- Empty -",
    1: "Primary",
    2: "Secondary",
    3: "Accent",
  }
  const total_color= ref(0)
  
  const color_data= computed(()=>{
    var r= []
    var max_color= 3
    var remaining= max_color- total_color.value
    for(let i=1; i<total_color.value+1; i+=1){
      r.push(i)
    }
    for(let j=0; j<remaining; j+=1){
      r.push(0)
    }
    return r
  })
  function g_clicked(call, gender_name){
    
    emit('gender_changed', gender_name.toLowerCase())
    for(let i of gender){
      i.value.set_active(false)
    }
    call()
  }
  function set_tittle(_tittle){
    tittle.value= _tittle
  }
  function set_max(max){
    total_color.value= max
  }
  function on_color_selected(id){
    //zero based.
    last_id.value= id-1
    if (id==0){
      return
    }
    emit('color_selected', naming[id])
  }
  function set_gender_active(_gender){
    for(let i of gender){
      i.value.set_active(false)
    }
    if (_gender=="male"){
      g_male.value.set_active()
    }
    else if(_gender== "female"){
      g_female.value.set_active()
    }
  }
  
  function disable_gender_button(){
    for(let i of gender){
      //onsole.log(i.value)
      i.value.set_active(false)
    }
  }
  
  defineExpose({
    set_tittle, set_max, last_id, set_gender_active, disable_gender_button
  })
  
</script>
<template>
  <div class="flex flex-col items-center gap-1  ">
    <!--<p class="text-[#93531C] text-xs font-bold self-start">{{tittle}}</p>-->
    <!--<div class="main flex flex-col w-full p-2 gap-1">-->
    <!--  <div v-for="i in color_data" @click="on_color_selected(i)" :data-index="i" :class="{'brightness-[0.8]': i==0}" class="active:opacity-40 button px-2 text-center text-[#804838]">{{naming[i]}}</div>-->
    <!--</div>-->
    <div class="flex flex-1 flex-col items-center justify-center">
      <GenderButton ref="g_male" initial_active="true" @on_click="g_clicked" gender="Male"  inactive_texture="../images/icon/male_inactive.png" active_texture="../images/icon/male_active.png"></GenderButton>
      <GenderButton ref="g_female" @on_click="g_clicked" gender="Female"  inactive_texture="../images/icon/female_inactive.png" active_texture="../images/icon/female_active.png"></GenderButton>
      <div @click="emit('reset')" class="active:opacity-40  flex flex-1 border reset justify-center items-center w-full py-1">
        <p style="writing-mode: vertical-lr; text-orientation: upright" class="text-[#917C48]">RESET</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
	.reset {
		image-rendering: pixelated;
		border-image-source: url("../images/nine_patch/8.png");
		border-image-width: 8px;
		border-image-slice: 4 fill;
	}
  .main{
    image-rendering: pixelated;
		border-image-source: url("../images/nine_patch/2.png");
		border-image-width: 8px;
		border-image-slice: 4;
		}
	.button{
	  image-rendering: pixelated;
		border-image-source: url("../images/nine_patch/5.png");
		border-image-width: 8px;
		border-image-slice: 4 fill;
	}

</style>