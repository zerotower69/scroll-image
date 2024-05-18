<script setup lang="tsx">
import {ref} from 'vue'
import {ElMessage} from "element-plus"
import ScrollImage from "./components/ScrollImage.vue";
const images = new Array(10).fill(0).map((_,index)=>{
  index = index+1;
  return `./images/dog${index<10 ? '0'+index :index}.jpeg`
});
const checked=ref('')

function handleChange(image:string){
  ElMessage.info({
    message() {
      return (<div class="flex items-center gap-5">
        <div>当前选中图片:</div>
        <img src={image} class="w-[80px] h-[50px]" alt=""/>
      </div>)
    },
  })
}
</script>

<template>
  <a href="https://github.com/zerotower69/scroll-image" target="_blank" class="i-custom:github absolute right-5 top-5 text-[20px] text-black cursor-pointer"></a>
  <div class="w-[1200px] h-[500px] bg-black">
    <div class="flex justify-center">
      <scroll-image class="pt-[40px]" :list="images" v-model:checked="checked" @change="handleChange"/>
    </div>
    <img :src="checked" alt="checked" class="w-[200px] h-[150px] mt-[30px] float-left ml-[20px]"/>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
