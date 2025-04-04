import { ref, computed, watch } from "vue";

const current_trait_id = ref(1);
const current_category = ref("base");
const current_gender = ref("male");
const loading_state = ref(false);
const last_color_changed = ref('base');
const non_base_category = ref('hat');


watch(current_category, new_val=>{
  if(new_val!= "base"){
    non_base_category.value= new_val
  }
})

function get_cat() {
	return current_category.value;
}
export default function useCurrent() {
	return { current_trait_id, current_category, current_gender, get_cat, non_base_category, loading_state };
}
