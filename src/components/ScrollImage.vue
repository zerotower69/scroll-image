<template>
  <div class="scroll-image">
    <div class="indicator left" @click="handlePrev">
      <div class="inline-block i-custom:left text-white hover:text-blue"></div>
    </div>
    <div class="scroll-container">
      <div ref="listRef" class="scroll-list">
        <div ref="cardsRef" :class="cs('scroll-item',{
          'is-checked':getChecked(image)
        })" v-for="(image) in images" :key="image" @click="handleChecked(image)">
          <img class="image" :src="image" alt=""/>
        </div>
      </div>
    </div>
    <div class="indicator right" @click="handleNext">
      <div class="inline-block i-custom:right text-white hover:text-blue"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {nextTick, ref, watch, toRaw, computed} from "vue";
import type {PropType} from "vue"
import {useTimeoutFn, useVModel} from "@vueuse/core"
import {removeClass,addClass} from "element-plus/es/utils/index"
import cs from "classnames"

const props = defineProps({
  list:Array as PropType<string[]>,
  interval:{
    type:Number,
    default:500
  },
  checked:String
})

const emits =  defineEmits(['change'])

const active = useVModel(props,'checked')

const cardsRef=ref<HTMLElement[] |null>(null)
const listRef=ref<HTMLElement|null>(null)

const transitionStyle = computed(()=>`all ${props.interval}ms`)

const images = ref<string[]>([]);

const {stop:nextStop,start:nextStart} = useTimeoutFn(()=>{
  removeClass(listRef.value!,'animate');
  translateStyle.value= `translateX(-220px)`;
  images.value.push(images.value[0]);
  images.value.shift();
},props.interval,{immediate:false})

const {stop:prevStop,start:prevStart} = useTimeoutFn(()=>{
  removeClass(listRef.value!,'animate');
  translateStyle.value= `translateX(-220px)`;
  images.value.unshift(images.value[images.value.length-1]);
  images.value.pop()
},props.interval,{immediate:false})

function handleReset(list:string[]){
  prevStop()
  nextStop()
  //TODO;进一步判断
  if(list.length){
    active.value= list[0]
    list.unshift(list[list.length-1])
    list.pop()
    images.value=list
    nextTick(()=>{
      const $list = listRef.value;
      if($list){
        removeClass($list,'animate');
        translateStyle.value= `translateX(-220px)`
      }
    })
  }
}

watch(()=>props.list,(list)=>{
  handleReset(toRaw(list)||[])
},{immediate:true});


function getChecked(image:string){
 return image === active.value
}


const translateStyle = ref('translateX(0)')

function handlePrev(){
  const $list = listRef.value
  if($list){
    addClass($list,'animate')
    translateStyle.value= `translateX(0px)`;
    prevStart()
  }
}

function handleNext(){
  nextStop()
 const $list = listRef.value
 if($list){
   addClass($list,'animate')
   translateStyle.value= `translateX(-440px)`;
   nextStart()
 }
}

function handleChecked(image:string){
  active.value=image
  emits('change',image)
}
</script>

<style lang="scss" scoped>
.scroll-image{
  display: flex;
  align-items: center;
  gap:30px;
}
.indicator{
  font-size: 35px;
  cursor: pointer;
}
.scroll-container{
  height: 152px;
  width: 860px;
  overflow: hidden;
}
.scroll-list{
  display: flex;
  width: fit-content;
  height: 100%;
  gap: 20px;
  transform: v-bind(translateStyle);
}
.scroll-item{
  width: 200px;
  padding: 1px;
  box-sizing: border-box;
  border: 1px solid rgb(202,202,202);
  cursor: pointer;
  .image{
    width: calc(100% - 2px);
    height: calc(100% - 2px);
  }
  &.is-checked{
    border-color: #1196ff;
  }
}

.animate{
  transition:v-bind(transitionStyle);
}
</style>